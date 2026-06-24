---
id: error-codes
title: Route Planning error codes
sidebar_label: Error codes
sidebar_position: 4
---

# Route Planning error codes

Stable codes returned in JSON error responses as **`errorCode`** (HTTP status varies).

```json
{
  "success": false,
  "errorCode": "RP_INGEST_003",
  "message": "Human-readable detail"
}
```

Full reference in the TCMS repo: `docs/developer/route-planning/ERROR_CODES.md`.

---

## Ingest and upload

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_INGEST_001` | 401 | Webhook authentication failed |
| `RP_INGEST_002` | 409 | Duplicate `X-Idempotency-Key` |
| `RP_INGEST_003` | 400 | Invalid webhook payload or upload parse error |
| `RP_UPLOAD_001` | 400/500 | Excel/CSV upload failed |

---

## Session {#session}

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_SESSION_001` | 409 | Invalid session status transition |
| `RP_SESSION_002` | 404/500 | Session not found or update failed |

### PUT `/sessions/{id}` — status field

Optional `"status"` in the request body advances the session when the transition is allowed (same rules as `RoutePlanningSessionTransitionValidator`).

**Set automatically by server:**

- `POST …/optimize` → `OPTIMIZING`, then `OPTIMIZED` or `OPTIMIZATION_FAILED`
- `POST …/commit-to-planner` → `COMMITTED` on success

**Set by wizard via PUT:**

- Browser HERE optimize lifecycle
- **Assign to planner** after legacy planner save (browser-optimized routes)

Integrators must chain valid transitions; skipping steps returns **`RP_SESSION_001`**.

---

## Optimization

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_OPT_004` | 503 | HERE API key not configured on server |
| `RP_EXPORT_003` | 409 | Session not optimized (export / assignment payload) |

---

## Assign to planner (commit)

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_COMMIT_001` | 400/500 | Planner trip creation failed |
| `RP_COMMIT_002` | 409 | Session not **`OPTIMIZED`** — run optimization first |
| `RP_COMMIT_003` | 404 | No optimized routes on server for commit |
| `RP_COMMIT_004` | 400 | Missing truck assignment for a route |
| `RP_COMMIT_005` | 400 | Missing driver (name or IC) for a route |
| `RP_COMMIT_007` | 409 | Partial commit — some routes skipped |
| `RP_COMMIT_008` | 409 | Session already **`COMMITTED`** — duplicate assign blocked |

### POST `/sessions/{id}/commit-to-planner`

Creates one Planner trip per optimized route using **`PlannerService.savePlan`**. Requires server-stored optimization result and status **`OPTIMIZED`**.

When routes exist only in the browser HERE snapshot, the wizard uses the legacy planner save API and advances status to **`COMMITTED`** via **`PUT /sessions/{id}`** — operators still use **Assign to planner** only.

---

## Dispatch

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_DISPATCH_006` | 400 | Invalid callback URL (non-HTTPS, private IP, etc.) |

---

## Retry

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_RETRY_001` | 409 | Retry not allowed for current session state |

Use `POST …/optimize/retry` only when status is **`OPTIMIZATION_FAILED`**.

---

## Live tracking

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_TRACK_001` | 500 | Live routes or GPS trail query failed |
| `RP_TRACK_002` | 404 / 400 | Route not found, invalid route id, or session not optimized/committed/exported |

See [Live route tracking API](./live-route-tracking-api).

---

## Health

| Code | HTTP | Meaning |
| :--- | :---: | :--- |
| `RP_HEALTH_001` | 503 | Route planning DB migration missing |
| `RP_HEALTH_002` | 503 | HERE API key not configured |

---

## Related

- [Live route tracking API](./live-route-tracking-api)
- [Session lifecycle & status sync](./session-lifecycle)
- [Webhook order ingest](./webhook-orders-ingest-api)
