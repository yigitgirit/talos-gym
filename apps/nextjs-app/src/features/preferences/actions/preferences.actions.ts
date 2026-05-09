'use server';

import { getServerApi } from '@/lib/api/server';
import { actionClient } from '@/lib/actions/ActionClient';
import {
  UpdateNotificationPreferenceRequest,
  UpdateNotificationPreferenceRequestSchema
} from '@/lib/api/schema';

/**
 * Server action to get user notification preferences
 * Calls GET api/notification-preferences endpoint
 */
export async function getNotificationPreferencesAsync() {
  return actionClient.execute(async () => {
    return await getServerApi().get('api/notification-preferences');
  });
}

/**
 * Server action to update a specific notification preference
 * Calls PUT api/notification-preferences endpoint
 */
export async function updateNotificationPreferenceAsync(input: UpdateNotificationPreferenceRequest) {
  return actionClient
    .withInput(UpdateNotificationPreferenceRequestSchema, input)
    .execute(async (validated) => {
      return await getServerApi().put('api/notification-preferences', validated);
    });
}
