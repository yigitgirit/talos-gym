// <llm-snippet-file>subscription.actions.ts</llm-snippet-file>
'use server';

import {actionClient} from '@/lib/actions/ActionClient';
import {getServerApi} from '@/lib/api/server';
import {ActionState} from '@/types/actionState';
import {z} from 'zod';
import {
    CreateSubscriptionRequest,
    CreateSubscriptionRequestSchema,
    PagedSubscriptionResponse,
    SubscriptionFilterDto,
    SubscriptionFilterDtoSchema,
    SubscriptionResponse,
} from '@/lib/api/schema';

/* -----------------------------------------------------------------
   Path / Query param schemas
   ----------------------------------------------------------------- */
const AdminSubscriptionIdSchema = z.object({id: z.coerce.number().int().positive()});
const UserSubscriptionIdSchema = z.object({id: z.coerce.number().int().positive()});

/* -----------------------------------------------------------------
   Admin Subscription actions
   ----------------------------------------------------------------- */

/**
 * Retrieves a paginated list of all subscriptions (admin view).
 * GET api/management/subscriptions
 * Accepts optional query filters via `SubscriptionFilterDto`.
 */
export const getAllSubscriptionsAction = async (
    input: SubscriptionFilterDto
): Promise<ActionState<PagedSubscriptionResponse>> => {
    return actionClient
        .withInput(SubscriptionFilterDtoSchema, input)
        .execute(async () => {
            return await getServerApi().get('api/management/subscriptions', {
                params: input,
            });
        });
};

/**
 * Retrieves a single subscription by its ID (admin view).
 * GET api/management/subscriptions/:id
 */
export const getSubscriptionByIdAction = async (
    input: z.infer<typeof AdminSubscriptionIdSchema>
): Promise<ActionState<SubscriptionResponse>> => {
    return actionClient.withInput(AdminSubscriptionIdSchema, input).execute(async ({id}) => {
        return await getServerApi().get('api/management/subscriptions/:id', {
            pathParams: {id},
        });
    });
};

/**
 * Cancels a subscription (admin endpoint).
 * PUT api/management/subscriptions/:id/cancel
 */
export const cancelSubscriptionAdminAction = async (
    input: z.infer<typeof AdminSubscriptionIdSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(AdminSubscriptionIdSchema, input).execute(async ({id}) => {
        return await getServerApi().put('api/management/subscriptions/:id/cancel', undefined, {
            pathParams: {id},
        });
    });
};

/* -----------------------------------------------------------------
   User Subscription actions
   ----------------------------------------------------------------- */

/**
 * Creates a new subscription for the current user.
 * POST api/subscriptions
 */
export const createUserSubscriptionAction = async (
    input: CreateSubscriptionRequest
): Promise<ActionState<SubscriptionResponse>> => {
    return actionClient
        .withInput(CreateSubscriptionRequestSchema, input)
        .execute(async (valid) => {
            return await getServerApi().post('api/subscriptions', valid);
        });
};

/**
 * Retrieves all subscriptions belonging to the current user.
 * GET api/subscriptions/my
 */
export const getMySubscriptionsAction = async (): Promise<ActionState<SubscriptionResponse[]>> => {
    return actionClient.execute(async () => {
        return await getServerApi().get('api/subscriptions/my');
    });
};

/**
 * Retrieves a specific subscription for the current user.
 * GET api/subscriptions/:id
 */
export const getMySubscriptionByIdAction = async (
    input: z.infer<typeof UserSubscriptionIdSchema>
): Promise<ActionState<SubscriptionResponse>> => {
    return actionClient.withInput(UserSubscriptionIdSchema, input).execute(async ({id}) => {
        return await getServerApi().get('api/subscriptions/:id', {
            pathParams: {id},
        });
    });
};

/**
 * Cancels a subscription for the current user.
 * PUT api/subscriptions/:id/cancel
 */
export const cancelMySubscriptionAction = async (
    input: z.infer<typeof UserSubscriptionIdSchema>
): Promise<ActionState<void>> => {
    return actionClient.withInput(UserSubscriptionIdSchema, input).execute(async ({id}) => {
        return await getServerApi().put('api/subscriptions/:id/cancel', undefined, {
            pathParams: {id},
        });
    });
};