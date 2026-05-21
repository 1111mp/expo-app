import { z } from '@/lib/zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Invalid name'),
        description: z.string().min(1, 'Invalid description'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: 'desc' },
      where: {
        createdBy: { id: ctx.session.user.id },
      },
    });

    return post ?? null;
  }),

  getPosts: protectedProcedure.query(({ ctx }) =>
    ctx.db.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        createdBy: { id: ctx.session.user.id },
      },
    }),
  ),
});
