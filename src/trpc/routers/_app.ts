import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({

    getWorkflows: protectedProcedure
        .query(({ ctx }) => {
            return prisma.workflow.findMany(
            );
        }),

    createWorkflow: protectedProcedure
        .mutation(async ({ ctx }) => {
            await inngest.send({
                name: 'automa/hello.world',
                data: {
                    email: ctx.auth.user.email,
                },
            })

            return {
                success: true,
                message: 'Job queued successfully',
            }
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;