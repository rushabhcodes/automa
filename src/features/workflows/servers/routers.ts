import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const workflowsRouter = createTRPCRouter({

    create: premiumProcedure
        .mutation(async ({ ctx }) => {
            const workflow = await prisma.workflow.create({
                data: {
                    name: generateSlug(3),
                    userId: ctx.auth.user.id,
                },
            });
            return workflow;
        }),

    remove: protectedProcedure
        .input(
            z.object({
                workflowId: z.string(),
            })
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
            })
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

    getOne: protectedProcedure
    .input(
        z.object({
            workflowId: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: input.workflowId,
                userId: ctx.auth.user.id,
            },
        });
        return workflow;
    }),

    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            const workflows = await prisma.workflow.findMany({
                where: {
                    userId: ctx.auth.user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return workflows;
        }),
});