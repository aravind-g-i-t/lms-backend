import { z } from "zod";


export interface AdminSigninResponseDTO{
    success:boolean;
    message:string;
    id?:string;
    email?:string;
    accessToken?:string;
    refreshToken?:string
}


export const AdminSigninRequestSchema = z.object({
  email: z
    .preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), z.string().email({ message: "Invalid email" })),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});


export type AdminSigninRequestDTO = z.infer<typeof AdminSigninRequestSchema>;
