import { z } from "zod";

export interface GetInstructorVerificationsDTO {
    id: string;
    name: string;
    email: string;
    status: "Pending" | "Verified" | "Rejected";
    appliedOn: Date;
    profilePic: string | null;
    
}


export interface GetInstructorVerificationsResponseDTO {
    success: boolean;
    message: string;
    instructorVerifications: GetInstructorVerificationsDTO[];
    totalPages: number;
    totalCount: number;
}

export const GetInstructorVerificationsRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
        status: z.enum(["All","Pending","Verified", "Rejected"]).transform((val) => {
            if (val === 'All') return undefined;
            if (val === "Verified" || val === "Rejected"|| val==="Pending") return val;
        })
    }),
});

export type GetInstructorVerificationsRequestDTO = z.infer<typeof GetInstructorVerificationsRequestSchema>;

