import { z } from "zod";

export const postValidations = z.object({
  post: z.string().min(5, { message: "Must be 5 or more characters long" }),
  writtenBy: z
    .string()
    .min(1, { message: "Must be 1 or more characters long" }),
  title: z.string().min(1, { message: "Must be 1 or more characters long" }),
});
