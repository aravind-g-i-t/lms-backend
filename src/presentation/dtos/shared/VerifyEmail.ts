import { z } from "zod";




export const VerifyEmailRequestSchema = z.object({
    body: z.object({
        role: z.enum(["learner", "instructor", "business"]),
        email: z.email("Invalid email format"),
    })
});


export type VerifyEmailRequestDTO = z.infer<typeof VerifyEmailRequestSchema>;