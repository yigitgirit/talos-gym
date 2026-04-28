'use server'

import {cookies} from 'next/headers'
import {getServerApi} from '@/lib/api/server'
import {
  LoginRequest,
  RegisterRequest,
  CodeConfirmRequest,
  ResendVerificationRequest,
  ResendVerificationRequestSchema
  , LoginRequestSchema, RegisterRequestSchema, CodeConfirmRequestSchema
} from '@/lib/api/schema'
import {AUTH_COOKIES, COOKIE_OPTIONS} from '@/config/auth.config'
import {actionClient} from "@/lib/actions/ActionClient";

/**
 * Server action for user login
 * Calls backend login API and stores tokens in secure cookies
 */
export async function loginAsync(input: LoginRequest) {
  return actionClient.withInput(LoginRequestSchema, input).execute(async (validated) => {
    const api = getServerApi()

    const tokens = await api.post('api/auth/login', validated)

    const cookieStore = await cookies()

    cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.accessTokenExpiresIn || COOKIE_OPTIONS.accessTokenMaxAge,
      secure: process.env.NODE_ENV === 'production',
    })

    cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.refreshTokenExpiresIn || COOKIE_OPTIONS.refreshTokenMaxAge,
      secure: process.env.NODE_ENV === 'production',
    })

    return await api.get('api/users/me')
  })
}

/**
 * Server action for user registration
 * Calls backend register API
 */
export async function registerAsync(input: RegisterRequest) {
  return actionClient.withInput(RegisterRequestSchema, input).execute(async (validated) => {
    return await getServerApi().post('api/auth/register', validated)
  })
}

/**
 * Server action for user logout
 * Clears auth cookies
 */
export async function logoutAsync() {
  return actionClient.execute(async () => {
    try {
      await getServerApi().post('api/auth/logout', {})
    } finally {
      const cookieStore = await cookies()
      cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN)
      cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN)
    }
  })
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
  return getCurrentUserAsync()
}
/**
 * Server action to verify OTP code
 * Used in registration flow
 */
export async function verifyOTPAsync(input: CodeConfirmRequest) {
  return actionClient.withInput(CodeConfirmRequestSchema, input).execute(async (validated) => {
    await getServerApi().post('api/verification/confirm-code', validated)
  })
}

/**
 * Server action to resend OTP code
 * Used when user didn't receive the code
 */
export async function resendOTPAsync(input: ResendVerificationRequest) {
  return actionClient.withInput(ResendVerificationRequestSchema, input).execute(async (validated) => {
    await getServerApi().post('api/auth/resend-verification', {}, { params: validated })
  })
}