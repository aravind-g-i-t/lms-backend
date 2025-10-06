import { z } from "zod";


export const ResetUserPasswordRequestSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
});


export type ResetUserPasswordRequestDTO = z.infer<typeof ResetUserPasswordRequestSchema>;
