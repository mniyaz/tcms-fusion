---
id: delete-invoice-booking-api
title: Delete Invoice Booking API
sidebar_label: Delete Invoice Booking
---

## Introduction

Removes a **pending** invoicing row (and related booking linkage) for a numeric **`invoicing.ID`** via `InvoiceService.delInvoiceAndBookingFromInvoicing`. On success, records an activity log entry for invoicing. Intended for use from the invoice booking UI when deleting a line from the pending list.

**Source:** `InvoiceHomePageAPI.deleteInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

This endpoint **does not** call `TmsUtil.checkIfAuthKeyIsValid`. Path segments `officeBranch` and `authKey` are **not** used for authentication in the current implementation. Rely on network policies, session filters, or harden the API before exposing it broadly.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/deleteinvoice/{bookingId}/{userId}/{officeBranch}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (entity is a **JSON string**) |

The path parameter name **`bookingId`** maps to the **`int`** primary key of the `invoicing` row (`@PathParam("bookingId") int bookingId`).

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `bookingId` | `Integer` | Yes | `invoicing.ID` to delete. |
| `userId` | `String` | Yes | Stored in the activity log as the acting user on success. |
| `officeBranch` | `String` | Yes | Required by URL shape; **unused** in handler. |
| `authKey` | `String` | Yes | Required by URL shape; **not validated** in handler. |

---

## Behaviour

- Calls `invoiceService.delInvoiceAndBookingFromInvoicing(bookingId, tenantId)`.
- If `deleted` is true: `CommonHelper.saveLatestActivity` with title `TmsConstants.TITLE_INVOICING` and message describing the deleted booking id.

---

## Response

**Code:** `200 OK` (always returned when no framework error; check `deleted` in body)

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
GET /rest/invoicehome/deleteinvoice/12345/alice/default/unusedAuthKey HTTP/1.1
Host: {base}
```
