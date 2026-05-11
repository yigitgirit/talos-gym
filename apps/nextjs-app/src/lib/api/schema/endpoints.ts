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
    UpdateOperatingHoursRequest,
    CreateFeatureRequest,
    FeatureResponse,
    UpdateFeatureRequest,
    CreatePlanRequest,
    MembershipPlanResponse,
    UpdatePlanRequest,
    CreateOfferRequest,
    OfferAdminResponse,
    UpdateOfferRequest,
    CreatePlanSubscriptionConfigRequest,
    PlanSubscriptionConfigResponse,
    UpdatePlanSubscriptionConfigRequest,
    CreateSubscriptionRequest,
    SubscriptionResponse,
    OfferCatalogResponse
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
    'api/clubs/:slug/offers': {
        GET: EndpointOperation<OfferCatalogResponse[]>;
    };
    'api/clubs/:slug/offers/:offerId': {
        GET: EndpointOperation<OfferCatalogResponse>;
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

    // -----------------------------------------------------------------
    // Membership Feature Endpoints
    // -----------------------------------------------------------------
    'api/management/features': {
        POST: EndpointOperation<FeatureResponse, CreateFeatureRequest>;
        GET: EndpointOperation<FeatureResponse[]>; // list all features
    };
    'api/management/features/:featureId': {
        GET: EndpointOperation<FeatureResponse>;
        PUT: EndpointOperation<FeatureResponse, UpdateFeatureRequest>;
        DELETE: EndpointOperation<void>;
    };

    // -----------------------------------------------------------------
    // Membership Plan Endpoints
    // -----------------------------------------------------------------
    'api/management/plans': {
        POST: EndpointOperation<MembershipPlanResponse, CreatePlanRequest>;
        GET: EndpointOperation<MembershipPlanResponse[]>; // list all plans (optional filter via query param)
    };
    'api/management/plans/:planId': {
        GET: EndpointOperation<MembershipPlanResponse>;
        PUT: EndpointOperation<MembershipPlanResponse, UpdatePlanRequest>;
        DELETE: EndpointOperation<void>;
        // Feature association endpoints
        // Use separate path definitions for clarity
    };
    'api/management/plans/:planId/features': {
        PUT: EndpointOperation<void, Array<number>>; // replace whole set of feature IDs
    };
    'api/management/plans/:planId/features/:featureId': {
        POST: EndpointOperation<void>;   // add a single feature
        DELETE: EndpointOperation<void>; // remove a single feature
    };

    // -----------------------------------------------------------------
    // Plan Subscription Config Endpoints
    // -----------------------------------------------------------------
    'api/management/plans/:planId/subscription-configs': {
        POST: EndpointOperation<PlanSubscriptionConfigResponse, CreatePlanSubscriptionConfigRequest>;
        GET: EndpointOperation<PlanSubscriptionConfigResponse[]>; // list configs for a plan
    };
    'api/management/plans/:planId/subscription-configs/:configId': {
        PUT: EndpointOperation<PlanSubscriptionConfigResponse, UpdatePlanSubscriptionConfigRequest>;
        DELETE: EndpointOperation<void>;
    };

    // -----------------------------------------------------------------
    // Offer Endpoints
    // -----------------------------------------------------------------
    'api/management/offers': {
        POST: EndpointOperation<OfferAdminResponse, CreateOfferRequest>;
        GET: EndpointOperation<OfferAdminResponse[]>; // optionally filter by clubId / global via query params
    };
    'api/management/offers/:offerId': {
        PUT: EndpointOperation<OfferAdminResponse, UpdateOfferRequest>;
        DELETE: EndpointOperation<void>;
    };

    // -----------------------------------------------------------------
    // Subscription – Admin Endpoints
    // -----------------------------------------------------------------
    'api/management/subscriptions': {
        GET: EndpointOperation<PagedData<SubscriptionResponse>>; // filter via query params + pagination
    };
    'api/management/subscriptions/:id': {
        GET: EndpointOperation<SubscriptionResponse>;
    };
    'api/management/subscriptions/:id/cancel': {
        PUT: EndpointOperation<void>;
    };

    // -----------------------------------------------------------------
    // Subscription – User Endpoints
    // -----------------------------------------------------------------
    'api/subscriptions': {
        POST: EndpointOperation<SubscriptionResponse, CreateSubscriptionRequest>;
    };
    'api/subscriptions/my': {
        GET: EndpointOperation<SubscriptionResponse[]>; // list of current user's subscriptions
    };
    'api/subscriptions/:id': {
        GET: EndpointOperation<SubscriptionResponse>;
    };
    'api/subscriptions/:id/cancel': {
        PUT: EndpointOperation<void>;
    };
};
