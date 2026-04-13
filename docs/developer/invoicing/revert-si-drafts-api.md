---
id: revert-si-drafts-api
title: Revert SI Drafts API
sidebar_label: Revert SI Drafts
---

## Introduction

Reverts a **summary invoice (SI) draft** represented by an **`InvoiceOriginal`** payload using `InvoiceService.revertFromSIDrafts`. Used when discarding or unwinding a draft before it becomes a final generated invoice. On success, writes an invoicing activity log entry.

**Source:** `InvoiceHomePageAPI.revertFromSIDrafts` (`@Path("revertSIDrafts")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/revertSIDrafts` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Acting user for activity log. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |
| `invoiceOriginalData` | `Object` | Yes | JSON object deserialised to **`InvoiceOriginal`** with Gson (not a string — unlike delete/revert generated endpoints). |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour

1. Parses JSON; validates `userName` / `authKey`.
2. `InvoiceOriginal invoiceOriginal = gson.fromJson(jsonObject.get("invoiceOriginalData"), InvoiceOriginal.class)`.
3. `reverted = invoiceService.revertFromSIDrafts(invoiceOriginal, tenantId)`.
4. If `reverted`, activity log: draft reverted for `invoiceOriginal.getInvoiceNumber()`.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"reverted":true}
```

or

```json
{"reverted":false}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/revertSIDrafts HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "userName": "alice",
  "authKey": "secretKey",
  "invoiceOriginalData": {
    "invoiceNumber": "DRAFT-SI-001",
    "customerId": "CUST01",
    "...": "other InvoiceOriginal fields as required by service"
  }
}
```
