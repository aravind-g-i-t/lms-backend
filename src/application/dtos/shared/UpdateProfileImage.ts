
import { z } from "zod";

export const UpdateUserProfileImageRequestSchema = z.object({
    body: z.object({
        imageURL: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
    }),
});

export type UpdateUserProfileImageRequestDTO = z.infer<typeof UpdateUserProfileImageRequestSchema>;

