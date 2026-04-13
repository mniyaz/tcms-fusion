---
id: update-draft-to-summary-invoice-api
title: Update Draft to Summary Invoice API
sidebar_label: Draft to Summary Invoice
---

## Introduction

**Promotes** a **draft** summary invoice to a **generated** invoice: assigns a **new invoice number** (respects company code from booking, customer-specific prefix feature, and invoice format settings), sets status **GENERATED**, **`updateInvoiceOriginalWithNativeSQL`**, updates related **`Invoicing`** rows and line items, persists **summary first page**. If **`generateEInvoice`** on the payload is **true**, invokes **`eInvoiceService.updateEinvoiceXml`** after success.

**Source:** `GenerateInvoiceAPI.updateDraftToSummaryInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/updateDraftToSummaryInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `userId` | Yes | Activity. |
| `invoiceData` | Yes | **`InvoiceOriginal`** (includes **`generateEInvoice`**, **`summaryFirstPageData`**, etc.). |
| `selectedData` | No | Additional **`Invoicing`** entries; merged with booking lines per loop logic. |

---

## Success Response

```json
{
  "data": true,
  "invoiceNumber": "<new number>",
  "bookingId": "..."
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Behaviour notes

- **Settings** may be loaded per **company code** of the booking when present.
- **Invoice number** generation branches on **customer-specific prefix** and **use invoice format** flags.

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": {
    "generateEInvoice": false,
    "bookingId": "BK-REF",
    "...": "draft summary InvoiceOriginal"
  },
  "selectedData": []
}
```
