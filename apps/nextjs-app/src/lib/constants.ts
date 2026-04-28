export const SESSION_KEYS = {
  PENDING_REGISTRATION_ID: "register_referenceId",
  PENDING_PHONE_NUMBER: "register_phoneNumber"
} as const

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  DASHBOARD: "/dashboard"
} as const