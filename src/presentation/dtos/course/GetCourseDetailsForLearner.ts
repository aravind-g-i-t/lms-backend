import { z } from "zod";

export const GetCourseDeatailsForLearnerRequestSchema = z.object({
  query: z.object({
        courseId: z.string().min(1, "id is required"),
        learnerId:z.string().optional().transform(v => v ?? null)
    }),
});



export type GetCourseDeatailsForLearnerRequestDTO = z.infer<typeof GetCourseDeatailsForLearnerRequestSchema>;