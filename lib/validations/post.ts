import { z } from "zod";

export const postValidations = z.object({
  writtenBy: z
    .string()
    .min(1, { message: "Must be 1 or more characters long" }),
  title: z.string().min(1, { message: "Must be 1 or more characters long" }),
});
