import { z } from "zod";


export const SetUserPasswordRequestSchema = z.object({
    body: z.object({
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters" })
            .max(20, "Password should not exceed 20 characters"),
    })
});


export type SetUserPasswordRequestDTO = z.infer<typeof SetUserPasswordRequestSchema>;