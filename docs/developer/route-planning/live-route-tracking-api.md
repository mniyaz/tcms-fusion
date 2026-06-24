---
id: live-route-tracking-api
title: Live route tracking API
sidebar_label: Live tracking API
sidebar_position: 5
---

# Live route tracking API

Enterprise live view for **route-planning optimized routes**: planned geometry, driver GPS overlay, deviation classification, per-stop operational status (swipe in/out, POD), and GPS breadcrumb trails.

**Backend:** `RoutePlanningAPI.java` → `RoutePlanningLiveTrackingService`, `RoutePlanningDriverLocationQueryService`, `RoutePlanningStopOperationalService`

**Frontend:** `TCMSBookingWebApp/src/modules/routePlanning/screens/LiveRouteTrackingPage.jsx`

**UI path:** `/lightapp/route-planning/live-tracking`

---

## Authentication

Same as other route-planning session APIs:

```
GET {context}/rest/route-planning/live-routes?planningDate=yyyy-MM-dd&username=…&authKey=…
```

Tenant is resolved from the servlet context (host key), not from a webhook header.

---

## Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| GET | `/live-routes` | All trackable routes for a planning date + summary + driver locations |
| GET | `/live-routes/routes/{routeId}/trail` | GPS breadcrumb trail and deviation analysis for one route |

### Query parameters

| Parameter | Endpoints | Description |
| :--- | :--- | :--- |
| `planningDate` | Both | `yyyy-MM-dd` (preferred) |
| `date` | Both | Alias for `planningDate` |
| `limit` | Trail only | Max GPS points returned (optional) |
| `username`, `authKey` | Both | TCMS auth query params |

---

## GET `/live-routes`

### Session filter

Includes `route_planning_session` rows where:

- `status` ∈ **`OPTIMIZED`**, **`COMMITTED`**, **`EXPORTED`**
- `planning_date` falls on the requested calendar day **or** (`planning_date` is null and `updated_at` falls on that day)

Routes are loaded from `route_planning_route` / `route_planning_route_stop` with fallback to the latest successful optimization run JSON when route rows are missing.

### Response shape (success)

```json
{
  "success": true,
  "data": {
    "planningDate": "2026-06-24",
    "summary": {
      "totalRoutes": 2,
      "onRoute": 1,
      "atRisk": 0,
      "offRoute": 0,
      "noSignal": 1,
      "idle": 0
    },
    "sessions": [
      {
        "sessionId": "uuid",
        "status": "COMMITTED",
        "source": "WEBHOOK",
        "customerName": "Acme Trading",
        "stopCount": 8,
        "routeCount": 2
      }
    ],
    "routes": [
      {
        "sessionId": "uuid",
        "routeId": "12345",
        "routeIndex": 1,
        "routeLabel": "Route 1",
        "customerName": "Acme Trading",
        "cargoSummary": "120.0 kg",
        "truckNumber": "WXY 1234",
        "driverName": "Ahmad",
        "driverPhone": "+60123456789",
        "tripId": "TRIP-…",
        "bookingIds": ["BK-…"],
        "polyline": "[{\"lat\":3.1,\"lng\":101.7},…]",
        "depotLat": 3.07,
        "depotLng": 101.52,
        "depotName": "Main DC",
        "stops": [
          {
            "stopId": "99",
            "sequence": 1,
            "lat": 3.15,
            "lng": 101.71,
            "customerName": "Stop customer",
            "externalOrderId": "SO-1001",
            "bookingId": "BK-…",
            "addressLineOne": "12 Jalan …",
            "city": "Kuala Lumpur",
            "goodsDescription": "Cartons",
            "stopType": "DELIVERY",
            "operationalStatus": "ARRIVED",
            "swipeInAt": "2026-06-24T09:15:00",
            "swipeOutAt": null,
            "proofUploaded": false,
            "proofCount": 0,
            "deliveryId": 45678,
            "proofs": []
          }
        ],
        "driverLocation": {
          "lat": 3.14,
          "lng": 101.69,
          "trackingStatus": "ON_ROUTE",
          "deviationMeters": 42.5,
          "lastSeenTime": "2026-06-24T10:30:00",
          "speedKmh": 35.0,
          "heading": 180
        }
      }
    ]
  }
}
```

### Driver location matching

GPS rows come from `plannermanager` joined to latest `driver_location_details`, keyed by route `bookingIds`, then fallback match on **truck number** and **driver name**.

Trip / driver phone enrichment uses `route_planning_commit_log.created_trips_json` and `plannermanager` when assign-to-planner has run.

### Tracking status thresholds

Computed as perpendicular distance from latest GPS point to the planned polyline:

| Status | Condition |
| :--- | :--- |
| `ON_ROUTE` | &lt; 150 m |
| `AT_RISK` | 150 m – 500 m |
| `OFF_ROUTE` | ≥ 500 m |
| `NO_SIGNAL` | No GPS match |
| `IDLE` | GPS present but classified idle (low movement) |

### Stop operational enrichment

`RoutePlanningStopOperationalService` links each delivery stop to `order_deliveryaddress` by:

1. `BOOKING_ID` + `ADDRESS_ID` = `externalOrderId`, **or**
2. `REMARKS` JSON field `externalOrderId` (set at commit), **or**
3. Sequence order within the booking

Then reads `DELIVERY_IN_TIME`, `DELIVERY_OUT_TIME`, `DELIVERED`, `POD_UPLOADED`, and POD rows from `podmanager`.

| `operationalStatus` | Rule |
| :--- | :--- |
| `PENDING` | No swipe in |
| `ARRIVED` | `DELIVERY_IN_TIME` set |
| `DEPARTED` | `DELIVERY_OUT_TIME` set |
| `COMPLETED` | Delivered or POD uploaded |

:::note No new migration for live tracking
Operational fields are **computed at read time**. There is no `delivery_id` column on `route_planning_route_stop` yet — matching uses existing TCMS delivery rows.
:::

### POD image URLs (UI)

The Booking Web App builds image links as:

```
{baseURL}/DisplayImage?Image_id={FILE_PATH from podmanager}
```

---

## GET `/live-routes/routes/{routeId}/trail`

Returns chronological GPS points for the route’s bookings on the planning date, with per-point deviation from the planned polyline and roll-up analysis.

### Response fields

| Field | Description |
| :--- | :--- |
| `points[]` | `lat`, `lng`, `recordedAt`, `deviationMeters`, `offRoute`, `atRisk` |
| `analysis` | `totalPoints`, `offRoutePoints`, `maxDeviationMeters`, `averageDeviationMeters`, `distanceTraveledMeters`, `offRouteDistanceMeters` |
| `segments` (client) | UI splits `fullPath` into on-route (amber) and off-route (red) polylines |

`routeId` is the numeric primary key of `route_planning_route.id` (string in JSON).

---

## Error codes

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_TRACK_001` | 500 | Live routes or trail query failed unexpectedly |
| `RP_TRACK_002` | 404 / 400 | Route not found, invalid id, or session not in a trackable status |

See [Error codes](./error-codes).

---

## Frontend behaviour (reference)

| Concern | Implementation |
| :--- | :--- |
| Auto refresh | 30 s interval; updates `liveDrivers` only — planned geometry kept stable via `sameRouteGeometry` |
| Map viewport | Initial fit on load; locked after user pan/zoom; not reset on refresh |
| Collapsible panels | Stats, routes list, details, replay, legend — toolbar always visible |
| Polyline storage | `routePolylineCodec.js` — JSON array or encoded flex polyline in `route_planning_route.polyline` |

---

## Operational prerequisites

| Requirement | Why |
| :--- | :--- |
| Session **OPTIMIZED** or **COMMITTED** | `TRACKABLE_STATUSES` filter |
| `route_planning_route` rows (or optimization JSON fallback) | Planned map geometry |
| `booking_id` on stops | Links to TCMS bookings and GPS |
| **Assign to planner** (for live GPS) | Creates `plannermanager` trips drivers track against |
| Mobile GPS reporting | `driver_location_details` history for trail and live marker |
| Swipe / POD on mobile | Populates `order_deliveryaddress` and `podmanager` |

---

## Related

- [Live route tracking (operators)](/docs/route-planning/live-route-tracking)
- [End-to-end flow](/docs/route-planning/end-to-end-flow)
- [Session lifecycle](./session-lifecycle)
