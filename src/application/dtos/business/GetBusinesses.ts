import { z } from "zod";

export interface GetBusinessesDTO {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    planName:string;
    employeeCount:number;
    profilePic?: string;
}


export interface GetBusinessesResponseDTO {
    success: boolean;
    message: string;
    businesses?: GetBusinessesDTO[];
    totalPages: number;
    totalCount: number;
}

export const GetBusinessesRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
        status: z.enum(["All","Active", "Blocked"]).transform((val) => {
            if (val === 'All') return undefined;
            if (val === "Active" || val === "Blocked") return val;
        })
    }),
});

export type GetBusinessesRequestDTO = z.infer<typeof GetBusinessesRequestSchema>;

