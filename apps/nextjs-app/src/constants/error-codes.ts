/**
 * Backend Error Codes Mapping
 * Maps Spring Boot error codes to user-friendly messages
 * DRY: Single source of truth for error code messages
 */

// Error code categories from backend ErrorCode.java
export const ERROR_CODES = {
  // Business Logic - User & Generic (E1xxx)
  USER_NOT_FOUND: "E1001",
  EMAIL_ALREADY_EXISTS: "E1002",
  REFRESH_TOKEN_NOT_FOUND: "E1003",
  PHONE_NUMBER_ALREADY_EXISTS: "E1004",
  USER_NOT_VERIFIED: "E1005",
  EMAIL_NOT_VERIFIED: "E1006",

  // Authentication & Security (E2xxx)
  UNAUTHORIZED: "E2001",
  INVALID_CREDENTIALS: "E2002",
  FORBIDDEN: "E2003",
  TOKEN_EXPIRED: "E2004",
  REFRESH_TOKEN_EXPIRED: "E2005",
  USER_ACCOUNT_LOCKED: "E2006",
  PENDING_USER_NOT_FOUND: "E2007",

  // Data & Validation (E3xxx)
  VALIDATION_ERROR: "E3001",
  MALFORMED_REQUEST: "E3002",
  INVALID_ARGUMENT_FORMAT: "E3003",
  ENDPOINT_NOT_FOUND: "E3004",
  RESOURCE_NOT_FOUND: "E3005",
  METHOD_NOT_SUPPORTED: "E3006",
  UNSUPPORTED_MEDIA_TYPE: "E3007",
  DATA_INTEGRITY_VIOLATION: "E3008",

  // Business Logic (E4xxx)
  PAYMENT_AMOUNT_MISMATCH: "E4016",
  PAYMENT_PROCESSING_ERROR: "E4017",

  // Verification (E41xx)
  VERIFICATION_FAILED: "E4101",
  VERIFICATION_EXPIRED: "E4102",
  VERIFICATION_NOT_FOUND: "E4103",
  VERIFICATION_ALREADY_COMPLETED: "E4104",

  // System Errors (E5xxx)
  INTERNAL_SERVER_ERROR: "E5000",
  NOT_IMPLEMENTED: "E5001",

  // External Services (E6xxx)
  SMS_SERVICE_ERROR: "E6000"
} as const

/**
 * User-friendly error messages for each error code
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // E1xxx - User errors
  [ERROR_CODES.USER_NOT_FOUND]: "User account not found. Please check your email or phone number.",
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: "This email address is already registered. Please use a different email or try logging in.",
  [ERROR_CODES.REFRESH_TOKEN_NOT_FOUND]: "Your session has expired. Please log in again.",
  [ERROR_CODES.PHONE_NUMBER_ALREADY_EXISTS]: "This phone number is already registered. Please use a different phone number.",
  [ERROR_CODES.USER_NOT_VERIFIED]: "Your account has not been verified yet. Please check your phone or email to complete verification.",
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: "The email address you provided is not verified. Please verify your email before logging in.",

  // E2xxx - Authentication errors
  [ERROR_CODES.UNAUTHORIZED]: "Authentication required. Please log in.",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email/phone or password. Please try again.",
  [ERROR_CODES.FORBIDDEN]: "You do not have permission to access this resource.",
  [ERROR_CODES.TOKEN_EXPIRED]: "Your login session has expired. Please log in again.",
  [ERROR_CODES.REFRESH_TOKEN_EXPIRED]: "Your session has expired. Please log in again.",
  [ERROR_CODES.USER_ACCOUNT_LOCKED]: "Your account has been locked. Please contact support.",
  [ERROR_CODES.PENDING_USER_NOT_FOUND]: "User registration is not found. Please try to register again.",

  // E3xxx - Validation errors
  [ERROR_CODES.VALIDATION_ERROR]: "Please check the information you entered and try again.",
  [ERROR_CODES.MALFORMED_REQUEST]: "The request format is invalid. Please try again.",
  [ERROR_CODES.INVALID_ARGUMENT_FORMAT]: "One or more fields have invalid format. Please check and try again.",
  [ERROR_CODES.ENDPOINT_NOT_FOUND]: "The requested endpoint does not exist.",
  [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested resource was not found.",
  [ERROR_CODES.METHOD_NOT_SUPPORTED]: "This action is not supported.",
  [ERROR_CODES.UNSUPPORTED_MEDIA_TYPE]: "The file type is not supported.",
  [ERROR_CODES.DATA_INTEGRITY_VIOLATION]: "There was a conflict with your request. Please try again.",

  // E4xxx - Business logic errors
  [ERROR_CODES.PAYMENT_AMOUNT_MISMATCH]: "Payment amount does not match. Please try again.",
  [ERROR_CODES.PAYMENT_PROCESSING_ERROR]: "Payment is being processed. Please wait a moment and try again.",

  // E41xx - Verification errors
  [ERROR_CODES.VERIFICATION_EXPIRED]: "The verification code has expired. Please request a new code.",
  [ERROR_CODES.VERIFICATION_NOT_FOUND]: "The verification code was not found. Please request a new code.",
  [ERROR_CODES.VERIFICATION_ALREADY_COMPLETED]: "This account has already been verified.",

  // E5xxx - System errors
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Please try again later.",
  [ERROR_CODES.NOT_IMPLEMENTED]: "This feature is not yet available.",

  // E6xxx - External service errors
  [ERROR_CODES.SMS_SERVICE_ERROR]: "Failed to send SMS. Please try again later or contact support."
} as const

/**
 * Get user-friendly message for error code
 */
export const getErrorMessage = (code: string, fallback?: string): string => {
  return ERROR_MESSAGES[code] || fallback || "An error occurred. Please try again."
}
