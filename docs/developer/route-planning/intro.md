---
id: intro
title: Route Planning (Developer)
sidebar_position: 1
---

# Route Planning — Developer Overview

The **Route Planning V2** module lets dispatchers ingest delivery orders, review locations, configure fleet, run HERE route optimization, and export or **assign plans to TCMS Planner**. Integrations can push orders programmatically instead of using the Excel upload wizard.

Operators use plain-language actions in the wizard (**Assign to planner**, **Export Route Plan**, **Send to Third Party**). Internal REST paths are documented here for integrators and backend work — not shown on dispatcher screens.

## API base path

All route-planning REST resources are mounted under:

```
{context}/rest/route-planning/
```

Replace `{context}` with your deployment prefix (for example `/transportsupplyproject` or `/tcms`).

| Concern | Detail |
| :--- | :--- |
| **Backend package** | `transportsupplyproject` → `in.greenorange.api.routeplanning.*` |
| **Primary ingest (integration)** | [Webhook order ingest](./webhook-orders-ingest-api) — `POST …/webhook/orders` |
| **Alternate ingest** | Multipart `POST …/upload` (Excel/CSV from the wizard UI) |
| **Tenant scope** | Webhook: `X-Tenant-Id` header. Session APIs: tenant from servlet context + `username` / `authKey` query params |
| **Database** | Staging tables `route_planning_session`, `route_planning_stop`, `route_planning_webhook_event`, … |
| **Frontend module** | `TCMSBookingWebApp/src/modules/routePlanning/` |
| **Session status sync** | `routePlanningSessionStatusSync.js` — wizard `PUT` transitions for browser optimize + legacy planner assign |

## Typical integration flow

1. **Push orders** via webhook → receive `sessionId` (status **`INGESTED`**).
2. **Open the wizard** in TCMS Booking Web App at `/route-planning/location-review` (or later steps) using that `sessionId`, or continue purely via REST (`GET/PUT` session, `POST …/optimize`, etc.).
3. **Optimize** — server `POST …/optimize` or browser HERE; session reaches **`OPTIMIZED`** (see [Session lifecycle](./session-lifecycle)).
4. **Assign to planner** — server `POST …/commit-to-planner` or legacy planner save + wizard status sync → **`COMMITTED`**.
5. **Monitor** sessions in the app under **Usage metrics & history → Session history**.

## REST API reference (high level)

| Method | Path | Description |
| :--- | :--- | :--- |
| POST | `/upload` | Multipart Excel/CSV ingest |
| POST | `/webhook/orders` | JSON webhook ingest |
| GET | `/sessions/{id}` | Session detail (includes `status`) |
| PUT | `/sessions/{id}` | Update depot, fleet, route setup, **status** (valid transitions only) |
| GET | `/sessions/{id}/stops` | List stops |
| GET | `/sessions/{id}/vehicles` | List vehicles |
| POST | `/sessions/{id}/optimize` | Server HERE optimization |
| POST | `/sessions/{id}/optimize/retry` | Retry after `OPTIMIZATION_FAILED` |
| GET | `/sessions/{id}/optimization-result` | Latest success result |
| GET | `/sessions/{id}/export/route-plan` | Route plan JSON |
| GET | `/sessions/{id}/export/load-plan` | Load plan JSON |
| POST | `/sessions/{id}/commit-to-planner` | Create Planner trips (requires server routes + `OPTIMIZED`) |
| POST | `/sessions/{id}/dispatch/export` | HTTPS webhook dispatch |
| GET | `/usage-metrics` | Daily usage rollup |
| GET | `/health` | Operator health snapshot |

Auth for session APIs: existing TCMS `username` + `authKey` query parameters.

## Assign to planner — two persistence paths

The wizard exposes one operator action (**Assign to planner**). Implementation:

| Route source | API on success | Session status |
| :--- | :--- | :--- |
| Server optimization result | `POST …/commit-to-planner` → `PlannerService.savePlan` + commit log | **`COMMITTED`** (backend) |
| Browser HERE snapshot only | `POST /rest/planner/savePlanV2` (legacy planner) + wizard `PUT …/sessions/{id}` | **`COMMITTED`** (wizard sync) |

Duplicate assign blocked when status is **`COMMITTED`** (`RP_COMMIT_008` on server path; UI disables assign on both optimization and assignment review).

## Guides in this section

| Guide | Description |
| :--- | :--- |
| [End-to-end flow (beginner guide)](/route-planning/end-to-end-flow) | Plain-language wizard walkthrough for dispatchers |
| [Webhook order ingest](./webhook-orders-ingest-api) | Push orders + **pickup at ingest**; HMAC signing, idempotency, Settings developer kit, Postman (3 demos) |
| [Session lifecycle & status sync](./session-lifecycle) | Status transitions, wizard sync, mermaid diagram |
| [Error codes](./error-codes) | Stable `RP_*` codes for ingest, session, optimize, commit, dispatch |

:::tip Related TCMS repo docs
The application repository also ships internal runbooks under `docs/developer/route-planning/` (full workflow, QA checklist, production rollout, sample JSON payloads).
:::
