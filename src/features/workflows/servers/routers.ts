import { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import z from "zod";

import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const workflow = await prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
    return workflow;
  }),

  remove: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.delete({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
      });
      return workflow;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        name: z.string().min(3).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.update({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
      return workflow;
    }),

  update: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any().optional()),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workflowId, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
          userId: ctx.auth.user.id,
        },
      });
      // Transact to update nodes and connections
      await prisma.$transaction(async (prisma) => {
        // Delete existing nodes and connections
        await prisma.node.deleteMany({
          where: {
            workflowId: workflowId,
          },
        });

        // Create new nodes
        await prisma.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: workflowId,
            name: node.type || "Unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        // Create new connections
        await prisma.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: workflowId,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        // Update workflow's updatedAt timestamp
        await prisma.workflow.update({
          where: {
            id: workflowId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      });

      return workflow;
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      const toRecord = (value: unknown): Record<string, unknown> => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return value as Record<string, unknown>;
        }
        return {};
      };

      // Transform workflow.nodes to xyflow react while preserving stored node data
      const nodes: Node[] = workflow.nodes.map((node) => {
        const data = toRecord(node.data);
        const labelValue = data["label"];
        const hasLabel = typeof labelValue === "string";

        return {
          id: node.id,
          type: node.type,
          position: node.position as { x: number; y: number },
          data: hasLabel ? data : { ...data, label: node.name },
        };
      });
      // Transform workflow.connections to xyflow react
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));
      return { id: workflow.id, name: workflow.name, nodes, edges };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),

        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          pageSize,
          hasNextPage,
          hasPreviousPage,
        },
      };
    }),
});
