import { z } from "zod";

export const UpdateCard = z.object({
  id: z.string(),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, { message: "Title must be at least 3 characters long" })
  ),
  description: z.optional(z.string()),
  boardId: z.string(),
});
