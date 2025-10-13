
import { z } from "zod";

export const UpdateUserProfileImageRequestSchema = z.object({
  body: z.object({
    imageURL: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .refine(
        (url) =>
          url === null ||
          /\.(jpg|jpeg|png|webp)$/i.test(url.split('?')[0]),
        {
          message: "Image URL must end with .jpg, .jpeg, .png, or .webp",
        }
      ),
  }),
});

export type UpdateUserProfileImageRequestDTO = z.infer<typeof UpdateUserProfileImageRequestSchema>;

