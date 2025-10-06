import { z } from "zod";

export const UpdateUserStatusRequestSchema = z.object({
  body: z.object({
        id: z.string().min(1, "id is required")    
    }),
});



export type UpdateUserStatusRequestDTO = z.infer<typeof UpdateUserStatusRequestSchema>;