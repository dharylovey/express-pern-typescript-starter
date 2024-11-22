import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(3, { message: "Email must be at least 3 characters long" })
    .regex(/^\S+@\S+$/i, { message: "Email must be a valid email address" }),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be at least 6 characters long",
    })
    .max(6, {
      message: "Verification code must be at most 6 characters long",
    }),
});

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Email must be a valid email address" })
      .min(3, { message: "Email must be at least 3 characters long" })
      .regex(/^\S+@\S+$/i, { message: "Email must be a valid email address" }),
  })
  .refine((data) => data.email, {
    message: "Email is required",
    path: ["email"],
  });

export type UserSchema =
  | z.infer<typeof loginSchema>
  | z.infer<typeof registerSchema>;

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type ForgotVerifyEmailSchema = z.infer<typeof forgotPasswordSchema>;
