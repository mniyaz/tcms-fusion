---
id: update-summary-invoice-api
title: Update Summary Invoice API
sidebar_label: Update Summary Invoice
---

## Introduction

Updates an existing **summary** invoice. When **`draftToInvoice`** is true on **`invoiceData`**, optional **`selectedData`** (`List<Invoicing>`) supplies extra rows to merge into DB update paths. Recalculates service tax, calls **`updateSummaryInvoice`**, re-sorts and serialises lines, saves **`SummaryInvoiceFirstPage`** rows (insert vs update), activity log.

**Source:** `GenerateInvoiceAPI.updateSummaryInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/updateSummaryInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `userId` | Yes | Activity. |
| `invoiceData` | Yes | **`InvoiceOriginal`** with summary + lines + first page list. |
| `selectedData` | No | Array of **`Invoicing`**; used when **`draftToInvoice`** is true. |

---

## Success Response

When service save succeeds:

```json
{
  "data": true,
  "invoiceNumber": "...",
  "bookingId": "..."
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": { "invoiceNumber": "SI-1", "draftToInvoice": false, "...": "..." },
  "selectedData": []
}
```
