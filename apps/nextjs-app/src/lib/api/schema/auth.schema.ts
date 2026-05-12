import { z } from 'zod';
import {
    IdentifierSchema,
    NonBlankStringSchema,
    EmailSchema,
    PhoneNumberSchema,
    PasswordSchema,
    NameSchema,
    GenderSchema,
    OtpCodeSchema,
    TokenSchema,
    ResetPasswordSchema
} from './common.schema';

export const LoginRequestSchema = z.object({
    identifier: IdentifierSchema,
    password: NonBlankStringSchema,
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenType: z.string().default('Bearer'),
    accessTokenExpiresIn: z.number().int().nonnegative(),
    refreshTokenExpiresIn: z.number().int().nonnegative(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshRequestSchema = z.object({
    refreshToken: NonBlankStringSchema,
});
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

export const RefreshResponseSchema = LoginResponseSchema;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const RegisterRequestSchema = z.object({
    email: EmailSchema,
    phoneNumber: PhoneNumberSchema,
    password: PasswordSchema,
    firstName: NameSchema,
    lastName: NameSchema,
    gender: GenderSchema.optional(),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const VerifyOtpRequestSchema = z.object({
    phoneNumber: PhoneNumberSchema,
    otpCode: OtpCodeSchema,
});
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;

export const VerifyOtpResponseSchema = z.object({
    resetToken: z.string(),
});
export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>;

export const ResendVerificationRequestSchema = z.object({
    identifier: IdentifierSchema,
});
export type ResendVerificationRequest = z.infer<typeof ResendVerificationRequestSchema>;

export const ResetPasswordRequestSchema = z
    .object({
        resetToken: TokenSchema,
        newPassword: ResetPasswordSchema,
        confirmNewPassword: ResetPasswordSchema,
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmNewPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmNewPassword'],
                message: 'Passwords do not match.',
            });
        }
    });
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const ForgotPasswordRequestSchema = z.object({
    phoneNumber: PhoneNumberSchema,
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;