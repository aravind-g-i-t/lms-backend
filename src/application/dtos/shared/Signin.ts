import { z } from "zod";
import { Role } from "shared/types/common";

export interface LearnerSigninDTO {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
    profilePic?: string;

}

export interface InstructorSigninDTO {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    walletBalance: number;
    profilePic?: string;
    resume?: string;
    website?:string;
    bio?:string;
}

export interface BusinessSigninDTO {
    id: string;
    name: string;
    email: string;
    planId?: string;
    planStartDate?: Date;
    planEndDate?: Date;
    maxEmployees?: number;
    profilePic?: string;

}


export const UserSigninRequestSchema = z.object({
    role: z.enum(["learner", "instructor", "business"]),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});



export interface UserSigninResponseDTO {
    success: boolean;
    message: string;
    role: Role;
    user: BusinessSigninDTO | LearnerSigninDTO | InstructorSigninDTO;
    accessToken: string;
}

export type UserSigninRequestDTO = z.infer<typeof UserSigninRequestSchema>;