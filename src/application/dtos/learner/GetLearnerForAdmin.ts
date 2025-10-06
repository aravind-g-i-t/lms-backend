import { z } from "zod";

export const GetLearnerForAdminRequestSchema = z.object({
  params: z.object({
        id: z.string().min(1, "id is required")    
    }),
});



export type GetLearnerForAdminRequestDTO = z.infer<typeof GetLearnerForAdminRequestSchema>;