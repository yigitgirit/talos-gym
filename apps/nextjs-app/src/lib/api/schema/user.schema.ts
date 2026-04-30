import { z } from 'zod';
import {
    GenderSchema,
    RoleSchema,
    EmailSchema,
    PasswordSchema,
    NameSchema,
    OptionalNameSchema,
    AddressSchema,
    NonBlankStringSchema,
    ChangePasswordSchema,
    createPagedDataSchema, PhoneNumberSchema
} from './common.schema';

export const UserStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'BANNED']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    email: z.string(),
    phoneNumber: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    gender: GenderSchema.nullish().transform((value) => value ?? 'NOT_SPECIFIED'),
    roles: z.array(RoleSchema),
    status: UserStatusSchema,
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UserCreateRequestSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
    firstName: NameSchema,
    lastName: NameSchema,
    roles: z.array(RoleSchema).min(1, 'At least one role must be assigned'),
    gender: GenderSchema.optional(),
});
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;

export const UpdateUserRequestSchema = z.object({
    firstName: OptionalNameSchema,
    lastName: OptionalNameSchema,
    gender: GenderSchema.optional(),
    address: AddressSchema.optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const UserBanRequestSchema = z.object({
    reason: NonBlankStringSchema,
});
export type UserBanRequest = z.infer<typeof UserBanRequestSchema>;

export const ChangePasswordRequestSchema = z
    .object({
        currentPassword: NonBlankStringSchema,
        newPassword: ChangePasswordSchema,
        confirmNewPassword: NonBlankStringSchema,
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmNewPassword) {
            ctx.addIssue({ code: 'custom', path: ['confirmNewPassword'], message: 'New passwords do not match.' });
        }
    });
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const EmailChangeInitiateRequestSchema = z.object({
    newEmail: EmailSchema,
});
export type EmailChangeInitiateRequest = z.infer<typeof EmailChangeInitiateRequestSchema>;

export const PhoneChangeInitiateRequestSchema = z.object({
    newPhoneNumber: PhoneNumberSchema,
});
export type PhoneChangeInitiateRequest = z.infer<typeof PhoneChangeInitiateRequestSchema>;

export const PagedUserResponseSchema = createPagedDataSchema(UserResponseSchema);
export type PagedUserResponse = z.infer<typeof PagedUserResponseSchema>;