---
id: intro
title: Route Planning (Developer)
sidebar_position: 1
---

# Route Planning — Developer Overview

The **Route Planning V2** module lets dispatchers ingest delivery orders, review locations, configure fleet, run HERE route optimization, and export or commit plans. Integrations can push orders programmatically instead of using the Excel upload wizard.

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

## Typical integration flow

1. **Push orders** via webhook → receive `sessionId`.
2. **Open the wizard** in TCMS Booking Web App at `/route-planning/location-review` (or later steps) using that `sessionId`, or continue purely via REST (`GET/PUT` session, `POST …/optimize`, etc.).
3. **Monitor** sessions in the app under **Usage metrics & history → Session history**.

## Guides in this section

| Guide | Description |
| :--- | :--- |
| [End-to-end flow (beginner guide)](/route-planning/end-to-end-flow) | Plain-language wizard walkthrough for dispatchers |
| [Webhook order ingest](./webhook-orders-ingest-api) | Push new orders with HMAC authentication and idempotency |
| *(planned)* Session & optimize APIs | Read session, run HERE optimization, export, commit, dispatch |

:::tip Related TCMS repo docs
The application repository also ships internal runbooks under `docs/developer/route-planning/` (workflow diagram, error codes, rollout checklist, sample JSON payloads).
:::
