# Talos Gym - Membership Data Model Documentation

This document provides a detailed overview of the core data models related to the membership system. It outlines the structure of each entity, its fields, and its relationships with other entities.

## Table of Contents
1. [Club](#club)
2. [Feature](#feature)
3. [MembershipPlan](#membershipplan)
4. [Offer](#offer)
5. [Entity Relationship Diagram (ERD) Summary](#entity-relationship-diagram-erd-summary)

---

## 1. Club

Represents a physical gym location. It holds information about the gym's name, address, operating hours, and other specific details.

### Fields

| Field Name | Data Type | Constraints / Notes | Description |
|---|---|---|---|
| `id` | `Long` | Primary Key | Unique identifier for the club. |
| `name` | `String` | - | The official name of the club. |
| `scoreMultiplier` | `Double` | - | A multiplier used for internal scoring or ranking. |
| `address` | `Address` | `@Embedded` | An embedded object containing detailed address information (street, city, etc.). |
| `active` | `boolean` | `nullable=false`, default `true` | A flag to indicate if the club is currently active and operational. |
| `slug` | `String` | `nullable=false`, `unique=true` | A URL-friendly unique identifier for the club. |
| `timeZone` | `String` | `nullable=false` | The time zone in which the club operates (e.g., "Europe/Istanbul"). |
| `description` | `String` | - | A detailed description of the club. |
| `photoUrls` | `List<String>` | `@ElementCollection` | A list of URLs for photos of the club. |
| `operatingHours` | `List<ClubOperatingHour>` | `@OneToMany` | A list of standard operating hours for each day of the week. |
| `scheduleOverrides` | `List<ClubScheduleOverride>` | `@OneToMany` | A list of exceptions to the standard operating hours (e.g., holidays). |

### Relationships

- **`ClubOperatingHour`**: One-to-Many. A `Club` can have multiple `ClubOperatingHour` entries, one for each day it operates.
- **`ClubScheduleOverride`**: One-to-Many. A `Club` can have multiple `ClubScheduleOverride` entries for special dates.
- **`Offer`**: One-to-Many. A `Club` can have many `Offer`s available for purchase.

---

## 2. Feature

Represents a single, atomic benefit or service included in a membership plan (e.g., "Pool Access", "24/7 Access", "Sauna").

### Fields

| Field Name | Data Type | Constraints / Notes | Description |
|---|---|---|---|
| `id` | `Long` | Primary Key | Unique identifier for the feature. |
| `name` | `String` | `nullable=false`, `length=100` | The name of the feature. |
| `description` | `String` | `columnDefinition="TEXT"` | A detailed description of what the feature includes. |

### Relationships

- **`MembershipPlan`**: Many-to-Many. A `Feature` can be part of multiple `MembershipPlan`s, and a `MembershipPlan` can include multiple `Feature`s. This is managed via the `plan_features` join table.

---

## 3. MembershipPlan

Represents a template or a package of features. It defines what a membership includes. A plan can be "global" (available everywhere) or specific to certain clubs via `Offer`s.

### Fields

| Field Name | Data Type | Constraints / Notes | Description |
|---|---|---|---|
| `id` | `Long` | Primary Key | Unique identifier for the plan. |
| `name` | `String` | `nullable=false`, `length=50` | The name of the membership plan (e.g., "Gold Tier", "Basic Monthly"). |
| `isGlobal` | `boolean` | `default=false` | If `true`, this plan is not tied to a specific club and can be offered universally. |
| `features` | `Set<Feature>` | `@ManyToMany` | The set of features included in this plan. |
| `isDeleted` | `boolean` | `default=false`, `@SQLRestriction` | A soft-delete flag. The `@SQLRestriction` ensures that queries on this entity automatically filter out deleted records. |

### Relationships

- **`Feature`**: Many-to-Many. A `MembershipPlan` can contain a set of `Feature`s.
- **`Offer`**: One-to-Many. A `MembershipPlan` can be sold through multiple `Offer`s, each with a specific price and club assignment.

---

## 4. Offer

This entity connects a `MembershipPlan` to a `Club` and assigns it a price. It represents a purchasable membership product.

### Fields

| Field Name | Data Type | Constraints / Notes | Description |
|---|---|---|---|
| `id` | `Long` | Primary Key | Unique identifier for the offer. |
| `plan` | `MembershipPlan` | `@ManyToOne`, `nullable=false` | The membership plan being offered. |
| `club` | `Club` | `@ManyToOne` | The specific club where this offer is valid. Can be `null` if the associated `MembershipPlan` is global. |
| `basePrice` | `BigDecimal` | `nullable=false`, `precision=10, scale=2` | The price of the offer. |
| `currency` | `String` | `length=3`, `default='TRY'` | The currency code for the price (e.g., "TRY", "USD"). |

### Constraints

- **Unique Constraint**: A combination of `plan_id` and `club_id` must be unique. This prevents creating duplicate offers for the same plan at the same club.

### Relationships

- **`MembershipPlan`**: Many-to-One. Each `Offer` is based on exactly one `MembershipPlan`.
- **`Club`**: Many-to-One. Each `Offer` is typically associated with one `Club`.

---

## 5. Entity Relationship Diagram (ERD) Summary

```
+------------------+       +--------------------+       +------------------+
|      Club        |       |       Offer        |       |  MembershipPlan  |
+------------------+       +--------------------+       +------------------+
| PK id            |-------| FK club_id (nullable)|       | PK id            |
| name             |       | FK plan_id         |-------| name             |
| ...              |       | basePrice          |       | isGlobal         |
+------------------+       | currency           |       | ...              |
                         +--------------------+       +------------------+
                                                            |
                                                            | (ManyToMany)
                                                            |
                                                      +-----------+
                                                      |  Feature  |
                                                      +-----------+
                                                      | PK id     |
                                                      | name      |
                                                      | ...       |
                                                      +-----------+
```

### Key Relationships:

- A **Club** can have many **Offers**.
- An **Offer** links one **MembershipPlan** to one (optional) **Club** with a specific price.
- A **MembershipPlan** is a template that can be sold via many **Offers**.
- A **MembershipPlan** is composed of many **Features** (and a **Feature** can be in many plans).
