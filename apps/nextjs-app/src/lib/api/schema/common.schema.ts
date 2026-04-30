import { z } from 'zod';
import { ROLES } from '@/constants/roles';

// --- Shared patterns / primitives ---
export const PHONE_REGEX = /^\+?[0-9. ()-]{7,25}$/;
export const NAME_REGEX = /^[\p{L} .'-]+$/u;
export const EMAIL_REGEX = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,7}$/;

export const NonBlankStringSchema = z.string().trim().min(1, 'Cannot be blank');

export const EmailSchema = z
    .email()
    .regex(EMAIL_REGEX, 'Please provide a valid email address');

export const PhoneNumberSchema = z
    .string()
    .trim()
    .min(1, 'Phone number cannot be blank')
    .regex(PHONE_REGEX, 'Please provide a valid phone number');

export const PasswordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long');

export const ResetPasswordSchema = z
    .string()
    .min(8, 'Password must be between 8 and 64 characters')
    .max(64, 'Password must be between 8 and 64 characters');

export const ChangePasswordSchema = z
    .string()
    .min(8, 'Password must be between 8 and 128 characters')
    .max(128, 'Password must be between 8 and 128 characters');

export const NameSchema = z
    .string()
    .trim()
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters')
    .regex(NAME_REGEX, 'Name contains invalid characters');

export const OptionalNameSchema = z
    .string()
    .trim()
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters')
    .regex(NAME_REGEX, 'Name contains invalid characters')
    .optional();

export const IdentifierSchema = NonBlankStringSchema;
export const TokenSchema = z.string().trim().min(1);
export const ReferenceIdSchema = z.string().trim().min(1);
export const OtpCodeSchema = z.string().trim().min(1);
export const AddressSchema = z.string().max(255);

// --- Shared Enums ---
export const GenderSchema = z.enum(['NOT_SPECIFIED', 'MALE', 'FEMALE', 'EITHER'], {
    message: 'Please select a valid gender option',
});
export type Gender = z.infer<typeof GenderSchema>;

export const RoleSchema = z.enum(ROLES, {
    message: 'Please select a valid role',
});
export type Role = z.infer<typeof RoleSchema>;

// --- Shared API/Error DTOs ---
export const ValidationErrorDetailSchema = z.object({
    field: z.string(),
    message: z.string(),
    rejectedValue: z.unknown().optional(),
});
export type ValidationErrorDetail = z.infer<typeof ValidationErrorDetailSchema>;

export const ApiErrorResponseSchema = z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(ValidationErrorDetailSchema).optional(),
});
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// --- Pagination DTOs ---
export const PageMetadataSchema = z.object({
    size: z.number().int().nonnegative(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    number: z.number().int().nonnegative(),
});
export type PageMetadata = z.infer<typeof PageMetadataSchema>;

export type PagedData<T> = {
    content: T[];
    page: PageMetadata;
};

export const createPagedDataSchema = <TItem extends z.ZodTypeAny>(itemSchema: TItem) =>
    z.object({
        content: z.array(itemSchema),
        page: PageMetadataSchema,
    });