import {z} from "zod";
import {SubscriptionStatusSchema} from "@/lib/api/schema";
import {PageRequestSchema} from "@/lib/api/schema/common.schema";

export const SubscriptionSearchUrlSchema = z.object({
    userId: z.coerce.number().int().positive().optional(),
    planId: z.coerce.number().int().positive().optional(),
    status: z.union([SubscriptionStatusSchema, z.literal("all")]).optional(),
    paymentReference: z.string().optional(),
    ...PageRequestSchema.shape,
});

export type SubscriptionSearchUrl = z.infer<typeof SubscriptionSearchUrlSchema>;
