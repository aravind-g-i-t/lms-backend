import { z } from "zod";

export interface UpdateInstructorStatusResponseDTO {
    success: boolean;
    message: string;
}

export const UpdateInstructorStatusRequestSchema = z.object({
    body: z.object({
        id: z.string().min(1, "id is required")    
    }),
});

export type UpdateInstructorStatusRequestDTO = z.infer<typeof UpdateInstructorStatusRequestSchema>;

