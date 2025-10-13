import { z } from "zod";

export const ResendOTPRequestSchema = z.object({
    body: z.object({
        email: z.email("Invalid email format."),
    })
});

export type ResendOTPRequestDTO = z.infer<typeof ResendOTPRequestSchema>;