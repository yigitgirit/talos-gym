import { z } from "zod";
import {createPagedDataSchema, PageRequestSchema} from "@/lib/api/schema/common.schema";
import {ClubResponseSchema} from "@/lib/api/schema/club.schema";

/* -----------------------------------------------------------------
   SubscriptionStatus enum
   ----------------------------------------------------------------- */
export const SubscriptionStatusSchema = z.enum([
    "ACTIVE",
    "CANCELED",
    "EXPIRED",
    "PENDING_PAYMENT"
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

/* -----------------------------------------------------------------
   DTOs
   ----------------------------------------------------------------- */
export const CreateSubscriptionRequestSchema = z.object({
    offerId: z.number().int().positive(),
    subscriptionTypeId: z.number().int().positive(),
    paymentToken: z.string().min(1),
});
export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequestSchema>;

export const SubscriptionFilterDtoSchema = z.object({
    userId: z.number().int().positive().optional(),
    planId: z.number().int().positive().optional(),
    status: SubscriptionStatusSchema.optional(),
    paymentReference: z.string().optional(),
    ...PageRequestSchema.shape,
});
export type SubscriptionFilterDto = z.infer<typeof SubscriptionFilterDtoSchema>;

export const SubscriptionResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    planId: z.number().int().nonnegative(),
    planName: z.string(),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    totalAmount: z.number(),
    status: SubscriptionStatusSchema,
});
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;

export const PagedSubscriptionResponseSchema = createPagedDataSchema(SubscriptionResponseSchema);
export type PagedSubscriptionResponse = z.infer<typeof PagedSubscriptionResponseSchema>;