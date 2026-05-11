import {z} from "zod";
import {PageRequestSchema} from "@/lib/api/schema";

export const MembershipPlanSearchFiltersSchema = z.object({
    /** Free‑text search across plan name/description */
    search: z.string().optional(),
    /** Optional status filter (e.g., ACTIVE, INACTIVE) */
    status: z.string().optional(),
});
export type MembershipPlanSearchFilters = z.infer<typeof MembershipPlanSearchFiltersSchema>;

export const MembershipPlanSearchUrlSchema = z.object({
    ...MembershipPlanSearchFiltersSchema.shape,
    ...PageRequestSchema.shape,
    // Ensure boolean‑like values are correctly coerced if you add them later
});
export type MembershipPlanSearchUrl = z.infer<typeof MembershipPlanSearchUrlSchema>;

export const OfferSearchFiltersSchema = z.object({
    search: z.string().optional(),
    clubId: z.coerce.number().int().optional(),
    planId: z.coerce.number().int().optional(),
    global: z.preprocess((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return val;
    }, z.boolean().optional())
});
export type OfferSearchFilters = z.infer<typeof OfferSearchFiltersSchema>;

export const OfferSearchUrlSchema = z.object({
    ...OfferSearchFiltersSchema.shape,
    ...PageRequestSchema.shape
});
export type OfferSearchUrl = z.infer<typeof OfferSearchUrlSchema>;

export const SubscriptionConfigSearchFiltersSchema = z.object({
    planId: z.coerce.number().int().optional()
});
export type SubscriptionConfigSearchFilters = z.infer<typeof SubscriptionConfigSearchFiltersSchema>;

export const SubscriptionConfigSearchUrlSchema = z.object({
    ...SubscriptionConfigSearchFiltersSchema.shape,
    ...PageRequestSchema.shape
});
export type SubscriptionConfigSearchUrl = z.infer<typeof SubscriptionConfigSearchUrlSchema>;
