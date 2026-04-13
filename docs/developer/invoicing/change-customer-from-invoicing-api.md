---
id: change-customer-from-invoicing-api
title: Change Customer from Invoicing API
sidebar_label: Change Customer from Invoicing
---

## Introduction

Updates the **customer name and id** on an invoicing row for a given **booking id** via `InvoiceService.changeCustomerNameFromInvoicing(customerName, customerId, bookingId, tenantId)`. The JSON property name is **`customerId`**. On success, logs activity for the booking.

**Source:** `InvoiceHomePageAPI.changeCustomerNameFromInvoicing` (`@Path("changeCustomerFromInvoicing")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/changeCustomerFromInvoicing` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Acting user for activity log. |
| `customerName` | `String` | Yes | New display name. |
| `customerId` | `String` | Yes | New customer id. |
| `bookingId` | `String` | Yes | Booking row to update. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour

`deleted = invoiceService.changeCustomerNameFromInvoicing(...)` — the response field is named **`deleted`** but semantically indicates **whether the update succeeded**, not a delete operation.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"deleted":true}
```

or

```json
{"deleted":false}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/changeCustomerFromInvoicing HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "customerName": "Acme Logistics Sdn Bhd",
  "customerId": "CUST-NEW",
  "bookingId": "BK-500",
  "userName": "alice",
  "authKey": "secretKey"
}
```
