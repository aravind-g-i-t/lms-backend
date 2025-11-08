import {z} from "zod"


export const GetCoursesForAdminRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
        status: z.enum(["published", "draft","archived"]).optional(),
        verificationStatus: z.enum(["verified", "under_review","not_verified","rejected","blocked"]).optional(),
    }),
});

export type GetCoursesForAdminRequestDTO = z.infer<typeof GetCoursesForAdminRequestSchema>;