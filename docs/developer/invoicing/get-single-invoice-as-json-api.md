---
id: get-single-invoice-as-json-api
title: Get Single Invoice As JSON API
sidebar_label: Single Invoice As JSON
---

## Introduction

Produces **individual invoice** print JSON using **`INDIVIDUAL_INVOICE_TEMPLATE_NAME`** from **`invoice.properties`**. Loads invoice and lines, enriches customer (DO number when not blank type), formats costs/row totals with **`DecimalFormat` `#,###.00`**, parses the **first** line’s **`description`** into **`truckTonnage`**, **`truckType`**, and **`routing`** (handles **"Ex."** variant), adds **`currency`** and **`truck`** (from first **`getInvoiceListForMail`** row) to **`invoiceDetails`**.

**Source:** `GenerateInvoiceAPI.getSingleInvoiceJSON` (`@Path("getSingleInvoiceAsJson")`).

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/getSingleInvoiceAsJson` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required |
| :--- | :--- |
| `userName` | Yes |
| `authKey` | Yes |
| `branch` | Yes |
| `invoiceNumber` | Yes |

---

## Response (top-level)

| Key | Description |
| :--- | :--- |
| `invoiceDetails` | Number, date, credit terms, remarks, currency, truck, subtotal/tax/grand total, **`amountInWords`**, **`templateName`**. |
| `customerDetails` | **`singleInvoice`** customer block. |
| `firstPageDetails` | Array of line items with display formatting. |

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "invoiceNumber": "INV-2026-050"
}
```
