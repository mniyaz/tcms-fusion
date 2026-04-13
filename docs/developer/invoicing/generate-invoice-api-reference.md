---
id: generate-invoice-api-reference
title: Generate Invoice API Reference
sidebar_label: Generate Invoice API
---

## Overview

JAX-RS resource **`GenerateInvoiceAPI`** (`@Path("generateinvoice")`). All operations are **`POST`** and accept a **raw JSON string** body (clients typically send `Content-Type: application/json`). Declared **`Produces`** is **`text/plain`**, but successful entities are **JSON strings** (parse as JSON).

| Concern | Detail |
| :--- | :--- |
| **Base path** | `/rest/generateinvoice` |
| **Full URL prefix** | `/rest/generateinvoice/{subpath}` |
| **Source** | `transportsupplyproject/src/in/greenorange/api/invoice/GenerateInvoiceAPI.java` |
| **Tenant** | `TmsUtil.getTenantIdFromServlet(request)` |
| **Auth** | Almost all methods call `TmsUtil.checkIfAuthKeyIsValid(userName, authKey, tenantId)` → **`401`** with `Access-Control-Allow-Origin: *` when invalid. |

### Common JSON fields

Many requests include **`userName`**, **`authKey`**, and **`branch`** (branch is often unused after parse but required by the API contract).

### CORS and save queue

- **Generate / view / update / print-JSON** success responses usually include **`Access-Control-Allow-Origin: *`**.
- **`saveSingleInvoice`**, **`saveBlankInvoice`**, **`saveSummaryInvoice`** return **`200`** with **`{"data":true|false}`** and **do not** add CORS on success (only **`401`** sets CORS in those methods).
- Save methods call **`Thread.sleep(200)`** before **`SaveInvoiceQueue.saveInvoice`** (`PodQueueObjectHelper`).

### Related documentation

- [Invoice Home API](./invoice-home-api-reference.md) — listings, PDF, acknowledgements/courier, etc.

---

## Detailed documentation (per endpoint)

| # | Endpoint | Guide |
| :---: | :--- | :--- |
| 1 | `POST generateSingleInvoice` | [generate-single-invoice-api.md](./generate-single-invoice-api.md) |
| 2 | `POST generateBlankInvoice` | [generate-blank-invoice-api.md](./generate-blank-invoice-api.md) |
| 3 | `POST generateSummaryInvoice` | [generate-summary-invoice-api.md](./generate-summary-invoice-api.md) |
| 4 | `POST saveSingleInvoice` | [save-single-invoice-api.md](./save-single-invoice-api.md) |
| 5 | `POST saveBlankInvoice` | [save-blank-invoice-api.md](./save-blank-invoice-api.md) |
| 6 | `POST saveSummaryInvoice` | [save-summary-invoice-api.md](./save-summary-invoice-api.md) |
| 7 | `POST viewSingleInvoice` | [view-single-invoice-api.md](./view-single-invoice-api.md) |
| 8 | `POST viewSummaryInvoice` | [view-summary-invoice-api.md](./view-summary-invoice-api.md) |
| 9 | `POST updateInvoice` | [update-invoice-api.md](./update-invoice-api.md) |
| 10 | `POST updateSummaryInvoice` | [update-summary-invoice-api.md](./update-summary-invoice-api.md) |
| 11 | `POST updateDraftToSummaryInvoice` | [update-draft-to-summary-invoice-api.md](./update-draft-to-summary-invoice-api.md) |
| 12 | `POST addBookingsToDraft` | [add-bookings-to-draft-api.md](./add-bookings-to-draft-api.md) |
| 13 | `POST getSummaryInvoiceAsGroup` | [get-summary-invoice-as-group-api.md](./get-summary-invoice-as-group-api.md) |
| 14 | `POST getSummaryInvoiceAsJson` | [get-summary-invoice-as-json-api.md](./get-summary-invoice-as-json-api.md) |
| 15 | `POST getSingleInvoiceAsJson` | [get-single-invoice-as-json-api.md](./get-single-invoice-as-json-api.md) |
| 16 | `POST getBlankInvoiceAsJson` | [get-blank-invoice-as-json-api.md](./get-blank-invoice-as-json-api.md) |

---

## Quick reference

| Subpath | Java method | Auth |
| :--- | :--- | :--- |
| `generateSingleInvoice` | `generateSingleInvoice` | Yes |
| `generateBlankInvoice` | `generateBlankInvoice` | Yes |
| `generateSummaryInvoice` | `generateSummaryInvoice` | Yes |
| `saveSingleInvoice` | `saveSingleInvoice` | Yes |
| `saveBlankInvoice` | `saveBlankInvoice` | Yes |
| `saveSummaryInvoice` | `saveSummaryInvoice` | Yes |
| `viewSingleInvoice` | `viewSingleInvoice` | Yes |
| `viewSummaryInvoice` | `viewSummaryInvoice` | Yes |
| `updateInvoice` | `updateInvoice` | Yes |
| `updateSummaryInvoice` | `updateSummaryInvoice` | Yes |
| `updateDraftToSummaryInvoice` | `updateDraftToSummaryInvoice` | Yes |
| `addBookingsToDraft` | `addBookingsToDraft` | Yes |
| `getSummaryInvoiceAsGroup` | `getSummaryInvoiceDataAsGroup` | Yes |
| `getSummaryInvoiceAsJson` | `getSummaryInvoiceJSON` | Yes |
| `getSingleInvoiceAsJson` | `getSingleInvoiceJSON` | Yes |
| `getBlankInvoiceAsJson` | `getBlankInvoiceJSON` | Yes |

---

## Implementation note

`GenerateInvoiceAPI` includes large private helpers (e.g. **`addCommonItems`**, **`renderTemplate`**) that are **not** exposed as REST; only the 16 methods above are HTTP endpoints.
