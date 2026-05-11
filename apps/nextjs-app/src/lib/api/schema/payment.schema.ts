import { z } from 'zod';
import { NonBlankStringSchema } from './common.schema';

export const PaymentRequestSchema = z.object({
    paymentToken: NonBlankStringSchema,
    amount: z.string().trim().min(1),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

export const PaymentOptionDtoSchema = z.object({
    subscriptionTypeId: z.number().int().positive().optional(),
    typeName: z.string().optional(),
    intervalMonths: z.number().int().positive().optional(),
    monthlyPrice: z.number().optional(),
    totalPrice: z.number().positive().optional(),
    installments: z.number().int().optional(),
    marketingBadge: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
});
export type PaymentOptionDto = z.infer<typeof PaymentOptionDtoSchema>;
