'use server';

import { actionClient } from '@/lib/actions/ActionClient';
import { getServerApi } from '@/lib/api/server';
import { ActionState } from '@/types/actionState';
import { z } from 'zod';
import {
  ClubResponse,
  ClubSearchRequest,
  ClubSearchRequestSchema,
  PagedClubResponse,
  OperatingHourDto,
  ScheduleOverrideResponse,
  ClubCreateRequest,
  ClubCreateRequestSchema,
  ClubUpdateRequest,
  ClubUpdateRequestSchema,
  UpdateOperatingHoursRequest,
  UpdateOperatingHoursRequestSchema,
  ScheduleOverrideRequest,
  ScheduleOverrideRequestSchema,
  OfferCatalogResponse,
} from '@/lib/api/schema';

// --- Schemas for Path & Query Params ---

const ClubIdSchema = z.object({
  id: z.string(),
});

const ClubSlugSchema = z.object({
  slug: z.string(),
});

const ClubScheduleParamsSchema = z.object({
  clubId: z.string(),
});

const OverrideQuerySchema = z.object({
  clubId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const OverrideIdParamsSchema = z.object({
  clubId: z.string(),
  overrideId: z.string(),
});

const ClubOfferParamsSchema = z.object({
  slug: z.string(),
  offerId: z.string(),
});

// ============================================================================
// Public Club Endpoints
// ============================================================================

/**
 * Searches and paginates clubs
 * Calls GET api/clubs
 */
export const searchClubsAction = async (input: ClubSearchRequest): Promise<ActionState<PagedClubResponse>> => {
  return actionClient
    .withInput(ClubSearchRequestSchema, input)
    .execute(async (validFilters) => {
      return await getServerApi().get('api/clubs', { params: validFilters });
    });
};

/**
 * Gets a specific club by its ID
 * Calls GET api/clubs/:id
 */
export const getClubByIdAction = async (input: z.infer<typeof ClubIdSchema>): Promise<ActionState<ClubResponse>> => {
  return actionClient.withInput(ClubIdSchema, input).execute(async ({ id }) => {
    return await getServerApi().get('api/clubs/:id', { pathParams: { id } });
  });
};

/**
 * Gets a specific club by its slug
 * Calls GET api/clubs/slug/:slug
 */
export const getClubBySlugAction = async (input: z.infer<typeof ClubSlugSchema>): Promise<ActionState<ClubResponse>> => {
  return actionClient.withInput(ClubSlugSchema, input).execute(async ({ slug }) => {
    return await getServerApi().get('api/clubs/slug/:slug', { pathParams: { slug } });
  });
};

/**
 * Gets a club's operating hours
 * Calls GET api/clubs/:clubId/schedule/operating-hours
 */
export const getClubOperatingHoursAction = async (
  input: z.infer<typeof ClubScheduleParamsSchema>
): Promise<ActionState<OperatingHourDto[]>> => {
  return actionClient.withInput(ClubScheduleParamsSchema, input).execute(async ({ clubId }) => {
    return await getServerApi().get('api/clubs/:clubId/schedule/operating-hours', {
      pathParams: { clubId },
    });
  });
};

/**
 * Gets a club's schedule overrides
 * Calls GET api/clubs/:clubId/schedule/overrides
 */
export const getClubScheduleOverridesAction = async (
  input: z.infer<typeof OverrideQuerySchema>
): Promise<ActionState<ScheduleOverrideResponse[]>> => {
  return actionClient.withInput(OverrideQuerySchema, input).execute(async (valid) => {
    return await getServerApi().get('api/clubs/:clubId/schedule/overrides', {
      pathParams: { clubId: valid.clubId },
      params: { startDate: valid.startDate, endDate: valid.endDate },
    });
  });
};

/**
 * Gets offers for a club
 * Calls GET api/clubs/:slug/offers
 */
export const getClubOffersAction = async (
  input: z.infer<typeof ClubSlugSchema>
): Promise<ActionState<OfferCatalogResponse[]>> => {
  return actionClient.withInput(ClubSlugSchema, input).execute(async ({ slug }) => {
    return await getServerApi().get('api/clubs/:slug/offers', { pathParams: { slug } });
  });
};

/**
 * Gets offer detail for a club
 * Calls GET api/clubs/:slug/offers/:offerId
 */
export const getClubOfferDetailAction = async (
  input: z.infer<typeof ClubOfferParamsSchema>
): Promise<ActionState<OfferCatalogResponse>> => {
  return actionClient.withInput(ClubOfferParamsSchema, input).execute(async ({ slug, offerId }) => {
    return await getServerApi().get('api/clubs/:slug/offers/:offerId', { pathParams: { slug, offerId } });
  });
};

// ============================================================================
// Admin/Management Club Endpoints
// ============================================================================

/**
 * Creates a new club
 * Calls POST api/management/clubs
 */
export const createClubAction = async (input: ClubCreateRequest): Promise<ActionState<ClubResponse>> => {
  return actionClient.withInput(ClubCreateRequestSchema, input).execute(async (validData) => {
    return await getServerApi().post('api/management/clubs', validData);
  });
};

/**
 * Updates an existing club
 * Calls PUT api/management/clubs/:id
 */
export const updateClubAction = async (input: { id: string; data: ClubUpdateRequest }): Promise<ActionState<ClubResponse>> => {
  const schema = z.object({
    id: z.string(),
    data: ClubUpdateRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (valid) => {
    return await getServerApi().put('api/management/clubs/:id', valid.data, {
      pathParams: { id: valid.id },
    });
  });
};

/**
 * Deletes a club
 * Calls DELETE api/management/clubs/:id
 */
export const deleteClubAction = async (input: z.infer<typeof ClubIdSchema>): Promise<ActionState<void>> => {
  return actionClient.withInput(ClubIdSchema, input).execute(async ({ id }) => {
    return await getServerApi().delete('api/management/clubs/:id', {
      pathParams: { id },
    });
  });
};

/**
 * Updates a club's operating hours
 * Calls PUT api/management/clubs/:clubId/schedule/operating-hours
 */
export const updateClubOperatingHoursAction = async (input: {
  clubId: string;
  data: UpdateOperatingHoursRequest;
}): Promise<ActionState<OperatingHourDto[]>> => {
  const schema = z.object({
    clubId: z.string(),
    data: UpdateOperatingHoursRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (valid) => {
    return await getServerApi().put('api/management/clubs/:clubId/schedule/operating-hours', valid.data, {
      pathParams: { clubId: valid.clubId },
    });
  });
};

/**
 * Creates a schedule override for a club
 * Calls POST api/management/clubs/:clubId/schedule/overrides
 */
export const createScheduleOverrideAction = async (input: {
  clubId: string;
  data: ScheduleOverrideRequest;
}): Promise<ActionState<ScheduleOverrideResponse>> => {
  const schema = z.object({
    clubId: z.string(),
    data: ScheduleOverrideRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (valid) => {
    return await getServerApi().post('api/management/clubs/:clubId/schedule/overrides', valid.data, {
      pathParams: { clubId: valid.clubId },
    });
  });
};

/**
 * Updates a specific schedule override for a club
 * Calls PUT api/management/clubs/:clubId/schedule/overrides/:overrideId
 */
export const updateScheduleOverrideAction = async (input: {
  clubId: string;
  overrideId: string;
  data: ScheduleOverrideRequest;
}): Promise<ActionState<ScheduleOverrideResponse>> => {
  const schema = z.object({
    clubId: z.string(),
    overrideId: z.string(),
    data: ScheduleOverrideRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (valid) => {
    return await getServerApi().put(
      'api/management/clubs/:clubId/schedule/overrides/:overrideId',
      valid.data,
      {
        pathParams: { clubId: valid.clubId, overrideId: valid.overrideId },
      }
    );
  });
};

/**
 * Deletes a specific schedule override
 * Calls DELETE api/management/clubs/:clubId/schedule/overrides/:overrideId
 */
export const deleteScheduleOverrideAction = async (input: z.infer<typeof OverrideIdParamsSchema>): Promise<ActionState<void>> => {
  return actionClient.withInput(OverrideIdParamsSchema, input).execute(async (valid) => {
    return await getServerApi().delete('api/management/clubs/:clubId/schedule/overrides/:overrideId', {
      pathParams: { clubId: valid.clubId, overrideId: valid.overrideId },
    });
  });
};
