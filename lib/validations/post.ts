import { z } from "zod";

export const postValidations = z.object({
  post: z.string().min(5, { message: "Must be 5 or more characters long" }),
});
