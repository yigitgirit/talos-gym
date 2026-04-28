import { z } from 'zod';
import { NonBlankStringSchema } from './common.schema';

export const PaymentRequestSchema = z.object({
    paymentToken: NonBlankStringSchema,
    amount: z.string().trim().min(1),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;