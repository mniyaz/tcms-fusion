---
id: webhook-orders-ingest-api
title: Webhook Order Ingest
sidebar_label: Webhook order ingest
sidebar_position: 2
---

# Webhook order ingest API

Use this endpoint to **inject new delivery orders** into Route Planning without uploading an Excel file. Each successful call creates or updates a **planning session** and stores stops in the staging tables used by the `/route-planning` wizard and server-side HERE optimization.

## Endpoint

| | |
| :--- | :--- |
| **Method** | `POST` |
| **URL** | `{context}/rest/route-planning/webhook/orders` |
| **Content-Type** | `application/json` |
| **Auth** | HMAC signature headers (not `username` / `authKey`) |

**Source:** `RoutePlanningWebhookAPI.java` → `@Path("route-planning/webhook")` + `@Path("/orders")`

### Example URL

```
POST https://{host}/transportsupplyproject/rest/route-planning/webhook/orders
```

Adjust the context path to match your Tomcat deployment.

---

## Required headers

| Header | Required | Description |
| :--- | :---: | :--- |
| `Content-Type` | Yes | Must be `application/json` |
| `X-Tenant-Id` | Yes | Tenant schema identifier (same value used elsewhere in TCMS multi-tenant routing) |
| `X-Signature` | Yes | HMAC-SHA256 hex digest of the **raw request body** (optional prefix `sha256=`) |
| `X-Idempotency-Key` | Yes | Unique key per tenant for this delivery attempt. Replays with the same key return **409** |

### Signature algorithm

1. Read the **exact raw JSON bytes** of the request body (no re-formatting before signing).
2. Compute `HMAC-SHA256(secret, rawBody)`.
3. Send the lowercase hex digest in `X-Signature`, optionally prefixed with `sha256=`.

**Secret resolution order** (first match wins):

1. JVM system property `routeplanning.webhook.secret.{tenantId}`
2. Environment variable derived from that property name (dots → underscores, uppercased)
3. JVM system property `routeplanning.webhook.secret`
4. Environment variable `ROUTEPLANNING_WEBHOOK_SECRET`

If no secret is configured, the API returns **`RP_INGEST_001`** (401).

#### Bash example (OpenSSL)

```bash
TENANT_ID="your-tenant-id"
SECRET="your-webhook-secret"
IDEMPOTENCY_KEY="$(uuidgen)"
BODY_FILE="./orders-payload.json"

SIGNATURE=$(openssl dgst -sha256 -hmac "$SECRET" "$BODY_FILE" | awk '{print $2}')

curl -sS -X POST "https://{host}/transportsupplyproject/rest/route-planning/webhook/orders" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-Idempotency-Key: ${IDEMPOTENCY_KEY}" \
  -H "X-Signature: sha256=${SIGNATURE}" \
  --data-binary "@${BODY_FILE}"
```

#### Python example

```python
import hashlib
import hmac
import json
import uuid
import requests

tenant_id = "your-tenant-id"
secret = "your-webhook-secret"
url = "https://{host}/transportsupplyproject/rest/route-planning/webhook/orders"

payload = {
    "planningDate": "2026-06-12",
    "planningTimezone": "Asia/Kuala_Lumpur",
    "orders": [
        {
            "externalOrderId": "SO-1001",
            "address": "12 Jalan Ampang",
            "city": "Kuala Lumpur",
            "state": "Wilayah Persekutuan",
            "serviceTimeMinutes": 15,
            "weightKg": 120,
            "lat": 3.1578,
            "lng": 101.712,
        }
    ],
}

raw_body = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
signature = hmac.new(
    secret.encode("utf-8"),
    raw_body.encode("utf-8"),
    hashlib.sha256,
).hexdigest()

response = requests.post(
    url,
    data=raw_body.encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "X-Tenant-Id": tenant_id,
        "X-Idempotency-Key": str(uuid.uuid4()),
        "X-Signature": f"sha256={signature}",
    },
    timeout=60,
)
print(response.status_code, response.text)
```

:::warning Sign the raw body
If your HTTP client pretty-prints JSON before sending, the signature must be computed on **those exact bytes**. Whitespace or key-order changes will fail verification.
:::

---

## Request body

Top-level JSON object:

| Field | Required | Description |
| :--- | :---: | :--- |
| `planningDate` | **Yes** | Service date for the run, format `YYYY-MM-DD` |
| `planningTimezone` | No | IANA timezone id (for example `Asia/Kuala_Lumpur`) |
| `sessionId` | No | Existing planning session UUID. When set, **new orders are appended** to that session. When omitted, a **new session** is created and stops **replace** any prior stops on that new session |
| `customerId` | No | TCMS customer id applied when row-level customer is missing |
| `customerName` | No | TCMS customer name (or `ID-Name` format) |
| `depot` | No | Pickup / route start (see [Pickup at ingest](#pickup--route-start-at-ingest)) |
| `pickupLocation` | No | Alias for `depot` — same object shape |
| `pickup` | No | Alias for `depot` — same object shape |
| `orders` | **Yes** | Non-empty array of order objects (see below) |

### Pickup / route start at ingest

Send pickup with the webhook so operators **do not** pick route start manually on Location review. The server stores:

- `depot_json` on the session (used for TCMS **booking pickup address** — real address from ingest, not dummy defaults)
- `route_setup_json` with `depot` + `returnToDepot: true` (wizard skips Route setup when coords are valid)

| Depot field | Description |
| :--- | :--- |
| `name` | Label shown in wizard and on booking pickup |
| `address` | Street line (maps to booking `addressLineOne`) |
| `city`, `state`, `pincode` | Address components |
| `lat`, `lng` | **Required** for route start / HERE (with valid address text for bookings) |
| `sourceOrderId` | Optional — matches `externalOrderId` on one row in `orders[]`; server sets `sourceStopId` so **Set as start** is pre-selected on that stop in Location review |
| `sourceStopId` | Optional — explicit planning stop id when already known |

**Three integration patterns:**

1. **Standalone depot** — `depot` object only (not duplicated in `orders`). Route start is set; no table row highlighted.
2. **Pickup as an order row** — include the warehouse row in `orders[]` and set `depot.sourceOrderId` to the same `externalOrderId`. Location review shows **Set as start** on that row.
3. **`pickupLocation` alias** — same as `depot`; useful when ERP exports `pickupLocation` instead of `depot`.

**Excel / CSV upload (same behaviour):**

- Multipart field `depotJson` — JSON string with the same depot object shape.
- **Pickup row** in the file — set `orderNo` to `PICKUP` or `DEPOT`, or column `stopRole` = `pickup`. That row is **not** ingested as a delivery stop; it becomes session depot + route setup.

### Generate signed headers in Settings (no manual HMAC)

Operators can generate a **copy-paste developer kit** from TCMS Settings — endpoint URL, tenant id, webhook secret, signed headers, sample JSON, cURL, and Postman variables/script.

| UI | Path |
| :--- | :--- |
| **Legacy Settings** | **Settings → Route Planning Webhook** tab → **Generate signed developer kit** |
| **Light App** | **Settings → Route Planning Webhook** (`/lightapp/settings/route-planning-webhook`) |

**API** (authenticated with `username` / `authKey`, not webhook HMAC):

```
GET  {context}/rest/route-planning/webhook/developer-kit?username=…&authKey=…
POST {context}/rest/route-planning/webhook/developer-kit/sign?username=…&authKey=…
     Body: { "body": "{ … raw JSON … }" }
```

The server signs using the same secret resolution as production webhooks. Share the generated blocks with your integration team or paste Postman variables into the demo collection below.

### Postman demo collection

Import this collection to try all three webhook patterns (HMAC signing is automatic):

**File:** [`/postman/Route-Planning-Webhook-Demo.postman_collection.json`](/postman/Route-Planning-Webhook-Demo.postman_collection.json) (also in repo `static/postman/`)

| Collection variable | Example |
| :--- | :--- |
| `baseUrl` | `https://your-host:8443` |
| `contextPath` | `transportsupplyproject` |
| `tenantId` | Your tenant schema id |
| `webhookSecret` | Same value as `routeplanning.webhook.secret` on server |

Sample JSON bodies (download from site root `/samples/` or repo `static/samples/`):

| File | Pattern |
| :--- | :--- |
| `webhook-demo-1-standalone-depot.json` | Standalone `depot` + 3 deliveries |
| `webhook-demo-2-pickup-order-row.json` | `depot.sourceOrderId` + `WH-START` row |
| `webhook-demo-3-pickup-location-alias.json` | `pickupLocation` + 3 deliveries |

**Demo steps after a 200 response:**

1. Note `sessionId` in the response JSON.
2. Open **Route planning → Session history → Open** (or Location review with that session).
3. Confirm route start is already configured (Route setup step skipped when depot is valid).
4. For Demo 2, confirm the pickup row shows **Set as start** selected.

### Order object fields

Each item in `orders[]` maps to one planning stop. Validation matches the Excel upload template (`OrderIngestMapper`).

| Field | Required | Notes |
| :--- | :---: | :--- |
| `externalOrderId` | **Yes** | Unique order reference in your system |
| `customerName` | No | Display name |
| `address` | Cond. | Street address. Required unless `lat` + `lng` are provided |
| `city` | Cond. | With `state`, satisfies address requirement when `address` is omitted |
| `state` | Cond. | State / province |
| `pincode` | No | Postal code |
| `lat` | Cond. | Latitude. With `lng`, satisfies location requirement |
| `lng` | Cond. | Longitude |
| `serviceTimeMinutes` | **Yes** | Must be &gt; 0 |
| `weightKg` | Cond. | Required if `volumeM3` is omitted |
| `volumeM3` | Cond. | Required if `weightKg` is omitted |
| `picName` | No | Contact name at stop |
| `picPhone` | No | Primary phone |
| `altPhone` | No | Secondary phone |
| `geofenceRadiusMeters` | No | Default 50; clamped 10–5000 |
| `timeWindowStart` | Cond. | Both start and end required if either is set (for example `08:00`) |
| `timeWindowEnd` | Cond. | Pair with `timeWindowStart` |
| `notes` | No | Free text |
| `hazmat` | No | Boolean, default `false` |
| `stackable` | No | Boolean, default `true` |
| `fragile` | No | Boolean, default `false` |

**Geocoding:** When `lat` and `lng` are supplied, the stop is stored with geocode status `CONFIRMED`. Address-only rows are stored as `PENDING` and can be resolved in the Location review step or via geocode APIs.

### Sample payload

```json
{
  "planningDate": "2026-06-12",
  "planningTimezone": "Asia/Kuala_Lumpur",
  "depot": {
    "name": "Main DC",
    "address": "Lot 7 Jalan Industri 1",
    "city": "Shah Alam",
    "state": "Selangor",
    "pincode": "40000",
    "lat": 3.0738,
    "lng": 101.5183
  },
  "orders": [
    {
      "externalOrderId": "SO-1001",
      "customerName": "Acme Trading Sdn Bhd",
      "address": "12 Jalan Ampang",
      "city": "Kuala Lumpur",
      "state": "Wilayah Persekutuan",
      "pincode": "50450",
      "lat": 3.1578,
      "lng": 101.712,
      "serviceTimeMinutes": 15,
      "weightKg": 120,
      "volumeM3": 1.2,
      "picName": "Ahmad Rizal",
      "picPhone": "+60123456789",
      "timeWindowStart": "08:00",
      "timeWindowEnd": "17:00",
      "notes": "Dock B — call on arrival"
    }
  ]
}
```

### Append to an existing session

Send the same structure with `sessionId` set to a session returned from a previous ingest:

```json
{
  "sessionId": "006b2128-22ae-40bb-969d-4c5a664d37d7",
  "planningDate": "2026-06-12",
  "orders": [
    {
      "externalOrderId": "SO-1003",
      "address": "5 Jalan Bukit Bintang",
      "city": "Kuala Lumpur",
      "state": "Wilayah Persekutuan",
      "serviceTimeMinutes": 10,
      "weightKg": 30,
      "lat": 3.147,
      "lng": 101.711
    }
  ]
}
```

The session must belong to the same tenant as `X-Tenant-Id`. Unknown `sessionId` → **`RP_SESSION_002`** (404).

---

## Successful response

**HTTP 200 OK**

```json
{
  "success": true,
  "sessionId": "006b2128-22ae-40bb-969d-4c5a664d37d7",
  "summary": {
    "acceptedCount": 2,
    "validCount": 2,
    "rejectedCount": 0,
    "invalidCount": 0,
    "rowCount": 2,
    "rejected": []
  }
}
```

| Field | Description |
| :--- | :--- |
| `sessionId` | Planning session to use in the wizard or follow-up REST calls |
| `summary.acceptedCount` | Orders stored as stops |
| `summary.rejected` | Per-row validation failures (empty when all rows pass) |

:::note Partial validation
If **every** order in the batch fails validation, the API returns **400** (`RP_INGEST_003`) and **no stops are saved**. If at least one order is valid, accepted stops are saved and rejected rows appear in `summary.rejected`.
:::

---

## Error responses

JSON error shape:

```json
{
  "success": false,
  "errorCode": "RP_INGEST_001",
  "message": "Human-readable detail"
}
```

| Code | HTTP | Typical cause |
| :--- | :---: | :--- |
| `RP_INGEST_001` | 401 | Missing/invalid tenant, signature, or webhook secret not configured |
| `RP_INGEST_002` | 409 | Duplicate `X-Idempotency-Key` — payload was already processed for this tenant |
| `RP_INGEST_003` | 400 | Missing `planningDate`, empty `orders`, no valid orders, or malformed body |
| `RP_SESSION_002` | 404 | `sessionId` not found for tenant |
| *(generic)* | 500 | Unexpected server failure (`RP_INGEST_003` message: webhook could not be processed) |

---

## Idempotency

- Store and reuse **`X-Idempotency-Key`** only when retrying the **same** logical delivery (network timeout, etc.).
- Use a **new** idempotency key for each distinct batch of orders.
- Duplicate keys are recorded in `route_planning_webhook_event` and rejected with **409** so orders are not double-ingested.

---

## After ingest — what happens next

1. **Session status** moves to **`INGESTED`** (source **`WEBHOOK`** on `route_planning_session`).
2. **Usage metrics** increment webhook order counts for the tenant.
3. **Operators** continue in the wizard (locations → fleet → optimize → **Assign to planner**). Session history should progress through **`OPTIMIZED`** and **`COMMITTED`** when those steps complete.
4. **Pickup at ingest:** when the payload includes `depot`, `pickupLocation`, or `pickup`, Location review opens with route start already set (and **Set as start** pre-selected when `sourceOrderId` matches an order row). Booking pickup uses the ingested address — not placeholder defaults.
5. **Open the session** in the UI:
   - Navigate to `/route-planning/location-review` with `sessionId` in router state or session storage, or
   - **Usage metrics & history → Session history** → **Open**.
6. **Integrators** can call authenticated session APIs (`username` + `authKey` query params):
   - `GET /rest/route-planning/sessions/{sessionId}/stops`
   - `PUT /rest/route-planning/sessions/{sessionId}` — depot / fleet JSON, or valid **status** transitions
   - `POST /rest/route-planning/sessions/{sessionId}/optimize` — server-side HERE run
   - `POST /rest/route-planning/sessions/{sessionId}/commit-to-planner` — assign when status is **`OPTIMIZED`** and server routes exist

---

## Server configuration checklist

Before calling production webhooks:

1. Apply route-planning DB migrations (`route_planning_session`, `route_planning_stop`, `route_planning_webhook_event`, …).
2. Set webhook secret for the tenant (see [Secret resolution](#signature-algorithm) above).
3. Enable Route Planning V2 for the tenant (`routePlanningV2Enabled` in feature access, or `routePlanningV2Enabled=true` in `routeplanning.properties` for local dev).
4. Configure `HERE_API_KEY` if you will use server-side optimization.

---

## Testing tips

- Use a fresh **`X-Idempotency-Key`** for each test batch.
- Verify signature against the **exact** byte sequence sent on the wire.
- Confirm **`X-Tenant-Id`** matches the tenant whose secret you configured.
- Check **Usage metrics → Webhook orders** or **Session history** in the Route Planning UI to confirm ingest.
- For duplicate-key behaviour, replay the same request with the same idempotency key and expect **409** / `RP_INGEST_002`.
