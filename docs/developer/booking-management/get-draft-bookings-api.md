---
sidebar_position: 6
---

# Get Draft Bookings

The `getDraftBookings` API endpoint is used to retrieve a list of all current unassigned, incomplete, or otherwise unconfirmed bookings stored with a status of `Draft`. This API natively scopes the query to return only draft bookings created by the provided `userId` parameter. The primary data model returned by this API is `BookingDetails.java` represented comprehensively as JSON.

### Endpoint

`GET /rest/booking/getDraftBookings/{userId}/{authKey}`

### Path Parameters

| Parameter | Type   | Description                                                                              | Required |
|-----------|--------|------------------------------------------------------------------------------------------|----------|
| `userId`  | String | The active username. This acts as both an authentication credential and a filter applied to the drafted list. | Yes      |
| `authKey` | String | A valid Authorization token for this user, required to ensure identity execution checks. | Yes      |

### Response

The response is a JSON array of `BookingDetails` models without any class wrapper (exclusions applied via `SpecificClassExclusionStrategy`).

**Success Response (200 OK):**
```json
[
  {
    "bookingID": "TICKET100802",
    "customerName": "Acme Corp",
    "refNo": "BO-12293-122",
    "status": "Draft",
    "orderType": "SHIPMENT",
    "pickupAddress": [
      {
         "addressId": "ADD89",
         "city": "Chennai",
         "country": 105
      }
    ],
    "deliveryAddress": [
      {
         "addressId": "ADD90",
         "city": "Bengaluru",
         "country": 105
      }
    ],
    "truckRequirements": [
      {
         "truckType": "Semi-Trailer",
         "truckTonnage": "12T"
      }
    ]
  }
]
```

**Unauthorized (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Internal Server Error (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Business Logic

1. **Authentication Strategy**: 
   Every request must first pass `checkIfAuthKeyIsValid()` to ensure the user credential matching tenant parameters is legitimate. If not, the request rejects gracefully with `401 Unauthorized`.

2. **Database Querying Flow**: 
   The service layer (`BookingService.java`) queries the backend using Hibernate `Criteria` restricted exclusively to `Restrictions.eq("status", TmsConstants.STATUS_DRAFT)`. Furthermore, if the `userId` parameter evaluates to valid string, the criteria builder is chained with `Restrictions.eq("bookedBy", userId)` guaranteeing isolation of an individual users' drafts.

3. **Data Serialization Restrictions**:
   Gson builder parses the raw List of `BookingDetails` returned by database into JSON formats. By leveraging `SpecificClassExclusionStrategy()`, properties deemed unsuitable (like circularly dependent tables or deeply nested mappings) are automatically detached to ensure lightweight responses.
