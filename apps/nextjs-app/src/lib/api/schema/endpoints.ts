import {
    ChangePasswordRequest,
    CodeConfirmRequest,
    EmailChangeInitiateRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse, PagedData,
    PhoneChangeInitiateRequest,
    RefreshRequest,
    RefreshResponse,
    RegisterRequest, ResendVerificationRequest,
    ResetPasswordRequest,
    Role,
    UpdateNotificationPreferenceRequest,
    UpdateUserRequest,
    UserBanRequest,
    UserNotificationPreferenceDto,
    UserResponse,
    VerifyOtpRequest
} from "@/lib/api/schema";
import type { EndpointOperation } from "@/lib/api/core/route-types";

/**
 * The Central API Dictionary.
 * Every endpoint in your Spring Boot application must be registered here.
 *
 */
export type ApiEndpoints = {
    // Auth Endpoints
    'api/auth/login': {
        POST: EndpointOperation<LoginResponse, LoginRequest>;
    };
    'api/auth/register': {
        POST: EndpointOperation<void, RegisterRequest>;
    };
    'api/auth/logout': {
        POST: EndpointOperation<void>;
    };
    'api/auth/refresh': {
        POST: EndpointOperation<RefreshResponse, RefreshRequest>;
    };
    'api/auth/verify-otp': {
        POST: EndpointOperation<{ resetToken: string }, VerifyOtpRequest>;
    };
    'api/auth/reset-password-submit': {
        POST: EndpointOperation<string, ResetPasswordRequest>;
    };
    'api/auth/forgot-password': {
        POST: EndpointOperation<string, ForgotPasswordRequest>;
    };
    'api/auth/resend-verification': {
        POST: EndpointOperation<string, ResendVerificationRequest>;
    };

    // Verification Endpoints
    'api/verification/confirm-code': {
        POST: EndpointOperation<string, CodeConfirmRequest>;
    };
    'api/verification/confirm-link': {
        GET: EndpointOperation<string>;
    };

    // Current User Endpoints
    'api/users/me': {
        GET: EndpointOperation<UserResponse>;
        PUT: EndpointOperation<UserResponse, UpdateUserRequest>;
        DELETE: EndpointOperation<void>;
    };
    'api/users/me/change-password': {
        PATCH: EndpointOperation<void, ChangePasswordRequest>;
    };
    'api/users/phone/change-request': {
        POST: EndpointOperation<void, PhoneChangeInitiateRequest>;
    };
    'api/users/email/change-request': {
        POST: EndpointOperation<void, EmailChangeInitiateRequest>;
    };
    'api/users/me/verify-email': {
        POST: EndpointOperation<void>;
    };

    // Admin User Endpoints
    'admin/users': {
        GET: EndpointOperation<PagedData<UserResponse>>;
    };
    'admin/users/:id': {
        GET: EndpointOperation<UserResponse>;
        PUT: EndpointOperation<UserResponse, UpdateUserRequest>;
        DELETE: EndpointOperation<void>;
    };
    'admin/users/:id/status': {
        PATCH: EndpointOperation<void>;
    };
    'admin/users/:id/roles': {
        PUT: EndpointOperation<UserResponse, Role[]>;
    };
    'admin/users/:id/ban': {
        POST: EndpointOperation<void, UserBanRequest>;
    };
    'admin/users/:id/unban': {
        POST: EndpointOperation<void>;
    };

    // Payments
    'api/payments': {
        POST: EndpointOperation<void, PaymentRequest>;
    };

    // Notifications
    'api/notification-preferences': {
        GET: EndpointOperation<UserNotificationPreferenceDto[]>;
        PUT: EndpointOperation<UserNotificationPreferenceDto, UpdateNotificationPreferenceRequest>;
    };
};