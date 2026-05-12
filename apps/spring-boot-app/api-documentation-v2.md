# Talos Gym API Documentation

This document outlines the REST APIs for the Club and Membership domains.

## Table of Contents
1. [Feature Endpoints](#feature-endpoints)
2. [Offer Endpoints](#offer-endpoints)
3. [Plan Endpoints](#plan-endpoints)
4. [Club Endpoints](#club-endpoints)

---

## Feature Endpoints

> Endpoints for managing membership features.
> Base Path: `/api/management/features`

### Create Feature
Creates a new membership feature.

- **Method:** `POST`
- **Endpoint:** `/api/management/features`

**Request Body:**
```json
{
  "name": "Pool Access",
  "description": "Unlimited access to the swimming pool"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Pool Access",
  "description": "Unlimited access to the swimming pool"
}
```

### Update Feature
Updates an existing membership feature.

- **Method:** `PUT`
- **Endpoint:** `/api/management/features/{featureId}`

**Parameters:**
|    Name   |    In    |   Type    |   Required   |    Description |
|------|----|------|----------|-------------|
| featureId | Path | Long | Yes | The ID of the feature to update |

**Request Body:**
```json
{
  "name": "Pool and Sauna Access",
  "description": "Unlimited access to the swimming pool and sauna"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Pool and Sauna Access",
  "description": "Unlimited access to the swimming pool and sauna"
}
```

### Get Feature By ID
Retrieves details of a specific feature.

- **Method:** `GET`
- **Endpoint:** `/api/management/features/{featureId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| featureId | Path | Long | Yes | The ID of the feature to retrieve |

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Pool Access",
  "description": "Unlimited access to the swimming pool"
}
```

### Get All Features
Retrieves a list of all membership features.

- **Method:** `GET`
- **Endpoint:** `/api/management/features`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Pool Access",
    "description": "Unlimited access to the swimming pool"
  },
  {
    "id": 2,
    "name": "24/7 Access",
    "description": "Round-the-clock gym access"
  }
]
```

### Delete Feature
Deletes a membership feature.

- **Method:** `DELETE`
- **Endpoint:** `/api/management/features/{featureId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| featureId | Path | Long | Yes | The ID of the feature to delete |

**Response (204 No Content)**

---

## Offer Endpoints

> Endpoints for managing membership offers.
> Base Path: `/api/management/offers`

### Create Offer
Creates a new membership offer.

- **Method:** `POST`
- **Endpoint:** `/api/management/offers`

**Request Body:**
```json
{
  "planId": 1,
  "clubId": 1,
  "price": 99.99
}
```

**Response (201 Created):**
```json
{
  "id": 100,
  "planId": 1,
  "planName": "Standard Plan",
  "clubId": 1,
  "clubName": "Downtown Gym",
  "price": 99.99,
  "currency": "USD"
}
```

### Update Offer
Updates the price of an existing membership offer.

- **Method:** `PUT`
- **Endpoint:** `/api/management/offers/{offerId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| offerId | Path | Long | Yes | The ID of the offer to update |

**Request Body:**
```json
{
  "newPrice": 149.99
}
```

**Response (200 OK):**
```json
{
  "id": 100,
  "planId": 1,
  "planName": "Standard Plan",
  "clubId": 1,
  "clubName": "Downtown Gym",
  "price": 149.99,
  "currency": "USD"
}
```

### Delete Offer
Deletes a membership offer.

- **Method:** `DELETE`
- **Endpoint:** `/api/management/offers/{offerId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| offerId | Path | Long | Yes | The ID of the offer to delete |

**Response (204 No Content)**

### Get Offers
Retrieves a list of offers, optionally filtered by club or global status.

- **Method:** `GET`
- **Endpoint:** `/api/management/offers`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| clubId | Query | Long | No | Filter offers by specific club ID |
| global | Query | Boolean | No | Filter offers by global status |

**Response (200 OK):**
```json
[
  {
    "id": 100,
    "planId": 1,
    "planName": "Standard Plan",
    "clubId": 1,
    "clubName": "Downtown Gym",
    "price": 149.99,
    "currency": "USD"
  }
]
```

---

## Plan Endpoints

> Endpoints for managing membership plans.
> Base Path: `/api/management/plans`

### Create Plan
Creates a new membership plan.

- **Method:** `POST`
- **Endpoint:** `/api/management/plans`

**Request Body:**
```json
{
  "name": "Standard Plan",
  "description": "Standard monthly membership",
  "durationInMonths": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Standard Plan",
  "isGlobal": false,
  "features": []
}
```

### Update Plan
Updates an existing membership plan.

- **Method:** `PUT`
- **Endpoint:** `/api/management/plans/{planId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| planId | Path | Long | Yes | The id of the plan to update |

**Request Body:**
```json
{
  "name": "Premium Plan",
  "isGlobal": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Premium Plan",
  "isGlobal": true,
  "features": [
    {
      "id": 1,
      "name": "Pool Access",
      "description": "Unlimited access to the swimming pool"
    }
  ]
}
```
### Delete Plan
Deletes a membership plan.

- **Method:** `DELETE`
- **Endpoint:** `/api/management/plans/{planId}`

**Parameters**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| planId | Path | Long | Yes | The id the plan to delete |

**Response (204 No Content)**


### Get All Plans
Retrieves a list of all membership plans.

- **Method:** `GET`
- **Endpoint:** `/api/management/plans`

**Parameters:**
| Name | In | Type | Required | Description | 
|------|----|------|----------|-------------| 
| global | Query | Boolean | No | Filter plans by global status (true for global plans only, false or omitted for all plans) |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Premium Plan",
    "isGlobal": true,
    "features": []
  }
]
```

### Set Features For Plan

Sets the features for a specific plan by replacing the existing set.

- **Method:** `PUT`
- **Endpoint:** `/api/management/plans/{planId}/features`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------| 
| planId | Path | Long | Yes | The ID of the plan |

**Request Body:**
```json
[1, 2, 3]
```

**Response (204 No Content)**

### Add Feature To Plan
Adds a feature to a specific plan.

- **Method:** `POST`
- **Endpoint:** `/api/management/plans/{planId}/features/{featureId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| planId | Path | Long | Yes | The id of the plan |
| featureId | Path | Long | Yes | The id of the feature to add |

**Response (204 No Content)**

### Remove Feature From Plan
Removes a feature from a specific plan.

- **Method:** `DELETE`
- **Endpoint:** `/api/management/plans/{planId}/features/{featureId}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| planId | Path | Long | Yes | The id of the plan |
| featureId | Path | Long | Yes | The id of the feature to remove |

**Response (204 No Content)**

---

## Club Endpoints

> Endpoints for retrieving club information.
> Base Path: `/api/clubs`

### Get Clubs
Retrieves a paginated list of clubs based on search criteria.

- **Method:** `GET`
- **Endpoint:** `/api/clubs`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------| 
| search | Query | String | No | General search term |
| city | Query | String | No | Filter by city |
| district | Query | String | No | Filter by district |
| active | Query | Boolean | No | Filter by active status | 
| page | Query | Integer | No | Page number (default: 0) |
| size | Query | Integer | No | Page size (default: 10) |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Main Gym",
      "slug": "main-gym",
      "address": {
        "city": "Anytown",
        "district": "Downtown",
        "postalCode": "12345",
        "fullAddress": "full address",
        "latitude" : "40.9928469",
        "longtitude": "29.0276210",
        "provider": "LOCATION_IQ",
        "externalLocationId": "N13383626286"
      },
      "timeZone": "America/New_York",
      "description": "A premier fitness center",
      "active": true,
      "scoreMultiplier": 1.0,
      "photoUrls": ["url1", "url2"],
      "operatingHours": [],
      "scheduleOverrides": []
    }
  ],
  "page": {
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0
  }
}

```

### Get Club By ID
Retrieves details of a specific club by its ID.

- **Method:** `GET`
- **Endpoint:** `/api/clubs/{id}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | Path | Long | Yes | Club ID |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Main Gym",
      "slug": "main-gym",
      "address": {
        "city": "Anytown",
        "district": "Downtown",
        "postalCode": "12345",
        "fullAddress": "full address",
        "latitude" : "40.9928469",
        "longtitude": "29.0276210",
        "provider": "LOCATION_IQ",
        "externalLocationId": "N13383626286"
      },
      "timeZone": "America/New_York",
      "description": "A premier fitness center",
      "active": true,
      "scoreMultiplier": 1.0,
      "photoUrls": ["url1", "url2"],
      "operatingHours": [],
      "scheduleOverrides": []
    }
  ],
  "page": {
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0
  }
}
```

### Get Club By Slug
Retrieves details of a specific club by its slug.

- **Method:** `GET`
- **Endpoint:** `/api/clubs/slug/{slug}`

**Parameters:**
| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| slug | Path | String | Yes | Club Slug |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Main Gym",
      "slug": "main-gym",
      "address": {
        "city": "Anytown",
        "district": "Downtown",
        "postalCode": "12345",
        "fullAddress": "full address",
        "latitude" : "40.9928469",
        "longtitude": "29.0276210",
        "provider": "LOCATION_IQ",
        "externalLocationId": "N13383626286"
      },
      "timeZone": "America/New_York",
      "description": "A premier fitness center",
      "active": true,
      "scoreMultiplier": 1.0,
      "photoUrls": ["url1", "url2"],
      "operatingHours": [],
      "scheduleOverrides": []
    }
  ],
  "page": {
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0
  }
}
```