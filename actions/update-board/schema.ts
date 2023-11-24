import { z } from "zod";

export const UpdateBoard = z.object({
  id: z.string(),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, { message: "Title must be at least 3 characters long" }),
});
