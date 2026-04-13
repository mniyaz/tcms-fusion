---
id: get-blank-invoice-as-json-api
title: Get Blank Invoice As JSON API
sidebar_label: Blank Invoice As JSON
---

## Introduction

Print JSON for **blank** invoices using **`BLANK_INVOICE_TEMPLATE_NAME`**. Same general flow as [single invoice JSON](./get-single-invoice-as-json-api.md) (customer load, line formatting, **`invoiceDetails`** with totals and amount in words) but **`invoiceDetails`** does **not** include the **`truck`** field.

**Source:** `GenerateInvoiceAPI.getBlankInvoiceJSON` (`@Path("getBlankInvoiceAsJson")`).

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/getBlankInvoiceAsJson` |
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
| `invoiceDetails` | **`BLANK_INVOICE_TEMPLATE_NAME`**, currency, costs, words (no `truck`). |
| `customerDetails` | Customer / single-invoice block. |
| `firstPageDetails` | Line array. |

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "invoiceNumber": "INV-BLANK-001"
}
```
