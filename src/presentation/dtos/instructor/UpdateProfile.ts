
import { z } from "zod";

export const UpdateInstructorProfileRequestSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, "Name should not be empty")
            .max(20, "Name should not exceed 20 characters."),
        designation: z.string()
            .trim()
            .max(20, "Designation should not exceed 20 characters.")
            .transform((v) => (v === "" ? null : v))
            .nullable(),
        website: z.string()
            .trim()
            .max(30, "Website should not exceed 30 characters.")
            .transform((v) => (v === "" ? null : v))
            .nullable(),
        bio: z.string()
            .max(500, "Bio should not exceed 500 characters.")
            .trim()
            .transform((v) => (v === "" ? null : v))
            .nullable(),
    }),
});

export type UpdateInstructorProfileRequestDTO = z.infer<typeof UpdateInstructorProfileRequestSchema>;

