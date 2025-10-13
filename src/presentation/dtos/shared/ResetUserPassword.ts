import { z } from "zod";


export const ResetUserPasswordRequestSchema = z.object({
    body: z.object({
        currentPassword: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password should not exceed 20 characters."),
        newPassword: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password should not exceed 20 characters."),
    })
});


export type ResetUserPasswordRequestDTO = z.infer<typeof ResetUserPasswordRequestSchema>;
