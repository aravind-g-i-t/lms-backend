import { Enrollment } from "@domain/entities/Enrollment";
import { z } from "zod";




export interface GetEnrollmentsResponseDTO {
    success: boolean;
    message: string;
    enrollments: Enrollment[];
    totalCount: number;
}

export const GetEnrollmentsRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
    }),
});

export type GetEnrollmentsRequestDTO = z.infer<typeof GetEnrollmentsRequestSchema>;

