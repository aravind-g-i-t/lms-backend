import { z } from 'zod'


export const GetReviewsForLearnerRequestSchema = z.object({
    query: z.object({
        skip: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        courseId: z.string(),
        learnerId:z.string().optional(),
    }),
});

export type GetReviewsForLearnerRequestDTO = z.infer<typeof GetReviewsForLearnerRequestSchema>;