---
id: approve-generated-invoice-api
title: Approve Generated Invoice API
sidebar_label: Approve Generated Invoice
---

## Introduction

Approves one or more **generated invoices** by invoice number: collects numbers from the posted **`InvoiceOriginal`** array and calls `InvoiceService.approveGeneratedInvoiceList(invoiceNumberList, tenantId)`. On success, writes an activity log (invoice list truncated to 200 characters with `...` if longer).

**Source:** `InvoiceHomePageAPI.approveGeneratedInvoice` (`@Path("approveGeneratedInvoice")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/approveGeneratedInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |
| `branch` | `String` | Yes | Parsed; unused after auth. |
| `userId` | `String` | Yes | Acting user for activity log. |
| `invoiceData` | `Array` | Yes | **`InvoiceOriginal`** objects; only **`invoiceNumber`** is read for the approval list. |

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
3. Builds `invoiceNumberList` from each `getInvoiceNumber()`.
4. `approved = invoiceService.approveGeneratedInvoiceList(invoiceNumberList, tenantId)`.
5. If `approved`, activity log with joined invoice numbers (max display length 200).

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"status":true}
```

or

```json
{"status":false}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/approveGeneratedInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userName": "alice",
  "authKey": "secretKey",
  "branch": "default",
  "userId": "42",
  "invoiceData": [
    { "invoiceNumber": "INV-001", "customerId": "C1" },
    { "invoiceNumber": "INV-002", "customerId": "C2" }
  ]
}
```
