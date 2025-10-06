import { z } from "zod";

export interface GetInstructorsDTO {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    joiningDate:Date;
    profilePic: string|null;
    verification:{
        status:string,
        remarks:string|null
    }
    
}


export interface GetInstructorsResponseDTO {
    success: boolean;
    message: string;
    instructors: GetInstructorsDTO[];
    totalPages: number;
    totalCount: number;
}

export const GetInstructorsRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
        status: z.enum(["All","Active", "Blocked"]).transform((val) => {
            if (val === 'All') return undefined;
            if (val === "Active" || val === "Blocked") return val;
        }),
        verificationStatus: z.enum(["All","Not Submitted","Under Review","Verified","Rejected"]).transform((val) => {
            if (val === 'All') return undefined;
            if (val === "Not Submitted" || val === "Under Review"|| val === "Verified"|| val === "Rejected") return val;
        }),
    }),
});

export type GetInstructorsRequestDTO = z.infer<typeof GetInstructorsRequestSchema>;

