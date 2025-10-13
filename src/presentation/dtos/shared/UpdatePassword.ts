// validation/adminAuth.ts
import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  body: z.object({


    currentPassword: z
      .string()
      .min(8,"Current password must be at least 8 characters" )
      .max(20, "Password should not exceed 20 characters.")
      ,

    newPassword: z
      .string()
      .min(8,  "New password must be at least 8 characters" )
      .max(20, "Password should not exceed 20 characters.")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val),  "Password must contain at least one lowercase letter")
      .refine((val) => /\d/.test(val),  "Password must contain at least one digit")
      .refine((val) => /[@$!%*?&]/.test(val),  "Password must contain at least one special character (@$!%*?&)"),
  })
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordSchema>;
