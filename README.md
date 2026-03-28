# TalosGym

![Java](https://img.shields.io/badge/Java-25-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)

A full-stack Gym Management application built with **Spring Boot** and **Next.js**. TalosGym is designed to digitalize the core operations of a fitness center, handling member registrations, subscription plans, payment tracking, and facility access.

## Table of Contents

- [Features](#features)
- [Gallery](#gallery)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Security & Authentication](#security--authentication)
- [API Reference](#api-reference)
- [API Response Standard](#api-response-standard)

## Features

- **Member Management:** Handle member profiles, status, and information.
- **Subscription Management:** Create and manage flexible membership plans and subscriptions.
- **Financial Tracking:** Process payments and manage billing cycles.
- **Access Control:** A check-in system to manage gym access.
- **Admin Dashboard:** Provides an overview of gym operations and key metrics.
- **Automated Notifications:** Keep members informed about their subscriptions and payments.

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
/
├── apps/
│   ├── spring-boot-app/    # Java 25 / Spring Boot Backend
│   └── nextjs-app/         # React / Next.js Frontend
└── database/               # Postgres config & init scripts
```

## Technologies Used

### Frontend Layer
- **Framework:** Next.js 16.2.1
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS

### Backend Layer
- **Framework:** Spring Boot 4.0.4
- **Language:** Java 25
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security (JWT)
- **Documentation:** SpringDoc OpenAPI (Swagger UI)

### Database & Infrastructure
- **Database:** PostgreSQL 17
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
| `JWT_SECRET_KEY` | Shared secret for signing tokens |

#### Local Environments
Used when running applications from source (`mvnw` or `npm run dev`).

**Backend (`apps/spring-boot-app/.env`):**

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | DB Connection URL (`jdbc:postgresql://localhost:5433/gym_dev`)* |
| `SPRING_DATASOURCE_USERNAME` | Application DB User |
| `SPRING_DATASOURCE_PASSWORD` | Application DB Password |
| `JWT_SECRET_KEY` | Shared secret for signing tokens |
| `SPRING_PROFILES_ACTIVE` | Spring Boot active profile (`dev`) |

*\*Note: Defaults to mapped Docker port `5433`. If using a local Postgres instance, change to `5432`.*

**Frontend (`apps/nextjs-app/.env.local`):**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (`http://localhost:8080`) |
| `JWT_SECRET_KEY` | Shared secret for token validation |

## Security & Authentication

- **Stateless Authentication:** The system uses JSON Web Tokens (JWT) for verifying user identity.
- **Password Security:** Passwords are securely hashed before being stored in the database.

## API Reference

The API is organized around RESTful principles with a base path of `/api`. Key modules include:

- `/auth`
- `/members`
- `/plans`
- `/subscriptions`
- `/checkin`
- `/billing`

For a complete and interactive list of endpoints, visit the **Swagger UI** at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) after starting the backend.

## API Response Standard

The backend uses a standardized JSON structure for all API responses to ensure consistency.

### 1. Success Response
Contains `success: true` and a `data` payload or a `message`.

```json
{
  "success": true,
  "timestamp": "2023-10-27T10:00:00Z",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 2. Error Response
Contains `success: false` and a structured `error` object.

```json
{
  "success": false,
  "timestamp": "2023-10-27T10:05:00Z",
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with the given ID was not found."
  }
}
```

### 3. Validation Error
For request validation failures, the `error` object includes a `details` array.

```json
{
  "success": false,
  "timestamp": "2023-10-27T10:10:00Z",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided.",
    "details": [
      {
        "field": "email",
        "message": "must be a well-formed email address",
        "rejectedValue": "invalid-email"
      }
    ]
  }
}
```