import { z } from "zod";

export const OTPVerificationRequestSchema = z.object({
  email: z.email("Invalid email format"),
  otp: z.string().min(6, "OTP must be at least 6 characters"), 
  role: z.enum(["learner", "instructor", "business"]),
});



export interface OTPVerificationResponseDTO{
    success:boolean;
    message:string;
}


export type OTPVerificationRequestDTO = z.infer<typeof OTPVerificationRequestSchema>;