import { z } from "zod"
import {
    EmailSchema,
    GenderSchema, IdentifierSchema,
    NameSchema,
    NonBlankStringSchema,
    PasswordSchema,
    PhoneNumberSchema, RegisterRequest
} from "@/lib/api/schema";

export const loginPhoneSchema = z.object({
    identifier: PhoneNumberSchema,
    password: NonBlankStringSchema,
})

export const emailLoginSchema = z.object({
  identifier: EmailSchema,
  password: NonBlankStringSchema
})

export const loginSchema = z.object({
    identifier: IdentifierSchema,
    password: NonBlankStringSchema,
})

export const registerSchema = z
  .object({
    firstName: NameSchema,
    lastName: NameSchema,
    email: EmailSchema,
    phoneNumber: PhoneNumberSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: GenderSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }) satisfies z.ZodType<RegisterRequest & { confirmPassword: string }>

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
