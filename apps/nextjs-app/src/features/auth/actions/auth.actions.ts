'use server';

import { cookies } from 'next/headers';
import { getServerApi } from '@/lib/api/server';
import {
  LoginRequest,
  LoginRequestSchema,
  RegisterRequest,
  RegisterRequestSchema,
  RefreshRequest,
  RefreshRequestSchema,
  VerifyOtpRequest,
  VerifyOtpRequestSchema,
  ResetPasswordRequest,
  ResetPasswordRequestSchema,
  ForgotPasswordRequest,
  ForgotPasswordRequestSchema,
  ResendVerificationRequest,
  ResendVerificationRequestSchema,
  CodeConfirmRequest,
  CodeConfirmRequestSchema,
  ConfirmLinkRequest,
  ConfirmLinkRequestSchema,
} from '@/lib/api/schema';
import { AUTH_COOKIES, COOKIE_OPTIONS } from '@/config/auth.config';
import { actionClient } from '@/lib/actions/ActionClient';

/**
 * Server action for user login
 * Calls backend login API and stores tokens in secure cookies
 */
export async function loginAsync(input: LoginRequest) {
  return actionClient.withInput(LoginRequestSchema, input).execute(async (validated) => {
    const api = getServerApi();

    const tokens = await api.post('api/auth/login', validated);

    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.accessTokenExpiresIn ? Math.floor(tokens.accessTokenExpiresIn / 1000) : COOKIE_OPTIONS.accessTokenMaxAge,
      secure: process.env.NODE_ENV === 'production',
    });

    cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.refreshTokenExpiresIn ? Math.floor(tokens.refreshTokenExpiresIn / 1000) : COOKIE_OPTIONS.refreshTokenMaxAge,
      secure: process.env.NODE_ENV === 'production',
    });

    return await api.get('api/users/me');
  });
}

/**
 * Server action for user registration
 * Calls backend register API
 */
export async function registerAsync(input: RegisterRequest) {
  return actionClient.withInput(RegisterRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/register', validated);
  });
}

/**
 * Server action for user logout
 * Clears auth cookies
 */
export async function logoutAsync() {
  return actionClient.execute(async () => {
    try {
      await getServerApi().post('api/auth/logout', {});
    } finally {
      const cookieStore = await cookies();
      cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
      cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
    }
  });
}

/**
 * Server action to refresh token
 */
export async function refreshAsync(input: RefreshRequest) {
  return actionClient.withInput(RefreshRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/refresh', validated);
  });
}

/**
 * Server action to get current user from backend
 * Used to initialize session on client side
 */
export async function getCurrentUserAsync() {
  return actionClient.execute(async () => {
    return await getServerApi().get('api/users/me');
  });
}

/**
 * Server action to initialize session
 * Called on app startup to load current user if authenticated
 */
export async function initializeSessionAsync() {
  return getCurrentUserAsync();
}

/**
 * Server action to verify OTP code (e.g., account verification)
 */
export async function verifyOTPAsync(input: CodeConfirmRequest) {
  return actionClient.withInput(CodeConfirmRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/verification/confirm-code', validated);
  });
}

/**
 * Server action to verify a link via token
 * Sends token, referenceId, and purpose as query parameters
 */
export async function confirmLinkAsync(input: ConfirmLinkRequest) {
  return actionClient.withInput(ConfirmLinkRequestSchema, input).execute(async (validated) => {
    return await getServerApi().get('api/verification/confirm-link', {
      params: validated,
    });
  });
}

/**
 * Server action to resend verification
 */
export async function resendVerificationAsync(input: ResendVerificationRequest) {
  return actionClient.withInput(ResendVerificationRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/resend-verification', validated);
  });
}

/**
 * Server action for forgot password flow
 */
export async function forgotPasswordAsync(input: ForgotPasswordRequest) {
  return actionClient.withInput(ForgotPasswordRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/forgot-password', validated);
  });
}

/**
 * Server action to verify OTP specifically for password reset
 */
export async function verifyOtpResetAsync(input: VerifyOtpRequest) {
  return actionClient.withInput(VerifyOtpRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/verify-otp', validated);
  });
}

/**
 * Server action to submit new password via reset token
 */
export async function resetPasswordSubmitAsync(input: ResetPasswordRequest) {
  return actionClient.withInput(ResetPasswordRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/reset-password-submit', validated);
  });
}
