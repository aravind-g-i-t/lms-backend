import { z } from "zod";

export interface GetLearnersDTO {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    profilePic: string|null;
}


export interface GetLearnersResponseDTO {
    success: boolean;
    message: string;
    learners?: GetLearnersDTO[];
    totalPages: number;
    totalCount: number;
}

export const GetLearnersRequestSchema = z.object({
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

export type GetLearnersRequestDTO = z.infer<typeof GetLearnersRequestSchema>;

