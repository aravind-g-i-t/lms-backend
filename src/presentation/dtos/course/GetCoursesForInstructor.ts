import {z} from "zod"


export const GetCoursesForInstructorRequestSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).default('1').transform(Number),
        limit: z.string().regex(/^\d+$/).default('10').transform(Number),
        search: z.string().optional().transform((v) => v || undefined),
        status: z.enum(["all","published", "draft","archived"]).transform((val) => {
            if (val === "all") return undefined;
            return val;
        }),
    }),
});

export type GetCoursesForInstructorRequestDTO = z.infer<typeof GetCoursesForInstructorRequestSchema>;