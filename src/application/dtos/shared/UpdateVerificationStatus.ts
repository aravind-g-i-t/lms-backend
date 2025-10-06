import { z } from "zod";

export const UpdateUserVerificationStatusRequestSchema = z.object({
  body: z.object({
        id: z.string().min(1, "id is required"),
        status:z.enum(["Verified", "Rejected"]),
        remarks: z.string().trim().transform((v) => (v === "" ? null : v)).nullable()
    }),
});



export type UpdateUserVerificationStatusRequestDTO = z.infer<typeof UpdateUserVerificationStatusRequestSchema>;