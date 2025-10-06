
import { z } from "zod";

export const UpdateInstructorProfileRequestSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name cannot be empty"),
        designation: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
        website: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
        bio: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
    }),
});

export type UpdateInstructorProfileRequestDTO = z.infer<typeof UpdateInstructorProfileRequestSchema>;

