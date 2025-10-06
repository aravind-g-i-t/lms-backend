import { z } from "zod";

export const GoogleSigninRequestSchema = z.object({
  body: z.object({
    token: z.string(),
    role: z.enum(["learner", "instructor", "business"]),
  })
});



export type GoogleSigninRequestDTO = z.infer<typeof GoogleSigninRequestSchema>;