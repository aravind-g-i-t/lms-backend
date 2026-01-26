import { z } from 'zod'


export const GetSessionListForInstructorRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string(),
        status: z.enum(["scheduled" , "live" , "ended" , "cancelled"]).optional()
    }),
});

export type GetSessionListRequestDTO = z.infer<typeof GetSessionListForInstructorRequestSchema>;