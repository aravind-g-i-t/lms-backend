
import { z } from "zod";

export const UpdateInstructorExpertiseRequestSchema = z.object({
    body: z.object({
        expertise: z.array(
            z.string()
            .trim()
            .min(1, "Empty strings are not allowed")
            .max(20,"Expertise should not exceed 20 characters"),
        ),

    }),
});

export type UpdateInstructorExpertiseRequestDTO = z.infer<typeof UpdateInstructorExpertiseRequestSchema>;

