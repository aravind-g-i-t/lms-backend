import { z } from "zod";

export const GetInstructorForAdminRequestSchema = z.object({
  params: z.object({
        id: z.string().min(1, "id is required")    
    }),
});



export type GetInstructorForAdminRequestDTO = z.infer<typeof GetInstructorForAdminRequestSchema>;