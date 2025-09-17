import { z } from "zod";

export interface UpdateLearnerStatusResponseDTO {
    success: boolean;
    message: string;
}

export const UpdateLearnerStatusRequestSchema = z.object({
    body: z.object({
        id: z.string().min(1, "id is required")    
    }),
});

export type UpdateLearnerStatusRequestDTO = z.infer<typeof UpdateLearnerStatusRequestSchema>;

