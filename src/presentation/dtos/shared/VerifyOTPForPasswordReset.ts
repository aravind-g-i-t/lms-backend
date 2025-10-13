import { z } from "zod";

export const VerifyOTPForResetRequestSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    otp: z.string().length(6, "OTP must be exactly 6 characters"),
  }),
});



export type VerifyOTPForResetRequestDTO = z.infer<typeof VerifyOTPForResetRequestSchema>;