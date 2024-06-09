import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

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
    .input(
      z.object({
        text: z.string(),
        writtenBy: z.string(),
        imgUrl: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const post = await db.post.create({
        data: {
          text: input.text,
          writtenBy: input.writtenBy,
          imgUrl: input.imgUrl,
          title: input.title,
          authorId: userId,
        },
      });

      return post;
    }),

  getAllPost: publicProcedure.query(async () => {
    return await db.post.findMany();
  }),
  createSubscribers: publicProcedure
    .input(z.object({ token: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { token, email } = input;
      const SUBSCRIBE_TOKEN = process.env.SUBSCRIBE_TOKEN;

      return { token, SUBSCRIBE_TOKEN };

      if (token !== SUBSCRIBE_TOKEN)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Token",
        });

      const emailExist = await db.subscribers.findFirst({
        where: {
          email,
        },
      });

      if (emailExist)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already exist",
        });

      const subscribe = await db.subscribers.create({
        data: {
          email,
        },
      });

      return subscribe;
    }),
});

export type AppRouter = typeof appRouter;
