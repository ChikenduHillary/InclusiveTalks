import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import db from "@/db";
import { z } from "zod";
import { Subs, post } from "@/types";
import { sendEmail } from "@/app/actions";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { id, given_name, email } = user!;

    if (!user?.id || !user?.email) {
      console.log("omo no be lie oh");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // check if the user is in the database
    // Get all user objects from the set
    const userJsons = await db.smembers("users");

    // Find the user object with the matching ID
    const dbUser = userJsons
      .map((userJson) => JSON.parse(userJson))
      .find((user) => user?.id === id);

    console.log("dbUser trpc", dbUser);

    if (!dbUser) {
      // Add user object to the hash
      await db.sadd(`users`, { name: given_name, email, id });
    } 

    return { success: true };
  }),

  createPost: privateProcedure
    .input(
      z.object({
        writtenBy: z.string(),
        imgUrl: z.string(),
        title: z.string(),
        audioUrl: z.string(),
        content: z.string(),
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
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const post = await db.sadd(`Posts`, toPost);

      if (post !== 1) throw new TRPCError({ code: "NOT_IMPLEMENTED" });
      return toPost;
    }),

  deleteBlog: privateProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { blogId } = input;

      // Assuming your posts are stored in a set called `Posts`
      const posts = (await db.smembers(`Posts`)) as post[];
      const postToDelete = posts.find((post) => post.id === blogId);

      if (!postToDelete) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const result = await db.srem(`Posts`, postToDelete);

      if (result !== 1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }

      console.log("done");
      return { success: true };
    }),

  updatePost: publicProcedure
    .input(
      z.object({
        id: z.string(),
        likes: z.number().optional(),
        views: z.number().optional(),
        comments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, likes, views, comments } = input;

      // Assuming your posts are stored in a set called `Posts`
      const posts = (await db.smembers(`Posts`)) as post[];
      const postToUpdate = posts.find((post) => post.id === id);

      if (!postToUpdate) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const updatedPost = {
        ...postToUpdate,
        likes:
          likes !== undefined
            ? postToUpdate.likes
              ? postToUpdate.likes + likes
              : 1
            : postToUpdate.likes,
        views:
          views !== undefined
            ? postToUpdate.views
              ? postToUpdate.views + 1
              : 1
            : postToUpdate.views,
        comments:
          comments !== undefined
            ? postToUpdate.comments
              ? [
                  ...postToUpdate.comments,
                  { comment: comments[0], timeCreated: new Date() },
                ]
              : [{ comment: comments[0], timeCreated: new Date() }]
            : postToUpdate.comments,
        updatedAt: new Date(),
      };

      console.log({ updatedPost });

      const result = await db.srem(`Posts`, postToUpdate);
      console.log({ result });
      if (result !== 1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
        });
      }

      const addResult = await db.sadd(`Posts`, updatedPost);
      console.log({ addResult });
      if (addResult !== 1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add updated post",
        });
      }

      return updatedPost;
    }),

  getBlogPost: publicProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const allBlogs = (await db.smembers("Posts")) as post[];

      const blog = allBlogs
        .map((blog) => blog)
        .find((blog) => blog.id == input.blogId);

      return blog;
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
