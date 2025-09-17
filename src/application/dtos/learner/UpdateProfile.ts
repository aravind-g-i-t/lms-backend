import { z } from 'zod'


export const UpdateLearnerProfileRequestSchema = z.object({
    body: z.object({
        id: z.string(),
        data: z.object({
            name: z.string().optional(),
            imageURL: z.string().optional(), 
        }),
    }),
});

export type UpdateLearnerProfileRequestDTO = z.infer<typeof UpdateLearnerProfileRequestSchema>;

export interface UpdateLearnerProfileResponseDTO {
    success: boolean,
    message: string,
    name: string,
    imageURL?:string
}