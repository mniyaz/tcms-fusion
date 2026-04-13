---
id: hold-generated-invoice-api
title: Hold Generated Invoice API
sidebar_label: Hold Generated Invoice
---

## Introduction

Caches the user’s **selected generated invoices** in `TmsConstants.generatedInvoiceSelectionList` keyed by **lower-case username**, after verifying invoice numbers are **not already used** on acknowledgements (`AcknowledgementService.checkDuplicateInvoiceNumber`). If duplicates exist, the selection is **not** stored and `status` is `false`.

**Source:** `InvoiceHomePageAPI.holdGeneratedInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/holdGeneratedInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth and cache key (stored as lower-case). |
| `authKey` | `String` | Yes | Auth key. |
| `branch` | `String` | Yes | Parsed; **not** used after validation in current code. |
| `invoiceData` | `Array` | Yes | JSON array of **`InvoiceOriginal`** objects. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour

1. Validates auth.
2. Deserialises `invoiceData` to `List<InvoiceOriginal>`.
3. Builds list of `invoiceNumber` from each item.
4. `checkDuplicateInvoiceNumber(invoiceNumberList, tenantId)`:
   - If **no** duplicate: stores list in `generatedInvoiceSelectionList` for user.
   - If duplicate: does **not** update cache.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"status":true}
```

`status` is **`true`** when **no duplicate** was found (selection stored). It is **`false`** when duplicates were detected (`!checkDuplicateInvoiceNumber` is false, so `jo.put("status", !checkDuplicateInvoiceNumber)` → false).

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/holdGeneratedInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userName": "alice",
  "authKey": "secretKey",
  "branch": "default",
  "invoiceData": [
    { "invoiceNumber": "INV-001", "customerId": "C1", "...": "..." }
  ]
}
```
