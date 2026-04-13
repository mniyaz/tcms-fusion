---
id: generate-single-invoice-api
title: Generate Single Invoice API
sidebar_label: Generate Single Invoice
---

## Introduction

Builds a full **individual (single-booking)** invoice payload as **`InvoiceOriginal`** from one or more selected **`Invoicing`** rows. The handler loads **booking details**, expands planner/pickup/delivery/truck/equipment lines into **`InvoiceModel`** rows, computes totals and GST, attaches sales categories and settings (invoice format, GST %), and may set **Cermat** consignor/consignee fields and **vendor agreed price** messages when feature flags and data allow.

**Source:** `GenerateInvoiceAPI.generateSingleInvoice` — `transportsupplyproject/src/in/greenorange/api/invoice/GenerateInvoiceAPI.java`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/generateinvoice/generateSingleInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON (use `Content-Type: application/json` in clients) |
| **Produces** | `text/plain` (entity is a **JSON object string**) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |
| `branch` | `String` | Yes | Present in contract; often unused after parse. |
| `invoicedata` | `Array` | Yes | Gson → `List<Invoicing>`; first row’s **`bookingId`** drives booking fetch. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Success Response

**Body (JSON string):**

| Key | Type | Description |
| :--- | :--- | :--- |
| `res` | `String` | `"Valid"` when the credit-term branch completes successfully; `"NoCreditTerm"` when it does not. |
| `data` | `String` | Embedded JSON: **`InvoiceOriginal`** serialised with Gson + **`SpecificClassExclusionStrategy`**. |

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/generateinvoice/generateSingleInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userName": "alice",
  "authKey": "secretKey",
  "branch": "default",
  "invoicedata": [
    {
      "bookingId": "BK-001",
      "customerId": "C1",
      "customerName": "Acme",
      "...": "other Invoicing fields as used by the UI"
    }
  ]
}
```

Parse the outer body as JSON, then parse **`data`** again as JSON for the invoice object.
