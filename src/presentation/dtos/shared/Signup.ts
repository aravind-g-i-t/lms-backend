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
        name: z.string()
            .min(1, "Name is required")
            .max(20, "Name should not exceed 20 characters")
            .regex(/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces"),

        email: z.string()
            .email("Invalid email format")
            .max(100, "Email cannot exceed 100 characters"),

        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(30, "Password cannot exceed 30 characters")
            .regex(/[A-Z]/, "Must contain uppercase letter")
            .regex(/[a-z]/, "Must contain lowercase letter")
            .regex(/\d/, "Must contain a number")
            .regex(/[@$!%*?&#]/, "Must contain special character"),

    })
});

export type UserSignupRequestDTO = z.infer<typeof UserSignupRequestSchema>;