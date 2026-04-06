import { z } from 'zod'


export const UpdateLearnerProfileRequestSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, "Name should not be empty")
            .max(20, "Name should not exceed 20 characters."),
    }),
});



