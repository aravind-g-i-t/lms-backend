import { z } from 'zod';

export interface UserSignupResponseDTO {
    success: boolean;
    message: string;
    email: string;
    otpExpiresAt: Date;
    role: string
}

export const UserSignupRequestSchema = z.object({
    body: z.object({
        role: z.enum(["learner", "instructor", "business"]),
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
});

export type UserSignupRequestDTO = z.infer<typeof UserSignupRequestSchema>;