---
id: add-bookings-to-draft-api
title: Add Bookings to Draft API
sidebar_label: Add Bookings to Draft
---

## Introduction

Merges **additional bookings** into an existing **summary draft** **`InvoiceOriginal`**. Client sends current **`invoiceData`** plus **`addedBookingsData`** (`List<Invoicing>`). Server loads **booking details** for new booking IDs, runs the same **line-expansion** logic as summary generation (planner, pickup, delivery, trucks, equipment, etc.), and returns the **updated** **`InvoiceOriginal`** as embedded JSON in **`data`**.

**Source:** `GenerateInvoiceAPI.addBookingsToDraft`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/addBookingsToDraft` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `addedBookingsData` | Yes | Array → `List<Invoicing>` (bookings to add). |
| `invoiceData` | Yes | Current draft **`InvoiceOriginal`** (must include **`summaryFirstPageData`** etc. as built by generate/view). |

---

## Success Response

```json
{
  "data": "<updated InvoiceOriginal JSON string>"
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
  "addedBookingsData": [{ "bookingId": "BK-NEW", "customerId": "C1" }],
  "invoiceData": { "invoiceNumber": "TEMP-SI-1", "...": "draft" }
}
```
