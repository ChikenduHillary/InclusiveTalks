import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { date, z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    console.log(user);

    if (!user!.id || !user!.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user!.id,
      },
    });

    if (!dbUser) {
      //create user in db
      await db.user.create({
        data: {
          id: user!.id,
          email: user!.email,
        },
      });
    }

    return { success: true };
  }),

  createPost: privateProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const post = await db.post.create({
        data: {
          text: input.text,
          authorId: userId,
        },
      });

      console.log(post);
      return post;
    }),

  getAllPost: privateProcedure.query(async () => {
    return await db.post.findMany();
  }),
});

export type AppRouter = typeof appRouter;
