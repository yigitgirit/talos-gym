'use server';

import { getServerApi } from '@/lib/api/server';
import { actionClient } from '@/lib/actions/ActionClient';
import {
  UpdateUserRequest,
  UpdateUserRequestSchema,
  ChangePasswordRequest,
  ChangePasswordRequestSchema,
  PhoneChangeInitiateRequest,
  PhoneChangeInitiateRequestSchema,
  EmailChangeInitiateRequest,
  EmailChangeInitiateRequestSchema
} from '@/lib/api/schema';
import {cookies} from "next/headers";
import {AUTH_COOKIES} from "@/config";

/**
 * Server action to fetch current user profile
 * Calls GET api/users/me endpoint
 */
export async function getProfileAsync() {
  return actionClient.execute(async () => {
    return await getServerApi().get('api/users/me');
  });
}

/**
 * Server action to update user profile
 * Calls PUT api/users/me endpoint with updated user data
 */
export async function updateProfileAsync(input: UpdateUserRequest) {
  return actionClient
    .withInput(UpdateUserRequestSchema, input)
    .execute(async (validated) => {
      return await getServerApi().put('api/users/me', validated);
    });
}

/**
 * Server action to delete current user account
 * Calls DELETE api/users/me endpoint
 */
export async function deleteProfileAsync() {
  return actionClient.execute(async () => {
    const response = await getServerApi().delete('api/users/me');

    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
    cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);

    return response;
  });
}

/**
 * Server action to change user password
 * Calls PATCH api/users/me/change-password endpoint
 */
export async function changePasswordAsync(input: ChangePasswordRequest) {
  return actionClient
    .withInput(ChangePasswordRequestSchema, input)
    .execute(async (validated) => {
      return await getServerApi().patch('api/users/me/change-password', validated);
    });
}

/**
 * Server action to initiate phone change
 * Calls POST api/users/phone/change-request
 */
export async function initiatePhoneChangeAsync(input: PhoneChangeInitiateRequest) {
  return actionClient
    .withInput(PhoneChangeInitiateRequestSchema, input)
    .execute(async (validated) => {
      return await getServerApi().post('api/users/phone/change-request', validated);
    });
}

/**
 * Server action to initiate email change
 * Calls POST api/users/email/change-request
 */
export async function initiateEmailChangeAsync(input: EmailChangeInitiateRequest) {
  return actionClient
    .withInput(EmailChangeInitiateRequestSchema, input)
    .execute(async (validated) => {
      return await getServerApi().post('api/users/email/change-request', validated);
    });
}

/**
 * Server action to verify email
 * Calls POST api/users/me/verify-email
 */
export async function verifyEmailAsync() {
  return actionClient.execute(async () => {
    return await getServerApi().post('api/users/me/verify-email', {});
  });
}
