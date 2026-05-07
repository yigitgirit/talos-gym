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
    VerifyOtpRequest,
    PaymentRequest,
    ClubResponse,
    ClubCreateRequest,
    ClubUpdateRequest,
    OperatingHourDto,
    ScheduleOverrideResponse,
    ScheduleOverrideRequest,
    UpdateOperatingHoursRequest
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
        POST: EndpointOperation<string, RegisterRequest>;
    };
    'api/auth/logout': {
        POST: EndpointOperation<string>;
    };
    'api/auth/refresh': {
        POST: EndpointOperation<RefreshResponse, RefreshRequest>;
    };
    'api/auth/verify-otp': {
        POST: EndpointOperation<{ resetToken: string }, VerifyOtpRequest>;
    };
    'api/auth/reset-password-submit': {
        POST: EndpointOperation<void, ResetPasswordRequest>;
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
        GET: EndpointOperation<string>; // Query params: token, referenceId, purpose
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
    'api/management/users': {
        GET: EndpointOperation<PagedData<UserResponse>>; // Query params: page, size, search
    };
    'api/management/users/:id': {
        GET: EndpointOperation<UserResponse>;
        PUT: EndpointOperation<UserResponse, UpdateUserRequest>;
        DELETE: EndpointOperation<void>;
    };
    'api/management/users/:id/status': {
        PATCH: EndpointOperation<void>; // Query params: status
    };
    'api/management/users/:id/roles': {
        PUT: EndpointOperation<UserResponse, Role[]>;
    };
    'api/management/users/:id/ban': {
        POST: EndpointOperation<void, UserBanRequest>;
    };
    'api/management/users/:id/unban': {
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

    // Common Endpoints
    'common/timezones': {
        GET: EndpointOperation<string[]>;
    };

    // Club Public Endpoints
    'api/clubs': {
        GET: EndpointOperation<PagedData<ClubResponse>>; // Query params: search, city, district, active, page, size
    };
    'api/clubs/:id': {
        GET: EndpointOperation<ClubResponse>;
    };
    'api/clubs/slug/:slug': {
        GET: EndpointOperation<ClubResponse>;
    };
    'api/clubs/:clubId/schedule/operating-hours': {
        GET: EndpointOperation<OperatingHourDto[]>;
    };
    'api/clubs/:clubId/schedule/overrides': {
        GET: EndpointOperation<ScheduleOverrideResponse[]>; // Query params: startDate, endDate
    };

    // Club Management Endpoints
    'api/management/clubs': {
        POST: EndpointOperation<ClubResponse, ClubCreateRequest>;
    };
    'api/management/clubs/:id': {
        PUT: EndpointOperation<ClubResponse, ClubUpdateRequest>;
        DELETE: EndpointOperation<void>;
    };
    'api/management/clubs/:clubId/schedule/operating-hours': {
        PUT: EndpointOperation<OperatingHourDto[], UpdateOperatingHoursRequest>;
    };
    'api/management/clubs/:clubId/schedule/overrides': {
        POST: EndpointOperation<ScheduleOverrideResponse, ScheduleOverrideRequest>;
    };
    'api/management/clubs/:clubId/schedule/overrides/:overrideId': {
        PUT: EndpointOperation<ScheduleOverrideResponse, ScheduleOverrideRequest>;
        DELETE: EndpointOperation<void>;
    };
};