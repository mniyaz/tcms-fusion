---
id: get-summary-invoice-as-json-api
title: Get Summary Invoice As JSON API
sidebar_label: Summary Invoice As JSON
---

## Introduction

Builds **template JSON** for the standard **summary invoice** print layout (property **`SUMMARY_INVOICE_TEMPLATE_NAME`**). Loads **`InvoiceOriginal`** and lines, enriches customer and summary first page, sorts **`Invoicing`** list by **delivery date** for second page, and for **each booking** outputs a JSON object with **`descriptionDetails`** (array of formatted **`InvoiceModel`** rows with row totals in `#,###.00` format).

**Source:** `GenerateInvoiceAPI.getSummaryInvoiceJSON` (`@Path("getSummaryInvoiceAsJson")`).

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/getSummaryInvoiceAsJson` |
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
| `invoiceDetails` | Same pattern as group API: template **`SUMMARY_INVOICE_TEMPLATE_NAME`**, amounts, words, service tax. |
| `customerDetails` | Customer block for summary. |
| `summaryInvoiceFirstPage` | Array with cost/total formatted. |
| `summaryInvoiceSecondPage` | Array: each element is **`Invoicing`** + **`descriptionDetails`** (lines for that booking). |

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "invoiceNumber": "SI-2026-01"
}
```
