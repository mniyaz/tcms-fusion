---
id: get-trips-for-driver-api
title: Get Trips For Driver / Vendor
sidebar_label: Get Trips For Driver
---

# Get Trips For Driver API

This API endpoint retrieves the list of assigned trips for a specific driver or vendor driver. It provides detailed, segregated information per trip, including pickup and delivery addresses, assigned manpower, and the driver's job acceptance status.

## Endpoints

### 1. Company Driver Trips

Retrieves trips assigned to a standard company driver.

```http
GET /getTripsForDriver/{driverId}/{authKey}
```

**Path Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `driverId` | `String` | The unique identifier (username/email/ID) of the driver. |
| `authKey` | `String` | The authentication key for the user, used for validation. |

### 2. Vendor Driver Trips

Retrieves trips assigned to a vendor driver.

```http
GET /getripsForVendorDriver/{userId}/{password}
```

**Path Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | The unique identifier of the vendor driver. |
| `password` | `String` | The authentication password/key for the vendor. |

## Query Parameters (Pagination)

Both endpoints support optional query parameters for pagination, allowing for more efficient loading of large trip lists.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `offset` | `Integer` | The starting index of the trips to return (0-indexed). Example: `0`. |
| `limit` | `Integer` | The maximum number of trips to return in this request. Example: `10`. |

*Note: If `offset` and `limit` are omitted, the API will return all assigned trips at once.*

## Request

**Method**: `GET`
**Content-Type**: N/A

_No request body is required._

## Response

**Content-Type**: `application/json`

The response is a JSON object containing the `totalCount` of available trips and a `trips` array, where each object represents a fully segregated trip with its specific details.

### Response Schema

```json
{
  "totalCount": 42,
  "trips": [
    {
      "tripId": "TRP-20231024-001",
      "driverAcceptedJob": true,
      "driverAcceptedTime": "2023-10-24 08:30:00.0",
      "status": "1",
      "result": [
        {
          "id": 105,
          "state": 12,
          "stateName": "Selangor",
          "city": "Klang",
          "address": "123 Port Road",
          "delivered": false,
          "goodDescription": [
            {
              "shipRefNo": "DO-9921",
              "pieces": 50,
              "weight": 500.0
            }
          ]
        }
      ],
      "manpower": [
        {
          "id": 12,
          "name": "John Helper",
          "role": "Loader"
        }
      ]
    }
  ]
}
```

### Key Response Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `totalCount` | `Integer` | The total number of open/assigned trips available for the driver, regardless of current pagination limits. Useful for determining if there are more pages to load. |
| `trips` | `Array` | An array containing individual trip objects. |

#### Trip Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `tripId` | `String` | The unique identifier for the trip planner. |
| `driverAcceptedJob` | `Boolean` | Indicates whether the driver has acknowledged/accepted this specific trip. |
| `driverAcceptedTime` | `String`\|`null` | The timestamp when the driver accepted the trip. Null if not yet accepted. |
| `status` | `String` | Status flag for the trip object (always returns "1" for success). |
| `result` | `Array` | A list of address objects (Pickups, Deliveries, etc.) associated *only* with this specific trip. Includes cached `stateName` strings and goods descriptions. |
| `manpower` | `Array` | A list of manpower/helpers assigned *only* to this specific trip. |

## Notes

- **Optimized Batch Fetching**: The API internally uses `getBatchBookingDetailsListForTrips` to fetch all trip details within a single database transaction, completely preventing N+1 query bottlenecks.
- **State Caching**: Location Lookups (converting a State ID to its String name) are cached dynamically during processing to prevent redundant database queries.
- **Segregated Data**: Unlike legacy endpoints, the `result` (addresses) and `manpower` arrays are strictly grouped inside their respective `tripId` object, rather than being flattened at the root level.
- **Filtering**: These endpoints exclusively return actively assigned trips. Bookings with statuses `CANCELLED` or `JOB_CLOSED` are safely filtered out.
