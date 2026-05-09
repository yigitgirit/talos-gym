'use server';

import { getServerApi } from '@/lib/api/server';
import { actionClient } from '@/lib/actions/ActionClient';
import {
  UpdateUserRequest,
  UpdateUserRequestSchema,
  UserBanRequest,
  UserBanRequestSchema,
} from '@/lib/api/schema';
import { z } from 'zod';
import { RoleSchema } from '@/lib/api/schema/common.schema';

// --- Schemas for path/query parameters ---

const UserIdSchema = z.object({
  id: z.string(), // Extracted from URL params, but often strings in Next.js params
});

const GetUsersParamsSchema = z.object({
  page: z.number().int().nonnegative().optional(),
  size: z.number().int().positive().optional(),
  search: z.string().optional(),
});

const UpdateRolesSchema = z.object({
  id: z.string(),
  roles: z.array(RoleSchema),
});

const ChangeUserStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'BANNED']),
});

/**
 * Server action to get a paginated list of users (Admin only)
 * Calls GET api/management/users
 */
export async function getUsersAsync(input: z.infer<typeof GetUsersParamsSchema>) {
  return actionClient.withInput(GetUsersParamsSchema, input).execute(async (validated) => {
    return await getServerApi().get('api/management/users', {
      params: validated,
    });
  });
}

/**
 * Server action to get a specific user by ID (Admin only)
 * Calls GET api/management/users/:id
 */
export async function getUserByIdAsync(input: z.infer<typeof UserIdSchema>) {
  return actionClient.withInput(UserIdSchema, input).execute(async (validated) => {
    return await getServerApi().get('api/management/users/:id', {
      pathParams: { id: validated.id },
    });
  });
}

/**
 * Server action to update a specific user (Admin only)
 * Calls PUT api/management/users/:id
 */
export async function updateUserAsync(input: { id: string; data: UpdateUserRequest }) {
  const schema = z.object({
    id: z.string(),
    data: UpdateUserRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (validated) => {
    return await getServerApi().put('api/management/users/:id', validated.data, {
      pathParams: { id: validated.id },
    });
  });
}

/**
 * Server action to delete a specific user (Admin only)
 * Calls DELETE api/management/users/:id
 */
export async function deleteUserAsync(input: z.infer<typeof UserIdSchema>) {
  return actionClient.withInput(UserIdSchema, input).execute(async (validated) => {
    return await getServerApi().delete('api/management/users/:id', {
      pathParams: { id: validated.id },
    });
  });
}

/**
 * Server action to change a user's status (Admin only)
 * Calls PATCH api/management/users/:id/status
 */
export async function changeUserStatusAsync(input: z.infer<typeof ChangeUserStatusSchema>) {
  return actionClient.withInput(ChangeUserStatusSchema, input).execute(async (validated) => {
    return await getServerApi().patch(
      'api/management/users/:id/status',
      {},
      {
        pathParams: { id: validated.id },
        params: { status: validated.status },
      }
    );
  });
}

/**
 * Server action to update a user's roles (Admin only)
 * Calls PUT api/management/users/:id/roles
 */
export async function updateUserRolesAsync(input: z.infer<typeof UpdateRolesSchema>) {
  return actionClient.withInput(UpdateRolesSchema, input).execute(async (validated) => {
    return await getServerApi().put('api/management/users/:id/roles', validated.roles, {
      pathParams: { id: validated.id },
    });
  });
}

/**
 * Server action to ban a user (Admin only)
 * Calls POST api/management/users/:id/ban
 */
export async function banUserAsync(input: { id: string; data: UserBanRequest }) {
  const schema = z.object({
    id: z.string(),
    data: UserBanRequestSchema,
  });

  return actionClient.withInput(schema, input).execute(async (validated) => {
    return await getServerApi().post('api/management/users/:id/ban', validated.data, {
      pathParams: { id: validated.id },
    });
  });
}

/**
 * Server action to unban a user (Admin only)
 * Calls POST api/management/users/:id/unban
 */
export async function unbanUserAsync(input: z.infer<typeof UserIdSchema>) {
  return actionClient.withInput(UserIdSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/management/users/:id/unban', {}, {
      pathParams: { id: validated.id },
    });
  });
}
