import { z } from "zod";
import { Role } from "shared/types/common";

export interface UserSigninDTO {
    id: string;
    name: string;
    profilePic: string | null;

}



export const UserSigninRequestSchema = z.object({
    body: z.object({
        role: z.enum(["learner", "instructor", "business"]),
        email: z.email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
});



export interface UserSigninResponseDTO {
    success: boolean;
    message: string;
    role: Role;
    user: UserSigninDTO;
    accessToken: string;
}

export type UserSigninRequestDTO = z.infer<typeof UserSigninRequestSchema>;