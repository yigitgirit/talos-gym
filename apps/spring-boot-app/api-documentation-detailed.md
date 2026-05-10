# Talos Gym API Documentation

This document outlines the REST APIs for the entire application, dynamically generated from source code.

## Table of Contents
1. [Endpoints](#endpoints)
2. [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)

---

## Endpoints

### AdminSubscriptionController

#### Getallsubscriptions
- **Method:** `GET`
- **Endpoint:** `/api/management/subscriptions`
- **Returns:** `ResponseEntity<Page<SubscriptionResponse>>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| pageable | Query | Pageable | No |

**Request Body:**
Type: `SubscriptionFilterDto`

#### Getsubscriptionbyid
- **Method:** `GET`
- **Endpoint:** `/api/management/subscriptions/{id}`
- **Returns:** `ResponseEntity<SubscriptionResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

#### Cancelsubscription
- **Method:** `PUT`
- **Endpoint:** `/api/management/subscriptions/{id}/cancel`
- **Returns:** `ResponseEntity<Void>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

---

### AuthController

#### Register
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Returns:** `String`

**Request Body:**
Type: `RegisterRequest`

#### Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Returns:** `LoginResponse`

**Request Body:**
Type: `LoginRequest`

#### Refresh
- **Method:** `POST`
- **Endpoint:** `/api/auth/refresh`
- **Returns:** `RefreshResponse`

**Request Body:**
Type: `RefreshRequest`

#### Logout
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Returns:** `String`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| request | Query | HttpServletRequest | No |

#### Resendverification
- **Method:** `POST`
- **Endpoint:** `/api/auth/resend-verification`
- **Returns:** `String`

**Request Body:**
Type: `ResendVerificationRequest`

---

### AuthPasswordController

#### Forgotpassword
- **Method:** `POST`
- **Endpoint:** `/api/auth/forgot-password`
- **Returns:** `String`

**Request Body:**
Type: `ForgotPasswordRequest`

#### Verifyotp
- **Method:** `POST`
- **Endpoint:** `/api/auth/verify-otp`
- **Returns:** `Map<String, String>`

**Request Body:**
Type: `VerifyOtpRequest`

#### Resetpassword
- **Method:** `POST`
- **Endpoint:** `/api/auth/reset-password-submit`
- **Returns:** `void`

**Request Body:**
Type: `ResetPasswordRequest`

---

### ClubController

#### Getclubs
- **Method:** `GET`
- **Endpoint:** `/api/clubs`
- **Returns:** `PagedData<ClubResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| pageable | Query | Pageable | No |

**Request Body:**
Type: `ClubSearchRequest`

#### Getclubbyid
- **Method:** `GET`
- **Endpoint:** `/api/clubs/{id}`
- **Returns:** `ClubResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

#### Getclubbyslug
- **Method:** `GET`
- **Endpoint:** `/api/clubs/slug/{slug}`
- **Returns:** `ClubResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| slug | Path | String | Yes |

#### Getoffersforclub
- **Method:** `GET`
- **Endpoint:** `/api/clubs/{slug}/offers`
- **Returns:** `List<OfferCatalogResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| slug | Path | String | Yes |

#### Getofferdetail
- **Method:** `GET`
- **Endpoint:** `/api/clubs/{slug}/offers/{offerId}`
- **Returns:** `OfferCatalogResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| slug | Path | String | Yes |
| offerId | Path | Long | Yes |

---

### ClubManagementController

#### Createclub
- **Method:** `POST`
- **Endpoint:** `/api/management/clubs`
- **Returns:** `ClubResponse`

**Request Body:**
Type: `ClubCreateRequest`

#### Updateclub
- **Method:** `PUT`
- **Endpoint:** `/api/management/clubs/{id}`
- **Returns:** `ClubResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

**Request Body:**
Type: `ClubUpdateRequest`

#### Deleteclub
- **Method:** `DELETE`
- **Endpoint:** `/api/management/clubs/{id}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

---

### ClubScheduleController

#### Getoperatinghours
- **Method:** `GET`
- **Endpoint:** `/api/clubs/{clubId}/schedule/operating-hours`
- **Returns:** `List<OperatingHourDto>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |

#### Getoverridesindaterange
- **Method:** `GET`
- **Endpoint:** `/api/clubs/{clubId}/schedule/overrides`
- **Returns:** `List<ScheduleOverrideResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |
| startDate | Query | LocalDate | No |
| endDate | Query | LocalDate | No |

---

### ClubScheduleManagementController

#### Updateoperatinghours
- **Method:** `PUT`
- **Endpoint:** `/api/management/clubs/{clubId}/schedule/operating-hours`
- **Returns:** `List<OperatingHourDto>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |

**Request Body:**
Type: `UpdateOperatingHoursRequest`

#### Createoverride
- **Method:** `POST`
- **Endpoint:** `/api/management/clubs/{clubId}/schedule/overrides`
- **Returns:** `ScheduleOverrideResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |

**Request Body:**
Type: `ScheduleOverrideRequest`

#### Updateoverride
- **Method:** `PUT`
- **Endpoint:** `/api/management/clubs/{clubId}/schedule/overrides/{overrideId}`
- **Returns:** `ScheduleOverrideResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |
| overrideId | Path | Long | Yes |

**Request Body:**
Type: `ScheduleOverrideRequest`

#### Deleteoverride
- **Method:** `DELETE`
- **Endpoint:** `/api/management/clubs/{clubId}/schedule/overrides/{overrideId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Path | Long | Yes |
| overrideId | Path | Long | Yes |

---

### CommonController

#### Getavailabletimezones
- **Method:** `GET`
- **Endpoint:** `/common/timezones`
- **Returns:** `List<String>`

---

### FeatureController

#### Createfeature
- **Method:** `POST`
- **Endpoint:** `/api/management/features`
- **Returns:** `FeatureResponse`

**Request Body:**
Type: `CreateFeatureRequest`

#### Updatefeature
- **Method:** `PUT`
- **Endpoint:** `/api/management/features/{featureId}`
- **Returns:** `FeatureResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| featureId | Path | Long | Yes |

**Request Body:**
Type: `UpdateFeatureRequest`

#### Getfeaturebyid
- **Method:** `GET`
- **Endpoint:** `/api/management/features/{featureId}`
- **Returns:** `FeatureResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| featureId | Path | Long | Yes |

#### Getallfeatures
- **Method:** `GET`
- **Endpoint:** `/api/management/features`
- **Returns:** `List<FeatureResponse>`

#### Deletefeature
- **Method:** `DELETE`
- **Endpoint:** `/api/management/features/{featureId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| featureId | Path | Long | Yes |

---

### MembershipPlanController

#### Createplan
- **Method:** `POST`
- **Endpoint:** `/api/management/plans`
- **Returns:** `MembershipPlanResponse`

**Request Body:**
Type: `CreatePlanRequest`

#### Updateplan
- **Method:** `PUT`
- **Endpoint:** `/api/management/plans/{planId}`
- **Returns:** `MembershipPlanResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |

**Request Body:**
Type: `UpdatePlanRequest`

#### Deleteplan
- **Method:** `DELETE`
- **Endpoint:** `/api/management/plans/{planId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |

#### Getallplans
- **Method:** `GET`
- **Endpoint:** `/api/management/plans`
- **Returns:** `List<MembershipPlanResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| global | Query | Boolean | No |

#### Setfeatures
- **Method:** `PUT`
- **Endpoint:** `/api/management/plans/{planId}/features`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |

**Request Body:**
Type: `Set<Long>`

#### Addfeature
- **Method:** `POST`
- **Endpoint:** `/api/management/plans/{planId}/features/{featureId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |
| featureId | Path | Long | Yes |

#### Removefeature
- **Method:** `DELETE`
- **Endpoint:** `/api/management/plans/{planId}/features/{featureId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |
| featureId | Path | Long | Yes |

---

### NotificationPreferenceController

#### Getmypreferences
- **Method:** `GET`
- **Endpoint:** `/api/notification-preferences`
- **Returns:** `List<UserNotificationPreferenceDto>`

#### Updatepreference
- **Method:** `PUT`
- **Endpoint:** `/api/notification-preferences`
- **Returns:** `UserNotificationPreferenceDto`

**Request Body:**
Type: `UpdateNotificationPreferenceRequest`

---

### OfferController

#### Createoffer
- **Method:** `POST`
- **Endpoint:** `/api/management/offers`
- **Returns:** `OfferAdminResponse`

**Request Body:**
Type: `CreateOfferRequest`

#### Updateoffer
- **Method:** `PUT`
- **Endpoint:** `/api/management/offers/{offerId}`
- **Returns:** `OfferAdminResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| offerId | Path | Long | Yes |

**Request Body:**
Type: `UpdateOfferRequest`

#### Deleteoffer
- **Method:** `DELETE`
- **Endpoint:** `/api/management/offers/{offerId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| offerId | Path | Long | Yes |

#### Getoffers
- **Method:** `GET`
- **Endpoint:** `/api/management/offers`
- **Returns:** `List<OfferAdminResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| clubId | Query | Long | No |
| global | Query | Boolean | No |

---

### PlanSubscriptionConfigController

#### Addsubscriptionconfig
- **Method:** `POST`
- **Endpoint:** `/api/management/plans/{planId}/subscription-configs`
- **Returns:** `PlanSubscriptionConfigResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |

**Request Body:**
Type: `CreatePlanSubscriptionConfigRequest`

#### Updatesubscriptionconfig
- **Method:** `PUT`
- **Endpoint:** `/api/management/plans/{planId}/subscription-configs/{configId}`
- **Returns:** `PlanSubscriptionConfigResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |
| configId | Path | Long | Yes |

**Request Body:**
Type: `UpdatePlanSubscriptionConfigRequest`

#### Deletesubscriptionconfig
- **Method:** `DELETE`
- **Endpoint:** `/api/management/plans/{planId}/subscription-configs/{configId}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |
| configId | Path | Long | Yes |

#### Getsubscriptionconfigs
- **Method:** `GET`
- **Endpoint:** `/api/management/plans/{planId}/subscription-configs`
- **Returns:** `List<PlanSubscriptionConfigResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| planId | Path | Long | Yes |

---

### SubscriptionController

#### Createsubscription
- **Method:** `POST`
- **Endpoint:** `/api/subscriptions`
- **Returns:** `ResponseEntity<SubscriptionResponse>`

**Request Body:**
Type: `CreateSubscriptionRequest`

#### Getmysubscriptions
- **Method:** `GET`
- **Endpoint:** `/api/subscriptions/my`
- **Returns:** `ResponseEntity<List<SubscriptionResponse>>`

#### Getsubscriptionbyid
- **Method:** `GET`
- **Endpoint:** `/api/subscriptions/{id}`
- **Returns:** `ResponseEntity<SubscriptionResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

#### Cancelsubscription
- **Method:** `PUT`
- **Endpoint:** `/api/subscriptions/{id}/cancel`
- **Returns:** `ResponseEntity<Void>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

---

### UserController

#### Getmyprofile
- **Method:** `GET`
- **Endpoint:** `/api/users/me`
- **Returns:** `UserResponse`

#### Editmyprofile
- **Method:** `PUT`
- **Endpoint:** `/api/users/me`
- **Returns:** `UserResponse`

**Request Body:**
Type: `UpdateUserRequest`

#### Changepassword
- **Method:** `PATCH`
- **Endpoint:** `/api/users/me/change-password`
- **Returns:** `void`

**Request Body:**
Type: `ChangePasswordRequest`

#### Initiatephonechange
- **Method:** `POST`
- **Endpoint:** `/api/users/phone/change-request`
- **Returns:** `void`

**Request Body:**
Type: `PhoneChangeInitiateRequest`

#### Initiateemailchange
- **Method:** `POST`
- **Endpoint:** `/api/users/email/change-request`
- **Returns:** `void`

**Request Body:**
Type: `EmailChangeInitiateRequest`

#### Initiateemailverification
- **Method:** `POST`
- **Endpoint:** `/api/users/me/verify-email`
- **Returns:** `void`

#### Deletemyaccount
- **Method:** `DELETE`
- **Endpoint:** `/api/users/me`
- **Returns:** `void`

---

### UserManagementController

#### Getallusers
- **Method:** `GET`
- **Endpoint:** `/api/management/users`
- **Returns:** `PagedData<UserResponse>`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| page | Query | int | No |
| size | Query | int | No |
| search | Query | String | No |

#### Getuserbyid
- **Method:** `GET`
- **Endpoint:** `/api/management/users/{id}`
- **Returns:** `UserResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

#### Changeuserstatus
- **Method:** `PATCH`
- **Endpoint:** `/api/management/users/{id}/status`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |
| status | Query | UserStatus | No |

#### Updateuserroles
- **Method:** `PUT`
- **Endpoint:** `/api/management/users/{id}/roles`
- **Returns:** `UserResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

**Request Body:**
Type: `Set<Role>`

#### Updateuser
- **Method:** `PUT`
- **Endpoint:** `/api/management/users/{id}`
- **Returns:** `UserResponse`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

**Request Body:**
Type: `UpdateUserRequest`

#### Banuser
- **Method:** `POST`
- **Endpoint:** `/api/management/users/{id}/ban`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

**Request Body:**
Type: `UserBanRequest`

#### Unbanuser
- **Method:** `POST`
- **Endpoint:** `/api/management/users/{id}/unban`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

#### Deleteuser
- **Method:** `DELETE`
- **Endpoint:** `/api/management/users/{id}`
- **Returns:** `void`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| id | Path | Long | Yes |

---

### VerificationController

#### Confirmcode
- **Method:** `POST`
- **Endpoint:** `/api/verification/confirm-code`
- **Returns:** `String`

**Request Body:**
Type: `CodeConfirmRequest`

#### Confirmlink
- **Method:** `GET`
- **Endpoint:** `/api/verification/confirm-link`
- **Returns:** `String`

**Parameters:**
| Name | In | Type | Required |
|------|----|------|----------|
| token | Query | String | No |
| referenceId | Query | String | No |
| purpose | Query | VerificationPurpose | No |

---

## Data Transfer Objects (DTOs)

### AddressDto
| Type | Name |
|---|---|
| `LocationProvider` | `provider` |
| `String` | `externalLocationId` |

### ChangePasswordRequest
| Type | Name |
|---|---|
| `String` | `currentPassword` |
| `String` | `newPassword` |
| `String` | `confirmNewPassword` |

### ClubCreateRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `String` | `slug` |
| `AddressDto` | `address` |
| `String` | `timeZone` |
| `String` | `description` |
| `>` | `photoUrls` |
| `Double` | `scoreMultiplier` |

### ClubResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `String` | `name` |
| `String` | `slug` |
| `Address` | `address` |
| `String` | `timeZone` |
| `String` | `description` |
| `boolean` | `active` |
| `Double` | `scoreMultiplier` |
| `List<String>` | `photoUrls` |
| `List<OperatingHourDto>` | `operatingHours` |
| `List<ScheduleOverrideDto>` | `scheduleOverrides` |

### ClubSearchRequest
| Type | Name |
|---|---|
| `String` | `search` |
| `String` | `city` |
| `String` | `district` |
| `Boolean` | `active` |

### ClubUpdateRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `String` | `slug` |
| `AddressDto` | `address` |
| `String` | `timeZone` |
| `String` | `description` |
| `Double` | `scoreMultiplier` |
| `Boolean` | `active` |
| `>` | `photoUrls` |

### CodeConfirmRequest
| Type | Name |
|---|---|
| `String` | `referenceId` |
| `String` | `code` |
| `VerificationPurpose` | `purpose` |

### CreateFeatureRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `String` | `description` |

### CreateOfferRequest
| Type | Name |
|---|---|
| `Long` | `planId` |
| `Long` | `clubId` |
| `BigDecimal` | `price` |

### CreatePlanRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `boolean` | `isGlobal` |
| `Set<Long>` | `featureIds` |

### CreatePlanSubscriptionConfigRequest
| Type | Name |
|---|---|
| `Long` | `subscriptionTypeId` |
| `BigDecimal` | `multiplier` |
| `BigDecimal` | `discountRate` |
| `Integer` | `installments` |

### CreateSubscriptionRequest
| Type | Name |
|---|---|
| `Long` | `offerId` |
| `Long` | `subscriptionTypeId` |
| `String` | `paymentToken` |

### EmailChangeInitiateRequest
| Type | Name |
|---|---|
| `String` | `newEmail` |

### FeatureResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `String` | `name` |
| `String` | `description` |

### ForgotPasswordRequest
| Type | Name |
|---|---|
| `String` | `phoneNumber` |

### LocationIqResponse
| Type | Name |
|---|---|
| `String` | `lat` |
| `String` | `lon` |
| `String` | `displayName` |
| `LocationIqAddress` | `address` |
| `String` | `city` |
| `String` | `town` |
| `String` | `province` |
| `String` | `county` |
| `String` | `district` |
| `String` | `suburb` |

### LoginRequest
| Type | Name |
|---|---|
| `String` | `identifier` |
| `String` | `password` |

### LoginResponse
| Type | Name |
|---|---|
| `String` | `accessToken` |
| `String` | `refreshToken` |
| `String` | `tokenType` |
| `Long` | `accessTokenExpiresIn` |
| `Long` | `refreshTokenExpiresIn` |

### MembershipPlanResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `String` | `name` |
| `boolean` | `isGlobal` |
| `Set<FeatureResponse>` | `features` |

### NotificationRequest
| Type | Name |
|---|---|
| `String` | `recipient` |
| `Long` | `userId` |
| `String` | `subject` |
| `String` | `message` |
| `NotificationCategory` | `category` |
| `Set<NotificationChannel>` | `explicitChannels` |
| `Map<String, Object>` | `variables` |
| `String` | `recipient` |
| `Long` | `userId` |
| `String` | `subject` |
| `String` | `message` |
| `NotificationCategory` | `category` |

### OfferAdminResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `Long` | `planId` |
| `String` | `planName` |
| `Long` | `clubId` |
| `String` | `clubName` |
| `BigDecimal` | `price` |
| `String` | `currency` |

### OfferCatalogResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `String` | `planName` |
| `boolean` | `isGlobal` |
| `Set<FeatureResponse>` | `features` |
| `List<PaymentOptionDto>` | `paymentOptions` |

### OperatingHourDto
| Type | Name |
|---|---|
| `Long` | `id` |
| `DayOfWeek` | `dayOfWeek` |
| `LocalTime` | `openingTime` |
| `LocalTime` | `closingTime` |
| `boolean` | `closed` |

### PaymentOptionDto
| Type | Name |
|---|---|
| `Long` | `subscriptionTypeId` |
| `String` | `typeName` |
| `Integer` | `intervalMonths` |
| `BigDecimal` | `monthlyPrice` |
| `BigDecimal` | `totalPrice` |
| `Integer` | `installments` |
| `String` | `marketingBadge` |
| `String` | `description` |

### PaymentRequest
| Type | Name |
|---|---|
| `String` | `paymentToken` |
| `(Stripe/Iyzico` | `vesaire` |

### PhoneChangeInitiateRequest
| Type | Name |
|---|---|
| `String` | `newPhoneNumber` |

### PlanSubscriptionConfigResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `Long` | `planId` |
| `String` | `planName` |
| `SubscriptionTypeSummary` | `subscriptionType` |
| `BigDecimal` | `multiplier` |
| `BigDecimal` | `discountRate` |
| `Integer` | `installments` |

### RefreshRequest
| Type | Name |
|---|---|
| `String` | `refreshToken` |

### RefreshResponse
| Type | Name |
|---|---|
| `String` | `accessToken` |
| `String` | `refreshToken` |
| `String` | `tokenType` |
| `Long` | `accessTokenExpiresIn` |
| `Long` | `refreshTokenExpiresIn` |

### RegisterRequest
| Type | Name |
|---|---|
| `String` | `email` |
| `String` | `phoneNumber` |
| `String` | `password` |
| `String` | `firstName` |
| `String` | `lastName` |
| `Gender` | `gender` |

### ResendVerificationRequest
| Type | Name |
|---|---|
| `String` | `identifier` |

### ResetPasswordRequest
| Type | Name |
|---|---|
| `String` | `resetToken` |
| `String` | `newPassword` |
| `String` | `confirmNewPassword` |

### ScheduleOverrideDto
| Type | Name |
|---|---|
| `Long` | `id` |
| `LocalDate` | `overrideDate` |
| `LocalTime` | `openingTime` |
| `LocalTime` | `closingTime` |
| `boolean` | `closed` |
| `String` | `reason` |

### ScheduleOverrideRequest
| Type | Name |
|---|---|
| `LocalDate` | `targetDate` |
| `Boolean` | `isClosed` |
| `LocalTime` | `openTime` |
| `LocalTime` | `closeTime` |
| `String` | `reason` |

### ScheduleOverrideResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `LocalDate` | `targetDate` |
| `Boolean` | `isClosed` |
| `LocalTime` | `openTime` |
| `LocalTime` | `closeTime` |
| `String` | `reason` |

### SubscriptionFilterDto
| Type | Name |
|---|---|
| `Long` | `userId` |
| `Long` | `planId` |
| `SubscriptionStatus` | `status` |
| `String` | `paymentReference` |

### SubscriptionResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `Long` | `planId` |
| `String` | `planName` |
| `LocalDate` | `startDate` |
| `LocalDate` | `endDate` |
| `BigDecimal` | `totalAmount` |
| `SubscriptionStatus` | `status` |

### UpdateFeatureRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `String` | `description` |

### UpdateNotificationPreferenceRequest
| Type | Name |
|---|---|
| `NotificationCategory` | `category` |
| `Set<NotificationChannel>` | `channels` |

### UpdateOfferRequest
| Type | Name |
|---|---|
| `BigDecimal` | `newPrice` |

### UpdateOperatingHoursRequest
| Type | Name |
|---|---|
| `List<OperatingHourDto>` | `operatingHours` |

### UpdatePlanRequest
| Type | Name |
|---|---|
| `String` | `name` |
| `Boolean` | `isGlobal` |

### UpdatePlanSubscriptionConfigRequest
| Type | Name |
|---|---|
| `BigDecimal` | `multiplier` |
| `BigDecimal` | `discountRate` |
| `Integer` | `installments` |

### UpdateUserRequest
| Type | Name |
|---|---|
| `String` | `firstName` |
| `String` | `lastName` |
| `Gender` | `gender` |

### UserBanRequest
| Type | Name |
|---|---|
| `String` | `reason` |

### UserChangeRequest
| Type | Name |
|---|---|
| `Long` | `userId` |
| `RequestType` | `type` |
| `String` | `newValue` |
| `String` | `verificationCode` |
| `Instant` | `expiresAt` |

### UserCreateRequest
| Type | Name |
|---|---|
| `String` | `email` |
| `String` | `password` |
| `String` | `firstName` |
| `String` | `lastName` |
| `Set<Role>` | `roles` |
| `Gender` | `gender` |

### UserNotificationPreferenceDto
| Type | Name |
|---|---|
| `NotificationCategory` | `category` |
| `Set<NotificationChannel>` | `channels` |

### UserResponse
| Type | Name |
|---|---|
| `Long` | `id` |
| `String` | `email` |
| `String` | `phoneNumber` |
| `String` | `firstName` |
| `String` | `lastName` |
| `Gender` | `gender` |
| `Set<Role>` | `roles` |
| `UserStatus` | `status` |

### VerificationRequest
| Type | Name |
|---|---|
| `Long` | `userId` |
| `VerificationType` | `type` |
| `NotificationChannel` | `channel` |
| `VerificationPurpose` | `purpose` |
| `String` | `referenceId` |

### VerifyOtpRequest
| Type | Name |
|---|---|
| `String` | `phoneNumber` |
| `String` | `otpCode` |

