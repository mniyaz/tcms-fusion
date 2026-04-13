---
id: hold-summary-invoice-api
title: Hold Summary Invoice API
sidebar_label: Hold Summary Invoice
---

## Introduction

Stores the user’s **current summary-invoice line selection** in an in-memory map (`TmsConstants.summaryInvoiceSelectionList`) keyed by **lower-case username**. This lets the server remember which `Invoicing` rows were selected before a follow-up action (for example generating or confirming a summary invoice). The `branch` field is read from JSON but is **not** used in the handler body beyond parsing.

**Source:** `InvoiceHomePageAPI.holdSummaryInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/holdSummaryInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body (clients typically send `application/json`) |
| **Produces** | `text/plain` (entity is a **JSON string**) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Username; used for auth and as the cache key (stored as `userName.toLowerCase()`). |
| `authKey` | `String` | Yes | Session/auth key. |
| `branch` | `String` | Yes | Present in the contract; not referenced after parse in current code. |
| `invoicedata` | `Array` | Yes | JSON array of **`Invoicing`** objects deserialised with Gson (`ArrayList<Invoicing>`). |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid `userName` / `authKey` | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour

1. Parses the body with `JsonParser` / `JsonObject`.
2. Validates `userName` and `authKey`.
3. Deserialises `invoicedata` into `List<Invoicing>`.
4. Executes `TmsConstants.summaryInvoiceSelectionList.put(userName.toLowerCase(), summaryInvoiceList)`.

**Note:** This is **server-side volatile state** (typically a static map). It is not persisted to the database by this call alone and may be lost on JVM restart.

---

## Success Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"data":true}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/holdSummaryInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userName": "alice",
  "authKey": "secretAuthKey",
  "branch": "default",
  "invoicedata": [
    { "id": 1, "bookingId": "BK-1", "invoiceNumber": "TEMP-1", "...": "..." }
  ]
}
```
