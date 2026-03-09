---
id: delete-draft-bookings-api
title: Delete Draft Bookings API
sidebar_label: Delete Draft Bookings
---

# Delete Draft Bookings API

The Delete Draft Bookings API allows clients to logically delete a batch of draft bookings from the system by passing an array of Booking IDs (Reference Numbers).

When a booking is logically deleted, its status is updated to `PURGD`. This ensures that data integrity is maintained while the booking is removed from typical operation views.

## Endpoint

**Method:** `POST`

**URL:** `/rest/booking/deleteDraftBookings`

**Content-Type:** `application/json`

## Authentication

This API requires authentication via user credentials passed in the JSON body.

## Request Body

The request payload must be a JSON object containing the `username`, `authKey`, and a list of `bookingIds` to be logically deleted.

### Payload Schema

| Field        | Type            | Required | Description                                                         |
|--------------|-----------------|----------|---------------------------------------------------------------------|
| `username`   | String          | Yes      | The user ID requesting the deletion.                               |
| `authKey`    | String          | Yes      | The authentication key corresponding to the user.                  |
| `bookingIds` | Array of String | Yes      | A list of booking reference numbers (e.g., `"INV-1001"`) to delete. |

### Sample Request

```json
{
  "username": "adminUser",
  "authKey": "abc123xyz",
  "bookingIds": [
    "INV-1001",
    "INV-1002"
  ]
}
```

## Business Rules

1.  **Authentication & Authorization:** The system will validate the `username` and `authKey` against the current tenant.
2.  **Status Validation:** Only bookings that currently have a status of `"Draft"` (as defined by `TmsConstants.STATUS_DRAFT`) can be logically deleted.
3.  **Logical Deletion:** Valid records will have their status updated to `"PURGD"` (`TmsConstants.STATUS_PURGED`). The records are not physically removed from the database, preventing any foreign-key cascade issues on dependent records.
4.  **Bulk Operation:** This operates as a bulk update transaction. It will attempt to logically delete all provided IDs that meet the criteria.

## Response

The API returns a JSON object indicating the success or failure of the operation.

### Success Response

Returned when all requested bookings are successfully validated and logically deleted.

**HTTP Status:** `200 OK`

```json
{
  "success": true,
  "message": "Draft bookings deleted successfully"
}
```

### Partial or Failure Response

Returned if authentication fails, if any of the bookings cannot be found, or if any of the bookings have a status other than `"Draft"`.

**HTTP Status:** `400 Bad Request` or `401 Unauthorized`

```json
{
  "success": false,
  "message": "One or more bookings could not be deleted or were not drafts"
}
```

## Internal Implementation Details

*   **Controller Method:** `BookingController.deleteDraftBookings` handles parsing the JSON request, validating credentials, and sending the parsed list of IDs to the service layer.
*   **Service Method:** `BookingService.deleteDraftBookings` iterates through the provided IDs, loads the `BookingDetails` object from the Hibernate session, validates its status, updates the status to `PURGD`, and commits the transaction using `SafeSqlExecutor`.
