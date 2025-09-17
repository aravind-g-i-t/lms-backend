// validation/adminAuth.ts
import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  id: z.string().min(1, { message: "Admin ID is required" }),

  currentPassword: z
    .string()
    .min(8, { message: "Current password must be at least 8 characters" }),

  newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one digit",
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message: "Password must contain at least one special character (@$!%*?&)",
    }),
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordSchema>;
