---
id: get-pending-summary-invoicing-api
title: Get Pending Summary Invoicing for Customer API
sidebar_label: Pending Summary Invoicing
---

## Introduction

Returns **pending summary** `Invoicing` rows for a **single customer** via `InvoiceService.getPendingSummaryInvoicingForCustomer(customerId, tenantId)`, as JSON `{"data":[...]}`. Used by summary invoice screens (for example `viewSummaryInvoice.xhtml`) to load bookings eligible for summary billing.

**Source:** `InvoiceHomePageAPI.getPendingSummaryInvoicingForCustomer` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getPendingSummaryInvoicingForCustomer/{customerId}/{officeBranch}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `customerId` | `String` | Yes | Customer whose pending summary lines are loaded. |
| `officeBranch` | `String` | Yes | **Required in the URL** (e.g. `default`). The Java method does **not** declare `@PathParam("officeBranch")`; ensure your JAX-RS runtime matches the template (clients must still supply this segment). |
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

After auth, loads the list with `getPendingSummaryInvoicingForCustomer`, serialises with Gson into a `JSONArray`, wraps in `{"data": ...}`.

---

## Success Response

**Code:** `200 OK`

**Content-Type:** `application/json`

**Body:**

```json
{
  "data": [
    {
      "id": 1,
      "bookingId": "...",
      "customerId": "...",
      "invoiceType": "SUMMARY",
      "status": "PENDING",
      "...": "Invoicing entity fields"
    }
  ]
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getPendingSummaryInvoicingForCustomer/CUST01/default/alice/secretKey HTTP/1.1
Host: {base}
```
