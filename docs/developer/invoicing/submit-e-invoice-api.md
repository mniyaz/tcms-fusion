---
id: submit-e-invoice-api
title: Submit E-Invoice API
sidebar_label: Submit E-Invoice
---

## Introduction

Triggers **e-invoice submission / XML update** for a given invoice number via `EInvoiceService.updateEinvoiceXml(invoiceNo, tenantId)`. The service returns a map with **`success`** (Boolean) and **`message`** (String), which are copied into the JSON response. Activity is logged when submission succeeds.

**Source:** `InvoiceHomePageAPI.submitEInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/submitEInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Stored in activity log on success. |
| `invoiceNumber` | `String` | Yes | Invoice number passed to `updateEinvoiceXml`. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success (HTTP) | `200 OK` — note: **`submitted` in body** reflects business success, not HTTP status |

---

## Behaviour

1. Validates auth.
2. `Map<String, Object> resultMap = eInvoiceService.updateEinvoiceXml(invoiceNo, tenantId)`.
3. `success = Boolean.TRUE.equals(resultMap.get("success"))`.
4. `errorMessage = (String) resultMap.get("message")` (may be null).
5. If `success`, `CommonHelper.saveLatestActivity` for e-invoice submission.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{
  "submitted": true,
  "message": "..."
}
```

- `submitted`: mirrors map entry `"success"` (strict Boolean true check).
- `message`: service message (error or informational text).

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/submitEInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "invoiceNumber": "INV-2026-050",
  "userName": "alice",
  "authKey": "secretKey"
}
```
