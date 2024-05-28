import { NextApiRequest, NextApiResponse } from "next";
import * as trpcNext from "@trpc/server/adapters/next";
import Cors from "nextjs-cors";
import { appRouter } from "@/trpc";
import { createContext } from "@/trpc/context";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the cors middleware
  await Cors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: process.env.VERCEL_URL || "http://localhost:3000",
    optionsSuccessStatus: 200,
  });

  return trpcNext.createNextApiHandler({
    router: appRouter,
    createContext,
  })(req, res);
}
