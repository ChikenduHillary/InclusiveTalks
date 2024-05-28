import { inferAsyncReturnType } from "@trpc/server";
import * as trpc from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

// This function is used to create the context for each request
export const createContext = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  // You can add any properties you want to pass to your routers here
  return {
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
