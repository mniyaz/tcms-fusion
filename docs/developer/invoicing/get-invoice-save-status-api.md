---
id: get-invoice-save-status-api
title: Get Invoice Save Status API
sidebar_label: Get Invoice Save Status
---

## Introduction

Polls whether an **`InvoiceOriginal`** row exists for a **temporary invoice number** (`getInvoiceOriginalSaveStauts` — spelling matches the Java method name). If found, returns `data: true` plus the **real** `invoiceNumber` and optional `bookingId` from the first row. Used by the UI to detect async save completion when creating invoices.

**Source:** `InvoiceHomePageAPI.getInvoiceSaveStatus` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

**No** auth validation. Path includes `userId`, `officeBranch`, `authKey` for URL symmetry only.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getInvoiceSaveStatus/{tempInvoiceNumber}/{userId}/{officeBranch}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (JSON string entity) |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tempInvoiceNumber` | `String` | Yes | Temporary / in-progress invoice identifier to look up. |
| `userId` | `String` | Yes | Unused in handler. |
| `officeBranch` | `String` | Yes | Unused in handler. |
| `authKey` | `String` | Yes | Unused in handler. |

---

## Behaviour

`List<InvoiceOriginal> invoiceoriginal = invoiceService.getInvoiceOriginalSaveStauts(tempInvoiceNumber, tenantId)`.

- If `size() > 0`: `data: true`, `invoiceNumber` from first row, optional `bookingId` if non-null.
- Else: `data: false` only.

---

## Response

**Code:** `200 OK`

**When saved (at least one row):**

```json
{
  "data": true,
  "invoiceNumber": "INV-2026-100",
  "bookingId": "BK-1"
}
```

`bookingId` is omitted when null on the entity.

**When not found:**

```json
{
  "data": false
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getInvoiceSaveStatus/TEMP-INV-xyz/alice/default/9274923 HTTP/1.1
Host: {base}
```
