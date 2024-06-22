import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import db from "@/db";
import { z } from "zod";
import { Subs, post } from "@/types";
import { sendEmail } from "@/lib/utils";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { id, given_name, email } = user!;

    if (!user!.id || !user!.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if the user is in the database
    // Get all user objects from the set
    const userJsons = await db.smembers("users");

    // Find the user object with the matching ID
    const dbUser = userJsons
      .map((userJson) => JSON.parse(userJson))
      .find((user) => user.id === id);

    if (!dbUser) {
      //create user in db
      await db.sadd("userIDs", id);

      // Add user object to the hash
      await db.sadd(`users`, { name: given_name, email, id });
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
        audioUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const id = crypto.randomUUID();
      const toPost: post = {
        ...input,
        id,
        authorId: userId,
        postedBy: ctx.user?.given_name,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = await db.sadd(`Posts`, toPost);

      if (post !== 1) throw new TRPCError({ code: "NOT_IMPLEMENTED" });
      return toPost;
    }),

  getAllPost: publicProcedure.query(async () => {
    const allPosts = (await db.smembers("Posts")) as post[];
    return allPosts;
  }),
  createSubscribers: publicProcedure
    .input(z.object({ token: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { token, email } = input;
      const SUBSCRIBE_TOKEN = process.env.SUBSCRIBE_TOKEN;

      if (token !== SUBSCRIBE_TOKEN)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Token",
        });

      const subs = await db.smembers("Subscribers");

      // Find the user object with the matching ID
      const subExist = subs
        .map((subs) => subs)
        .find((sub: any) => sub.email === email);

      if (subExist) throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" });

      await db.sadd("Subscribers", { email, subscribedAt: new Date() });

      // Send welcome email to new subscriber
      try {
        await sendEmail(email);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
        throw new TRPCError({
          code: "NOT_IMPLEMENTED",
          message: "Failed to send welcome email",
        });
      }

      return { success: true };
    }),

  getAllSubscribers: privateProcedure.query(async () => {
    const subs = (await db.smembers("Subscribers")) as Subs[];
    return subs;
  }),
});

export type AppRouter = typeof appRouter;
