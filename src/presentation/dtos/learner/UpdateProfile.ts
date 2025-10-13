import { z } from 'zod'


export const UpdateLearnerProfileRequestSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, "Name should not be empty")
            .max(20, "Name should not exceed 20 characters."),
    }),
});

export type UpdateLearnerProfileRequestDTO = z.infer<typeof UpdateLearnerProfileRequestSchema>;

export interface UpdateLearnerProfileResponseDTO {
    success: boolean,
    message: string,
    name: string,
    imageURL: string | null
}