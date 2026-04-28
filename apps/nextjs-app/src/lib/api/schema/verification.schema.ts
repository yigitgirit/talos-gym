import { z } from 'zod';
import {
    ReferenceIdSchema,
    NonBlankStringSchema,
    TokenSchema,
} from './common.schema';

export const VerificationPurposeSchema = z.enum([
    'GENERAL',
    'PHONE_VERIFICATION',
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'PHONE_CHANGE',
    'EMAIL_CHANGE',
    'TRANSACTION_CONFIRM',
]);
export type VerificationPurpose = z.infer<typeof VerificationPurposeSchema>;

export const CodeConfirmSchema = z.object({
    referenceId: ReferenceIdSchema,
    code: NonBlankStringSchema,
    purpose: VerificationPurposeSchema,
});
export const CodeConfirmRequestSchema = CodeConfirmSchema;
export type CodeConfirmRequest = z.infer<typeof CodeConfirmRequestSchema>;

export const ConfirmLinkRequestSchema = z.object({
    token: TokenSchema,
    referenceId: z.string().trim().optional(),
    purpose: VerificationPurposeSchema.default('GENERAL'),
});
export type ConfirmLinkRequest = z.infer<typeof ConfirmLinkRequestSchema>;