import { z } from "zod";


export const SetUserPasswordRequestSchema = z.object({
  body: z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
});


export type SetUserPasswordRequestDTO = z.infer<typeof SetUserPasswordRequestSchema>;