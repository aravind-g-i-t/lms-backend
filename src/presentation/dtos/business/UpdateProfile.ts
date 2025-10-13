
import { z } from "zod";

export const UpdateBusinessProfileRequestSchema = z.object({
    body: z.object({
        name: z.string()
        .min(1, "Name cannot be empty")
        .max(20, "Name should not exceed 20 characters."),
        businessDomain: z.string()
        .trim()
        .max(20, "Domain should not exceed 20 characters.")
        .transform((v) => (v === "" ? null : v))
        .nullable(),
        website: z.string()
        .trim()
        .max(30, "Website should not exceed 30 characters.")
        .transform((v) => (v === "" ? null : v))
        .nullable(),
        location: z.string()
        .trim()
        .max(30, "Location should not exceed 30 characters.")
        .transform((v) => (v === "" ? null : v))
        .nullable(),
    }),
});

export type UpdateBusinessProfileRequestDTO = z.infer<typeof UpdateBusinessProfileRequestSchema>;

