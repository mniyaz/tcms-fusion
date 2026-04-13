---
id: update-invoice-api
title: Update Invoice API
sidebar_label: Update Invoice
---

## Introduction

Persists edits to an **individual** (or compatible) **invoice header and lines**. Parses **`invoiceData`** as **`InvoiceOriginal`**, applies **service tax** via **`calculateServiceTaxAmount`**, calls **`invoiceService.updateInvoice`**, deletes/re-saves **`InvoiceModel`** rows that meet content rules, resolves **`BookingDetails`** ref for **single** invoice type lines, logs **activity**.

**Source:** `GenerateInvoiceAPI.updateInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/updateInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `userId` | Yes | `generatedBy` / activity. |
| `invoiceData` | Yes | Full **`InvoiceOriginal`** including `invoiceModel` list and `singleInvoice` dates. |

---

## Success Response (when `save` is true)

| Key | Description |
| :--- | :--- |
| `data` | `true` |
| `invoiceNumber` | From payload. |
| `bookingId` | Included **only** when **`invoiceType`** is **single** (`INVOICE_TYPE_SINGLE`). |

**Headers:** `Access-Control-Allow-Origin: *`

If update fails early, **`data`** may be absent or reflect failure; inspect empty/minimal JSON.

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": {
    "invoiceNumber": "INV-100",
    "invoiceModel": [],
    "singleInvoice": { "currentDate": "2026-04-01T00:00:00", "...": "..." },
    "...": "..."
  }
}
```
