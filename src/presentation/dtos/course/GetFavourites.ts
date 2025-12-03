import { z } from "zod";

const StringToNumber = z.string().pipe(
    z.coerce.number({
        error: "Must be a valid number string"
    })
);






export const GetFavouritesRequestSchema = z.object({
    query: z.object({
        limit: StringToNumber.default(10).refine(val => val > 0, {
            message: "Limit must be a positive number"
        }),
        page: StringToNumber.default(1).refine(val => val > 0, {
            message: "Page must be a positive number"
        }),

        search: z.string().optional().default(''),

    }),
});