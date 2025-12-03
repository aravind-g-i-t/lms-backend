import {  z } from "zod";

const StringToNumber = z.string().pipe(
    z.coerce.number({
        error: "Must be a valid number string"
    })
);

// 1. Define the Sort Object Schema


const ObjectIDSchema = z.string()
    .length(24, { message: "ID must be 24 characters long" })
    .regex(/^[0-9a-fA-F]+$/, { message: "ID must be a hexadecimal string" });


// --- FIX APPLIED HERE: categoryIds[] coercion ---
const ObjectIdArraySchema = z.union([
    z.string(), // Accepts a single string (when only one ID is provided)
    z.array(z.string()) // Accepts an array of strings (when multiple IDs are provided)
])
    .optional()
    .default([]) // Default to an empty array
    .transform(val => {
        // If val is a string, wrap it in an array; otherwise, return the array
        const ids = Array.isArray(val) ? val : (val ? [val] : []);

        // Now validate every element of the resulting array using ObjectIDSchema
        return z.array(ObjectIDSchema).parse(ids);
    });

const StringArraySchema = z.union([
    z.string(),
    z.array(z.string())
]).optional()
.default([])
.transform(val => {
        // If val is a string, wrap it in an array; otherwise, return the array
        const levels = Array.isArray(val) ? val : (val ? [val] : []);

        // Now validate every element of the resulting array using ObjectIDSchema
        return levels
    });


export const GetCoursesForLearnerRequestSchema = z.object({
    query: z.object({
        // Standard Parameters
        limit: StringToNumber.default(10).refine(val => val > 0, {
            message: "Limit must be a positive number"
        }),
        page: StringToNumber.default(1).refine(val => val > 0, {
            message: "Page must be a positive number"
        }),
        minRating: StringToNumber.default(0).refine(val => val >= 0 && val <= 5, {
            message: "Rating must be between 0 and 5"
        }),

        // Search Parameter
        search: z.string().optional().default(''),

        // Array Parameters with Coercion
        'instructorIds[]': ObjectIdArraySchema,
        'categoryIds[]': ObjectIdArraySchema,
        "levels[]":StringArraySchema,

        // Price Range Array (This still requires multiple values for 'length(2)' check)
        'priceRange[]': z.array(StringToNumber).length(2, {
            message: "Price range must contain exactly two numbers (min and max)"
        }),

        'durationRange[]': z.array(StringToNumber).length(2, {
            message: "Duration range must contain exactly two numbers (min and max)"
        }),

        sort: z.string().default('latest'),

        learnerId:ObjectIDSchema.nullable()
    }),
});