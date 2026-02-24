---
id: get-live-status-api
title: Get Live Status
sidebar_label: Get Live Status
---

# Get Live Status API

This API endpoint retrieves the live status of bookings, optimized for the Master Dashboard. It provides a comprehensive overview of booking details, pickup/delivery addresses, truck requirements, goods descriptions, and live tracking information.

## Endpoint

```http
GET /getLiveStatus/{officeBranch}/{userName}/{authKey}
```

## Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `officeBranch` | `String` | The office branch code or identifier. |
| `userName` | `String` | The username of the authenticated user making the request. |
| `authKey` | `String` | The authentication key for the user, used for validation. |

## Headers (Optional Filters)

This API supports optional header parameters to filter the results.

| Header | Type | Description |
| :--- | :--- | :--- |
| `customerId` | `String` | Comma-separated list of Customer IDs to filter the bookings by specific customers. |
| `userId` | `String` | Comma-separated list of User IDs (booked by) to filter the bookings created by specific users. |

## Request

**Method**: `GET`
**Content-Type**: N/A

_No request body is required._

## Response

**Content-Type**: `text/plain` (returns a JSON string)

The response is a JSON object containing two main properties: `data` (the list of bookings) and `statusCounts` (an aggregation of booking statuses).

### Response Schema

```json
{
  "data": [
    {
      "bookingID": "string",
      "bookedDate": "string",
      "custRefNumber": "string",
      "customer": "string",
      "customerId": "string",
      "status": "string",
      "requestorPhone": "string",
      "pickup": "string",
      "delivery": "string",
      "dropPoints": "string",
      "doNumbers": "string",
      "coNumber": "string",
      "goodsDescriptionText": "string",
      "pikcupTime": "string",
      "deliveryTime": "string",
      "tonnage": "string",
      "equipments": "string",
      "manpower": "string",
      "truck": "string",
      "driver": "string",
      "vendor": "string",
      "agreedPrice": "string",
      "tripID": "string",
      "gpsTrackingUrl": "string",
      "userId": "string",
      "deliveryAddress": [ ... ],
      "pickupAddress": [ ... ],
      "invoiceNumber": "string",
      "invoiceStatus": "string",
      "invoiceDate": "string",
      "invoiceAmount": 0.0
    }
  ],
  "statusCounts": {
    "Booked": 5,
    "Assigned": 2,
    "Delivery in progress": 10
  }
}
```

### Key Response Fields

#### `data` Array Items

| Field | Type | Description |
| :--- | :--- | :--- |
| `bookingID` | `String` | The unique identifier for the booking. |
| `bookedDate` | `String` | The date the booking was created. |
| `custRefNumber` | `String` | The customer's reference number. |
| `customer` | `String` | The name of the customer. |
| `customerId` | `String` | The ID of the customer. |
| `status` | `String` | The current status of the booking (e.g., "Booked", "Assigned", "delivery closed"). |
| `pickup` | `String` | Comma-separated list of pickup cities. |
| `delivery` | `String` | The first delivery city. |
| `dropPoints` | `String` | Comma-separated list of all delivery cities. |
| `doNumbers` | `String` | Comma-separated list of Delivery Order (DO) numbers/Ship Reference Numbers associated with the goods. |
| `coNumber` | `String` | Comma-separated list of Container/CO numbers associated with the goods. |
| `goodsDescriptionText` | `String` | Comma-separated list of goods descriptions. |
| `gpsTrackingUrl` | `String` | The URL for live GPS tracking of the assigned driver. |
| `userId` | `String` | The name of the employee who created the booking. |

#### `statusCounts` Object

A key-value map where the key is the `status` string (e.g., "Booked", "Assigned") and the value is the integer count of bookings currently in that status based on the retrieved data set.

## Errors

| Status Code | Description |
| :--- | :--- |
| `401 Unauthorized` | Returned if the `userName` and `authKey` combination is invalid or missing. |

## Notes

- The API uses `GROUP_CONCAT` extensively in the underlying SQL to aggregate child entities (like multiple pickup/delivery points, goods descriptions, and truck requirements) into single, comma-separated strings for optimized performance.
- The `coNumber` field was recently added to complement the existing `doNumbers` functionality.
- The optional `customerId` and `userId` headers allow for dynamic filtering of the dashboard results based on the logged-in user's context or selected filters in the UI.
