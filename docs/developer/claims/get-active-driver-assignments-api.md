---
id: get-active-driver-assignments-api
title: Get Active Driver Assignments
sidebar_label: Get Active Driver Assignments
---

# Get Active Driver Assignments API

This API endpoint retrieves a list of active driver assignments. It fetches trip and driver details for assignments that are not in a completed status (specifically excluding 'delivery closed', 'order closed', and 'cancelled').

## Endpoint

```http
GET /driverassignment/active/{userId}/{authKey}
```

## Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | The ID of the authenticated user making the request. |
| `authKey` | `String` | The authentication key for the user, used for validation. |

## Request

**Method**: `GET`
**Content-Type**: N/A

_No request body is required._

## Response

**Content-Type**: `text/plain` (returns a JSON string)

The response is a JSON object containing a `data` array with the active driver assignments.

### Response Schema

```json
{
  "data": [
    {
      "trip_id": "string",
      "driver_name": "string",
      "truckNo": "string"
    }
  ]
}
```

### Key Response Fields

#### `data` Array Items

| Field | Type | Description |
| :--- | :--- | :--- |
| `trip_id` | `String` | The unique identifier for the trip. |
| `driver_name` | `String` | The name of the assigned driver. |
| `truckNo` | `String` | The truck number assigned to the trip. |

## Errors

| Status Code | Description |
| :--- | :--- |
| `401 Unauthorized` | Returned if the `userId` and `authKey` combination is invalid or missing. |

## Notes

- This API specifically filters out driver assignments where the status is `STATUS_DELIVERY_CLOSED`, `STATUS_JOB_CLOSED`, or `STATUS_CANCELLED`.
