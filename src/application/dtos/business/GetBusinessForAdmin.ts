import { z } from "zod";

export const GetBusinessForAdminRequestSchema = z.object({
  params: z.object({
        id: z.string().min(1, "id is required")    
    }),
});



export type GetBusinessForAdminRequestDTO = z.infer<typeof GetBusinessForAdminRequestSchema>;