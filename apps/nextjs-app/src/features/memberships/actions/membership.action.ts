'use server';

import { actionClient } from '@/lib/actions/ActionClient';
import { getServerApi } from '@/lib/api/server';
import { ActionState } from '@/types/actionState';
import { z } from 'zod';
import {
    // Feature
    FeatureResponse,
    CreateFeatureRequest,
    CreateFeatureRequestSchema,
    UpdateFeatureRequest,
    UpdateFeatureRequestSchema,
    // Membership Plan
    MembershipPlanResponse,
    CreatePlanRequest,
    CreatePlanRequestSchema,
    UpdatePlanRequest,
    UpdatePlanRequestSchema,
    // Offer
    OfferAdminResponse,
    CreateOfferRequest,
    CreateOfferRequestSchema,
    UpdateOfferRequest,
    UpdateOfferRequestSchema,
    // Plan Subscription Config
    PlanSubscriptionConfigResponse,
    CreatePlanSubscriptionConfigRequest,
    CreatePlanSubscriptionConfigRequestSchema,
    UpdatePlanSubscriptionConfigRequest,
    UpdatePlanSubscriptionConfigRequestSchema,
} from '@/lib/api/schema';
import {MembershipPlanSearchUrl, MembershipPlanSearchUrlSchema} from "@/features/memberships";

/* -----------------------------------------------------------------
   Path / Query param schemas
   ----------------------------------------------------------------- */
const FeatureIdSchema = z.object({ featureId: z.string() });
const PlanIdSchema = z.object({ planId: z.string() });
const OfferIdSchema = z.object({ offerId: z.string() });
const PlanFeatureSchema = z.object({ planId: z.string(), featureId: z.string() });

/* -----------------------------------------------------------------
   Feature actions
   ----------------------------------------------------------------- */

/**
 * Creates a new feature.
 * POST api/management/features
 */
export const createFeatureAction = async (
    input: CreateFeatureRequest
): Promise<ActionState<FeatureResponse>> => {
    return actionClient
        .withInput(CreateFeatureRequestSchema, input)
        .execute(async (valid) => {
            return await getServerApi().post('api/management/features', valid);
        });
};

/**
 * Updates an existing feature.
 * PUT api/management/features/:featureId
 */
export const updateFeatureAction = async (input: {
    featureId: string;
    data: UpdateFeatureRequest;
}): Promise<ActionState<FeatureResponse>> => {
    const schema = z.object({
        featureId: z.string(),
        data: UpdateFeatureRequestSchema,
    });

    return actionClient.withInput(schema, input).execute(async (valid) => {
        return await getServerApi().put('api/management/features/:featureId', valid.data, {
            pathParams: { featureId: valid.featureId },
        });
    });
};

/**
 * Deletes a feature.
 * DELETE api/management/features/:featureId
 */
export const deleteFeatureAction = async (
    input: z.infer<typeof FeatureIdSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(FeatureIdSchema, input).execute(async ({ featureId }) => {
        return await getServerApi().delete('api/management/features/:featureId', {
            pathParams: { featureId },
        });
    });
};

/* -----------------------------------------------------------------
   Membership Plan actions
   ----------------------------------------------------------------- */

/**
 * Creates a new membership plan.
 * POST api/management/plans
 */
export const createPlanAction = async (
    input: CreatePlanRequest
): Promise<ActionState<MembershipPlanResponse>> => {
    return actionClient
        .withInput(CreatePlanRequestSchema, input)
        .execute(async (valid) => {
            return await getServerApi().post('api/management/plans', valid);
        });
};

/**
 * Updates an existing plan.
 * PUT api/management/plans/:planId
 */
export const updatePlanAction = async (input: {
    planId: string;
    data: UpdatePlanRequest;
}): Promise<ActionState<MembershipPlanResponse>> => {
    const schema = z.object({
        planId: z.string(),
        data: UpdatePlanRequestSchema,
    });

    return actionClient.withInput(schema, input).execute(async (valid) => {
        return await getServerApi().put('api/management/plans/:planId', valid.data, {
            pathParams: { planId: valid.planId },
        });
    });
};

/**
 * Retrieves a plan by id.
 * GET api/management/plans/:planId
 */
export const getPlanByIdAction = async (
    input: z.infer<typeof PlanIdSchema>
): Promise<ActionState<MembershipPlanResponse>> => {
    return actionClient.withInput(PlanIdSchema, input).execute(async ({ planId }) => {
        return await getServerApi().get('api/management/plans/:planId', {
            pathParams: { planId },
        });
    });
};

export const getAllPlans = async (
    filters: MembershipPlanSearchUrl
): Promise<ActionState<MembershipPlanResponse[]>> => {
    return actionClient.withInput(MembershipPlanSearchUrlSchema, filters).execute(async (valid) => {
        return await getServerApi().get('api/management/plans', {
            params: valid,
        });
    });
};

/**
 * Deletes a plan.
 * DELETE api/management/plans/:planId
 */
export const deletePlanAction = async (
    input: z.infer<typeof PlanIdSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(PlanIdSchema, input).execute(async ({ planId }) => {
        return await getServerApi().delete('api/management/plans/:planId', {
            pathParams: { planId },
        });
    });
};

/* -----------------------------------------------------------------
   Plan ↔ Feature association actions
   ----------------------------------------------------------------- */

/**
 * Adds a single feature to a plan.
 * POST api/management/plans/:planId/features/:featureId
 */
export const addFeatureToPlanAction = async (
    input: z.infer<typeof PlanFeatureSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(PlanFeatureSchema, input).execute(async ({ planId, featureId }) => {
        return await getServerApi().post(
            'api/management/plans/:planId/features/:featureId',
            undefined,
            { pathParams: { planId, featureId } }
        );
    });
};

/**
 * Removes a single feature from a plan.
 * DELETE api/management/plans/:planId/features/:featureId
 */
export const removeFeatureFromPlanAction = async (
    input: z.infer<typeof PlanFeatureSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(PlanFeatureSchema, input).execute(async ({ planId, featureId }) => {
        return await getServerApi().delete(
            'api/management/plans/:planId/features/:featureId',
            { pathParams: { planId, featureId } }
        );
    });
};

/**
 * Replaces the entire feature set for a plan (bulk update).
 * PUT api/management/plans/:planId/features
 *
 * `featureIds` is sent as a JSON array — the backend type is Set<number>
 * but JSON arrays are the wire format.
 */
export const replacePlanFeaturesAction = async (input: {
    planId: string;
    featureIds: number[];
}): Promise<ActionState<void>> => {
    const schema = z.object({
        planId: z.string(),
        featureIds: z.array(z.number()),
    });
    return actionClient.withInput(schema, input).execute(async ({ planId, featureIds }) => {
        return await getServerApi().put(
            'api/management/plans/:planId/features',
            featureIds,
            { pathParams: { planId } }
        );
    });
};

/* -----------------------------------------------------------------
   Offer actions
   ----------------------------------------------------------------- */

/**
 * Creates a new offer.
 * POST api/management/offers
 */
export const createOfferAction = async (
    input: CreateOfferRequest
): Promise<ActionState<OfferAdminResponse>> => {
    return actionClient
        .withInput(CreateOfferRequestSchema, input)
        .execute(async (valid) => {
            return await getServerApi().post('api/management/offers', valid);
        });
};

/**
 * Updates an existing offer.
 * PUT api/management/offers/:offerId
 */
export const updateOfferAction = async (input: {
    offerId: string;
    data: UpdateOfferRequest;
}): Promise<ActionState<OfferAdminResponse>> => {
    const schema = z.object({
        offerId: z.string(),
        data: UpdateOfferRequestSchema,
    });

    return actionClient.withInput(schema, input).execute(async (valid) => {
        return await getServerApi().put('api/management/offers/:offerId', valid.data, {
            pathParams: { offerId: valid.offerId },
        });
    });
};

/**
 * Deletes an offer.
 * DELETE api/management/offers/:offerId
 */
export const deleteOfferAction = async (
    input: z.infer<typeof OfferIdSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(OfferIdSchema, input).execute(async ({ offerId }) => {
        return await getServerApi().delete('api/management/offers/:offerId', {
            pathParams: { offerId },
        });
    });
};

/* -----------------------------------------------------------------
   Plan Subscription Config actions
   ----------------------------------------------------------------- */

/**
 * Creates a subscription config for a plan.
 * POST api/management/plans/:planId/subscription-configs
 */
export const createPlanSubscriptionConfigAction = async (input: {
    planId: string;
    data: CreatePlanSubscriptionConfigRequest;
}): Promise<ActionState<PlanSubscriptionConfigResponse>> => {
    const schema = z.object({
        planId: z.string(),
        data: CreatePlanSubscriptionConfigRequestSchema,
    });

    return actionClient.withInput(schema, input).execute(async (valid) => {
        return await getServerApi().post(
            'api/management/plans/:planId/subscription-configs',
            valid.data,
            { pathParams: { planId: valid.planId } }
        );
    });
};

/**
 * Updates a subscription config.
 * PUT api/management/plans/:planId/subscription-configs/:configId
 */
export const updatePlanSubscriptionConfigAction = async (input: {
    planId: string;
    configId: string;
    data: UpdatePlanSubscriptionConfigRequest;
}): Promise<ActionState<PlanSubscriptionConfigResponse>> => {
    const schema = z.object({
        planId: z.string(),
        configId: z.string(),
        data: UpdatePlanSubscriptionConfigRequestSchema,
    });

    return actionClient.withInput(schema, input).execute(async (valid) => {
        return await getServerApi().put(
            'api/management/plans/:planId/subscription-configs/:configId',
            valid.data,
            { pathParams: { planId: valid.planId, configId: valid.configId } }
        );
    });
};

/**
 * Deletes a subscription config.
 * DELETE api/management/plans/:planId/subscription-configs/:configId
 */
export const deletePlanSubscriptionConfigAction = async (
    input: {
        planId: string;
        configId: string;
    }
): Promise<ActionState<void>> => {
    const schema = z.object({
        planId: z.string(),
        configId: z.string(),
    });

    return actionClient.withInput(schema, input).execute(async ({ planId, configId }) => {
        return await getServerApi().delete(
            'api/management/plans/:planId/subscription-configs/:configId',
            { pathParams: { planId, configId } }
        );
    });
};