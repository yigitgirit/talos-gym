import { z } from "zod";

/* -----------------------------------------------------------------
   Feature schemas
   ----------------------------------------------------------------- */
export const FeatureResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    description: z.string().nullable().optional(),
});
export type FeatureResponse = z.infer<typeof FeatureResponseSchema>;

export const CreateFeatureRequestSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).nullable().optional(),
});
export type CreateFeatureRequest = z.infer<typeof CreateFeatureRequestSchema>;

export const UpdateFeatureRequestSchema = CreateFeatureRequestSchema; // same shape
export type UpdateFeatureRequest = z.infer<typeof UpdateFeatureRequestSchema>;

/* -----------------------------------------------------------------
   Membership Plan schemas
   ----------------------------------------------------------------- */
export const MembershipPlanResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    isGlobal: z.boolean(),
    features: z.array(FeatureResponseSchema),
});
export type MembershipPlanResponse = z.infer<typeof MembershipPlanResponseSchema>;

export const CreatePlanRequestSchema = z.object({
    name: z.string(),
    isGlobal: z.boolean(),
    featureIds: z.array(z.number().int().nonnegative()),
});
export type CreatePlanRequest = z.infer<typeof CreatePlanRequestSchema>;

export const UpdatePlanRequestSchema = z.object({
    name: z.string(),
    isGlobal: z.boolean(),
});
export type UpdatePlanRequest = z.infer<typeof UpdatePlanRequestSchema>;

export const PublicPlanSearchRequestSchema = z.object({
    global: z.boolean().optional(),
});
export type PublicPlanSearchRequest = z.infer<typeof PublicPlanSearchRequestSchema>;

/* -----------------------------------------------------------------
   Offer schemas
   ----------------------------------------------------------------- */
export const OfferAdminResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    planId: z.number().int().nonnegative(),
    planName: z.string(),
    clubId: z.number().int().nonnegative(),
    clubName: z.string(),
    price: z.number(),
    currency: z.string(),
});
export type OfferAdminResponse = z.infer<typeof OfferAdminResponseSchema>;

export const CreateOfferRequestSchema = z.object({
    planId: z.number().int().nonnegative(),
    clubId: z.number().int().nonnegative().optional(),
    price: z.number().positive(),
});
export type CreateOfferRequest = z.infer<typeof CreateOfferRequestSchema>;

export const UpdateOfferRequestSchema = z.object({
    newPrice: z.number().positive(),
});
export type UpdateOfferRequest = z.infer<typeof UpdateOfferRequestSchema>;

/* -----------------------------------------------------------------
   Plan Subscription Config schemas
   ----------------------------------------------------------------- */
export const SubscriptionTypeSummarySchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    intervalMonths: z.number().int().positive(),
    isPrepaid: z.boolean(),
});

export const PlanSubscriptionConfigResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    planId: z.number().int().nonnegative(),
    planName: z.string(),
    subscriptionType: SubscriptionTypeSummarySchema,
    multiplier: z.number(),
    discountRate: z.number(),
    installments: z.number().int(),
});
export type PlanSubscriptionConfigResponse = z.infer<typeof PlanSubscriptionConfigResponseSchema>;

export const CreatePlanSubscriptionConfigRequestSchema = z.object({
    subscriptionTypeId: z.number().int().nonnegative(),
    multiplier: z.number().gt(0),
    discountRate: z.number().min(0).max(1),
    installments: z.number().int().min(1).max(60),
});
export type CreatePlanSubscriptionConfigRequest = z.infer<typeof CreatePlanSubscriptionConfigRequestSchema>;

export const UpdatePlanSubscriptionConfigRequestSchema = z.object({
    multiplier: z.number().gt(0),
    discountRate: z.number().min(0).max(1),
    installments: z.number().int().min(1).max(60),
});
export type UpdatePlanSubscriptionConfigRequest = z.infer<typeof UpdatePlanSubscriptionConfigRequestSchema>;
