
import { z } from "zod";

export const UpdateBusinessProfileRequestSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name cannot be empty"),
        businessDomain: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
        website: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
        location: z.string().trim().transform((v) => (v === "" ? null : v)).nullable(),
    }),
});

export type UpdateBusinessProfileRequestDTO = z.infer<typeof UpdateBusinessProfileRequestSchema>;

