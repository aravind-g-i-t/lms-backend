import { z } from "zod";

export const UpdateUserStatusRequestSchema = z.object({
  id: z.string(), 
});



export type UpdateUserStatusRequestDTO = z.infer<typeof UpdateUserStatusRequestSchema>;