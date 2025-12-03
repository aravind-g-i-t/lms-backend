import {z} from "zod"

export const GetAllCouponsRequestSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).default("1").transform(Number),
    limit: z.string().regex(/^\d+$/).default("10").transform(Number),
    search: z.string().optional().transform((v) => v || undefined),

    isActive: z
      .string()
      .optional()
      .transform((v) => (v === "true" ? true : v === "false" ? false : undefined)),
  }),
});


export type GetAllCouponsRequestDTO = z.infer<typeof GetAllCouponsRequestSchema>;