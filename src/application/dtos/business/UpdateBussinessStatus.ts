import { z } from "zod";

export interface UpdateBusinessStatusResponseDTO {
    success: boolean;
    message: string;
}

export const UpdateBusinessStatusRequestSchema = z.object({
    body: z.object({
        id: z.string().min(1, "id is required")    
    }),
});

export type UpdateBusinessStatusRequestDTO = z.infer<typeof UpdateBusinessStatusRequestSchema>;

