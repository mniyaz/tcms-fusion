---
id: delete-booking-from-draft-api
title: Delete Booking from Draft API
sidebar_label: Delete Booking from Draft
---

## Introduction

Removes a **booking** from an invoice **draft** via `InvoiceService.removeBookingFromDraft(bookingId, tenantId)`, and records an activity log describing the booking id and parent invoice number.

**Source:** `InvoiceHomePageAPI.deleteBookingFromDraft` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/deleteBookingFromDraft` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |
| `branch` | `String` | Yes | Parsed; unused after auth in current code. |
| `userId` | `String` | Yes | Acting user for activity log. |
| `bookingId` | `String` | Yes | Booking to remove from the draft. |
| `invoiceNo` | `String` | Yes | Invoice number included in the activity message. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour

1. Validates auth.
2. `removeBookingFromDraft(bookingId, tenantId)`.
3. `saveLatestActivity` with message: removed booking from invoice.

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
POST /rest/invoicehome/deleteBookingFromDraft HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userName": "alice",
  "authKey": "secretKey",
  "branch": "default",
  "userId": "42",
  "bookingId": "BK-100",
  "invoiceNo": "DRAFT-INV-1"
}
```
