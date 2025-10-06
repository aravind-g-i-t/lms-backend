import { z } from "zod";

export const VerifyOTPForResetRequestSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    otp: z.string().min(6, "OTP must be at least 6 characters"),
  })
});


export type VerifyOTPForResetRequestDTO = z.infer<typeof VerifyOTPForResetRequestSchema>;