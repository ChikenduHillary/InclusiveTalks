import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/trpc";
import { httpBatchLink } from "@trpc/client";

// Create a tRPC React instance
export const trpc = createTRPCReact<AppRouter>();

// Define a function to create the tRPC client with the correct URL
export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url:
          process.env.NEXT_PUBLIC_TRPC_API_URL ||
          "http://localhost:3000/api/trpc",
      }),
    ],
  });
};
