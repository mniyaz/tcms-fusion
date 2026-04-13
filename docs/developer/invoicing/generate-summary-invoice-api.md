---
id: generate-summary-invoice-api
title: Generate Summary Invoice API
sidebar_label: Generate Summary Invoice
---

## Introduction

Builds a **summary** invoice **`InvoiceOriginal`** from **`invoicedata`** (`List<Invoicing>`). Resolves customer and credit terms, populates country/zone/state/city lists for address UI, aggregates **multiple bookings** into line items (shared logic with large in-method loops), summary first-page data, totals, and validation flags. Same high-level pattern as single invoice but for consolidated billing.

**Source:** `GenerateInvoiceAPI.generateSummaryInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/generateSummaryInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `invoicedata` | Yes | Array → `List<Invoicing>` (bookings in the summary). |

---

## Authentication

401 invalid; 200 success with CORS `*`.

---

## Success Response

| Key | Description |
| :--- | :--- |
| `isValid` | `"Valid"` or `"NoCreditTerm"` (credit-term branch outcome). |
| `data` | Stringified **`InvoiceOriginal`** (Gson + **`SpecificClassExclusionStrategy`**). |

**Note:** Response uses **`isValid`**, not **`res`** (unlike [generate single invoice](./generate-single-invoice-api.md)).

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "invoicedata": [
    { "bookingId": "BK-1", "customerId": "C1", "...": "..." },
    { "bookingId": "BK-2", "customerId": "C1", "...": "..." }
  ]
}
```
