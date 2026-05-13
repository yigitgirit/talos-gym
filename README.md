# TalosGym

![Java](https://img.shields.io/badge/Java-25-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.4-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Redis](https://img.shields.io/badge/Redis-Alpine-red)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black)
![React](https://img.shields.io/badge/React-19.2.4-blue)

A full-stack Gym Management application built with **Spring Boot** and **Next.js**. TalosGym is designed to digitalize the core operations of a fitness franchise, handling club management, member registrations, subscription plans, payment tracking, and facility access.

## Table of Contents

- [Features](#features)
- [Gallery](#gallery)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Security & Authentication](#security--authentication)
- [API Reference](#api-reference)
- [API Response Standard](#api-response-standard)

## Features

### 👥 Member Management
- **User Profiles:** Members can create accounts, update their information, and manage account security
- **Authentication:** Secure login with JWT tokens, password reset, and email verification
- **Phone & Email Verification:** OTP-based phone verification and email confirmation links
- **Account Security:** Change passwords, update contact information with verification

### 🏋️ Club Management
- **Multi-Location Support:** Manage multiple gym locations/clubs
- **Club Discovery:** Members can browse clubs by location, amenities, and search
- **Operating Hours:** Set and manage club hours with special schedule overrides (holidays, closures)
- **Club Offers:** Create and display special promotions per location

### 📋 Membership Plans
- **Flexible Plans:** Create custom membership tiers with different pricing and durations
- **Plan Features:** Define what's included in each plan (e.g., unlimited classes, premium facilities)
- **Subscription Configs:** Set billing cycles, renewal periods, and pricing for each plan
- **Special Offers:** Create time-limited promotions and discounts for specific clubs or plans

### 💳 Subscriptions & Billing
- **Easy Enrollment:** Members can purchase and activate memberships with just a few clicks
- **Flexible Subscriptions:** Support various billing cycles (monthly, quarterly, annual)
- **Subscription Management:** Members can view, renew, or cancel their subscriptions anytime

### 🔔 Communication
- **Notification Preferences:** Members control how and when they receive updates
- **Smart Alerts:** Automated notifications about subscription, expiration and security alerts
- **Targeted Messages:** Send announcements to specific member groups or clubs

### 👨‍💼 Admin Features
- **User Administration:** View, manage, and moderate member accounts
- **Member Status Control:** Activate, deactivate, ban, or unban members
- **Club Management:** Create, edit, and delete clubs and their details
- **Analytics Dashboard:** Manage gym operations and monitor key metrics

## Gallery

*Screenshots coming soon...*

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yigitgirit/talos-gym.git
cd talos-gym
```

### 2. Choose Your Setup Method

#### Option A: Docker (Recommended)
The fastest way to spin up the entire stack. Requires Docker Desktop.

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Steps:**

1.  **Create Environment File:**
    ```bash
    cp .env.example .env
    ```
2.  **Start Services:**
    ```bash
    docker compose up -d --build
    ```

---

#### Option B: From Source
Run the backend and frontend locally while keeping the database in Docker.

**Prerequisites:**
- **Java 25** (JDK 25)
- **Node.js 24+**
- **Docker Desktop** (for Database)

**Steps:**

1.  **Setup Environment Files:**
    ```bash
    # For Backend
    cp apps/spring-boot-app/.env.example apps/spring-boot-app/.env

    # For Frontend
    cp apps/nextjs-app/.env.example apps/nextjs-app/.env.local
    ```

2.  **Start Database in Docker:**
    ```bash
    docker compose -f docker-compose.db.yaml up -d
    ```

3.  **Start Backend:**
    ```bash
    cd apps/spring-boot-app
    ./mvnw spring-boot:run
    ```

4.  **Start Frontend:**
    In a **new terminal**:
    ```bash
    cd apps/nextjs-app
    npm install
    npm run dev
    ```

---

### Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)
- **API Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Project Architecture

The project follows a **Monorepo** structure, separating the frontend and backend into distinct applications that communicate via a REST API.

```
talos-gym/
├── apps/
│   ├── spring-boot-app/           # Java 25 / Spring Boot Backend
│   │   ├── src/
│   │   ├── pom.xml                # Maven dependencies
│   │   ├── Dockerfile
│   │   └── .env.example           # Backend environment template
│   │
│   └── nextjs-app/                # React / Next.js Frontend
│       ├── src/
│       ├── package.json           # NPM dependencies
│       ├── next.config.ts
│       ├── Dockerfile
│       └── .env.example           # Frontend environment template
│
├── database/
│   ├── schema/                    # Database initialization scripts (not used often)
│   │   └── 00-create-user.sql
│   └── temporary/
│       ├── 01-ddl.sql
│       └── 02-mock-data.sql
│
├── docs/                          # Project documentation
│   └── api/
│       ├── API_CLIENT_GUIDE.md    # API client usage guide
│       └── others...
│
├── docker-compose.yaml            # Full stack orchestration (all services)
├── docker-compose.db.yaml         # Database-only setup (for local dev)
├── .env.example                   # Docker environment template
├── README.md                      # This file
```

## Project Structure

### Backend (Spring Boot)

```
apps/spring-boot-app/src/main/java/com/talosgym/talos_gym/
├── auth/                  # Authentication & JWT token handling
├── user/                  # User profile and account management
├── club/                  # Gym club/location management
├── membership/            # Membership plans and features
├── subscription/          # User subscriptions lifecycle
├── payment/               # Payment processing and billing
├── pricing/               # Pricing engine and calculations
├── notification/          # Email and SMS notifications
├── verification/          # Email/phone verification & OTP
├── config/                # Spring Boot configuration
├── security/              # Security filters and JWT utilities
├── exception/             # Custom exception handling
├── infrastructure/        # External integrations (LocationIQ, etc.)
└── common/                # Shared utilities and validators
```

**Architecture:** Layered (Controller → Service → Repository → Entity)  
**Key Features:** JWT Auth, JPA/Hibernate ORM, Spring Security, Redis Cache

### Frontend (Next.js)

```
apps/nextjs-app/src/
├── app/                   # Next.js App Router
│   ├── (marketing)/       # Public pages (home, about, clubs, plans)
│   ├── (member)/          # Member dashboard (account, billing, subscription)
│   ├── auth/              # Auth pages (login, register, verify-otp)
│   └── dashboard/         # Admin dashboard (analytics, users, memberships)
├── components/            # Reusable UI components
│   ├── layout/            # Header, footer, logo
│   ├── providers/         # Auth & theme providers
│   └── ui/                # Shadcn/UI components
├── features/              # Feature modules (auth, clubs, memberships, users, etc.)
│   ├── actions/           # Server actions
│   ├── components/        # Feature components
│   └── hooks/             # Feature hooks
├── lib/                   # Utility libraries
│   ├── api/               # API client & schemas
│   ├── actions/           # Action utilities
│   └── validation/        # Form validation
├── config/                # Global configuration
├── constants/             # App constants
└── types/                 # TypeScript types
```

**Architecture:** Feature-Sliced + App Router  
**Key Features:** Server/Client Components, Zustand State, Zod Validation, Tailwind CSS

## Technologies Used

### Frontend Layer
- **Framework:** Next.js 16
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4

### Backend Layer
- **Framework:** Spring Boot 4
- **Language:** Java 25
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security (JWT)
- **Documentation:** SpringDoc OpenAPI (Swagger UI)

### Database & Infrastructure
- **Database:** PostgreSQL 17
- **Cache:** Redis (Alpine)
- **Containerization:** Docker & Docker Compose
- **Build Tools:** Maven (Backend), NPM (Frontend)

## Configuration

The project uses a combination of environment variables and Spring Boot profiles for configuration.

### 1. Environment Variables

#### Docker Environment (`.env`)
Used when running the entire stack via `docker compose up -d`.

| Variable | Description |
|----------|-------------|
| `POSTGRES_DB` | Database name (`gym_dev`) |
| `POSTGRES_USER` | Admin Database username (`postgres`) |
| `POSTGRES_PASSWORD` | Admin Database password (`postgres`) |
| `SPRING_DATASOURCE_USERNAME` | Application DB User (`gym_app`) |
| `SPRING_DATASOURCE_PASSWORD` | Application DB Password (`talosgym123`) |
| `SPRING_DATA_REDIS_URL` | Redis connection URL (`redis://redis:6379`) |
| `JWT_SECRET_KEY` | Shared secret for signing tokens |
| `SPRING_MAIL_USERNAME` | SMTP sender email address |
| `SPRING_MAIL_PASSWORD` | SMTP password/app-specific password |
| `MACRODROID_WEBHOOK_URL` | Webhook URL for Macrodroid SMS integration |
| `MACRODROID_WEBHOOK_SECRET` | Security secret for Macrodroid webhook |
| `LOCATIONIQ_API_KEY` | API key for LocationIQ geocoding service |
| `DATABASE_PORT` | PostgreSQL port mapping (`5433`) |
| `BACKEND_PORT` | Spring Boot API port mapping (`8080`) |
| `FRONTEND_PORT` | Next.js Frontend port mapping (`3000`) |
| `SPRING_PROFILES_ACTIVE` | Spring Boot active profile (`dev`) |
| `NODE_ENV` | Node.js environment (`development`) |
| `FRONTEND_URL` | Frontend URL for CORS and mail links (`http://localhost:3000`) |
| `BACKEND_URL` | Backend API URL for internal routing (`http://localhost:8080`) |

#### Local Environments
Used when running applications from source (`mvnw` or `npm run dev`).

**Backend (`apps/spring-boot-app/.env`):**

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | DB Connection URL (`jdbc:postgresql://localhost:5433/gym_dev`)* |
| `SPRING_DATASOURCE_USERNAME` | Application DB User |
| `SPRING_DATASOURCE_PASSWORD` | Application DB Password |
| `SPRING_DATA_REDIS_URL` | Redis connection URL (`redis://localhost:6379`) |
| `JWT_SECRET_KEY` | Shared secret for signing tokens |
| `SPRING_PROFILES_ACTIVE` | Spring Boot active profile (`dev`) |
| `SPRING_MAIL_USERNAME` | SMTP sender email address (for email notifications) |
| `SPRING_MAIL_PASSWORD` | SMTP password/app-specific password |
| `MACRODROID_WEBHOOK_URL` | Webhook URL for Macrodroid SMS integration (optional) |
| `MACRODROID_WEBHOOK_SECRET` | Security secret for Macrodroid webhook (optional) |
| `LOCATIONIQ_API_KEY` | API key for LocationIQ geocoding service (optional) |

*\*Note: Defaults to mapped Docker port `5433`. If using a local Postgres instance, change to `5432`.*

**Frontend (`apps/nextjs-app/.env.local`):**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (`http://localhost:8080`) |
| `JWT_SECRET_KEY` | Shared secret for token validation |

## Security & Authentication

### 🔐 Core Security Features

- **SQL Injection Prevention:** All database queries use parameterized statements through JPA/Hibernate ORM, preventing direct SQL injection attacks
- **Password Security:** Passwords are securely hashed using bcrypt before being stored in the database, ensuring they cannot be reversed
- **JWT Authentication:** Stateless token-based authentication eliminates session storage vulnerabilities and enables scalability
- **Role-Based Access Control (RBAC):** Fine-grained permission system with admin, staff, and member roles for enforcing authorization policies

### 🛡️ Additional Security Measures

- **Email & Phone Verification:** Multi-factor verification (OTP codes and email links) prevent unauthorized account access
- **Token Refresh Mechanism (NOT YET):** Automatic token rotation with short-lived access tokens and longer-lived refresh tokens
- **CORS Configuration:** Cross-origin requests are validated to prevent unauthorized cross-domain attacks
- **Account Lockout:** Users can be banned/unbanned by admins to prevent brute-force attacks or abuse
- **Secure Password Reset:** Reset tokens and OTP codes add extra verification layers when users forget passwords

## API Reference

The API is organized around RESTful principles with a base path of `/api`. For a complete and interactive list of endpoints, visit the **Swagger UI** at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) after starting the backend.

### Authentication & Verification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with email and password |
| `/api/auth/register` | POST | Create a new user account |
| `/api/auth/logout` | POST | Logout and invalidate token |
| `/api/auth/refresh` | POST | Refresh expired JWT token |
| `/api/auth/forgot-password` | POST | Request password reset token |
| `/api/auth/reset-password-submit` | POST | Submit new password with reset token |
| `/api/auth/verify-otp` | POST | Verify OTP code for registration |
| `/api/auth/resend-verification` | POST | Resend verification code |
| `/api/verification/confirm-code` | POST | Confirm email/phone with code |
| `/api/verification/confirm-link` | GET | Confirm verification via email link |

### User Account Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/me` | GET | Get current user profile |
| `/api/users/me` | PUT | Update current user profile |
| `/api/users/me` | DELETE | Deactivate user account |
| `/api/users/me/change-password` | PATCH | Change password |
| `/api/users/me/verify-email` | POST | Verify email address |
| `/api/users/email/change-request` | POST | Request email change with verification |
| `/api/users/phone/change-request` | POST | Request phone change with OTP |

### Admin User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/management/users` | GET | List all users (paginated, searchable) |
| `/api/management/users/:id` | GET | Get user details by ID |
| `/api/management/users/:id` | PUT | Update user information |
| `/api/management/users/:id` | DELETE | Delete user account |
| `/api/management/users/:id/status` | PATCH | Change user account status |
| `/api/management/users/:id/roles` | PUT | Assign roles to user |
| `/api/management/users/:id/ban` | POST | Ban user account |
| `/api/management/users/:id/unban` | POST | Unban user account |

### Clubs & Locations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/clubs` | GET | Browse clubs (searchable, filterable by location) |
| `/api/clubs/:id` | GET | Get club details by ID |
| `/api/clubs/slug/:slug` | GET | Get club by URL slug |
| `/api/clubs/:clubId/schedule/operating-hours` | GET | Get club operating hours |
| `/api/clubs/:clubId/schedule/overrides` | GET | Get holiday/closure schedules |
| `/api/clubs/:slug/offers` | GET | Get club-specific offers |
| `/api/management/clubs` | POST | Create new club (admin only) |
| `/api/management/clubs/:id` | PUT | Update club details (admin only) |
| `/api/management/clubs/:id` | DELETE | Delete club (admin only) |
| `/api/management/clubs/:clubId/schedule/operating-hours` | PUT | Update club hours (admin only) |
| `/api/management/clubs/:clubId/schedule/overrides` | POST | Add schedule override (admin only) |

### Membership Plans & Features

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/management/features` | GET | List all membership features |
| `/api/management/features` | POST | Create new feature (admin only) |
| `/api/management/features/:featureId` | GET | Get feature details |
| `/api/management/features/:featureId` | PUT | Update feature (admin only) |
| `/api/management/features/:featureId` | DELETE | Delete feature (admin only) |
| `/api/management/plans` | GET | List all membership plans |
| `/api/management/plans` | POST | Create new plan (admin only) |
| `/api/management/plans/:planId` | GET | Get plan details |
| `/api/management/plans/:planId` | PUT | Update plan (admin only) |
| `/api/management/plans/:planId` | DELETE | Delete plan (admin only) |
| `/api/management/plans/:planId/features` | PUT | Assign features to plan (admin only) |
| `/api/management/plans/:planId/features/:featureId` | POST | Add feature to plan (admin only) |
| `/api/management/plans/:planId/features/:featureId` | DELETE | Remove feature from plan (admin only) |

### Subscription Configurations & Offers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/management/plans/:planId/subscription-configs` | GET | List subscription configs for plan |
| `/api/management/plans/:planId/subscription-configs` | POST | Create subscription config (admin only) |
| `/api/management/plans/:planId/subscription-configs/:configId` | PUT | Update subscription config (admin only) |
| `/api/management/plans/:planId/subscription-configs/:configId` | DELETE | Delete subscription config (admin only) |
| `/api/management/offers` | GET | List all offers (admin only) |
| `/api/management/offers` | POST | Create new offer (admin only) |
| `/api/management/offers/:offerId` | PUT | Update offer (admin only) |
| `/api/management/offers/:offerId` | DELETE | Delete offer (admin only) |
| `/api/clubs/:slug/offers/:offerId` | GET | Get public offer details |

### Subscriptions (User)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscriptions` | POST | Purchase new membership subscription |
| `/api/subscriptions/my` | GET | Get current user's subscriptions |
| `/api/subscriptions/:id` | GET | Get subscription details |
| `/api/subscriptions/:id/cancel` | PUT | Cancel subscription |

### Subscriptions (Admin)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/management/subscriptions` | GET | List all subscriptions (filtered, paginated) |
| `/api/management/subscriptions/:id` | GET | Get subscription details |
| `/api/management/subscriptions/:id/cancel` | PUT | Cancel subscription (admin override) |

### Payments & Notifications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments` | POST | Submit payment transaction |
| `/api/notification-preferences` | GET | Get user notification preferences |
| `/api/notification-preferences` | PUT | Update notification preferences |

## API Response Standard

The backend uses a standardized response structure for all API endpoints.

### 1. Success Response (2xx Status)

On successful requests, the API returns the data directly (no wrapper object).

**Example - Login Success (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Example - User Profile (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "createdAt": "2023-10-27T10:00:00Z"
}
```

**Example - Paginated List (200 OK):**

Uses `PagedData<T>` wrapper for paginated responses with metadata:

```json
{
  "items": [
    { "id": "1", "name": "Gold Plan", "price": 99.99 },
    { "id": "2", "name": "Silver Plan", "price": 59.99 }
  ],
  "metadata": {
    "pageSize": 20,
    "totalItems": 542,
    "totalPages": 28,
    "currentPage": 0
  }
}
```

### 2. Error Response (4xx/5xx Status)

On errors, the API returns an `ApiErrorResponse` object with:
- `code`: Machine-readable error code (from comprehensive `ErrorCode` enum covering validation, auth, business logic, and system errors)
- `message`: Human-readable error message
- `details`: Optional array of validation errors (only for validation errors)

**Example - Standard Error (404 Not Found):**
```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found",
  "details": null
}
```

**Example - Conflict (409 Conflict):**
```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email already exists",
  "details": null
}
```

**Example - Unauthorized (401 Unauthorized):**
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password.",
  "details": null
}
```

### 3. Validation Error (400 Bad Request)

For request validation failures, the `ApiErrorResponse` includes a `details` array with field-level validation information using `ValidationErrorDetail` records.

**Structure:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed.",
  "details": [
    {
      "field": "email",
      "message": "must be a well-formed email address",
      "rejectedValue": "invalid-email"
    },
    {
      "field": "password",
      "message": "must be at least 8 characters long",
      "rejectedValue": "abc123"
    }
  ]
}
```

**Example - Registration Validation Error:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed.",
  "details": [
    {
      "field": "firstName",
      "message": "must not be blank",
      "rejectedValue": null
    },
    {
      "field": "phone",
      "message": "must be a valid phone number",
      "rejectedValue": "12345"
    }
  ]
}
```
