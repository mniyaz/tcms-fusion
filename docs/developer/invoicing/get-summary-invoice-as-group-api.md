---
id: get-summary-invoice-as-group-api
title: Get Summary Invoice As Group API
sidebar_label: Summary Invoice As Group
---

## Introduction

Produces a **print-ready JSON** structure for **summary** invoices **grouped by truck**, suitable for dedicated / DO-style templates. Loads invoice and lines, builds **first page** summary block with **`tripsList`**, splits **`Invoicing`** mail rows by truck (comma-separated trucks become multiple groups), assigns **document numbers** via **`generateInvoiceDoSummaryId`** / counter **`INVOICE_DO_SUMMARY_NUMBER_COLUMN`**, and assembles **`summaryInvoiceSecondPage`** entries with trip aggregates and filtered **`InvoiceModel`** trees per truck.

**Source:** `GenerateInvoiceAPI.getSummaryInvoiceDataAsGroup` (`@Path("getSummaryInvoiceAsGroup")`).

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/getSummaryInvoiceAsGroup` |
| **Method** | `POST` |
| **Produces** | `text/plain` (top-level **Gson `JsonObject`** as string) |

---

## Request Body (JSON)

| Field | Required |
| :--- | :--- |
| `userName` | Yes |
| `authKey` | Yes |
| `branch` | Yes |
| `invoiceNumber` | Yes |

---

## Authentication

401 with CORS on failure; **200** returns **`printData.toString()`** with CORS `*`.

---

## Response Shape (top-level keys)

| Key | Description |
| :--- | :--- |
| `invoiceDetails` | Totals, dates, credit terms, **`templateName`** from **`invoice.properties`** → **`DEDICATED_INVOICE_TEMPLATE_NAME`**, **`amountInWords`**, service tax fields. |
| `customerDetails` | Serialised **`summaryFirstPageCustomerDetails`**. |
| `summaryInvoiceFirstPage` | JSON array with one object: summary first page + embedded **`tripsList`** (trip/truck/document aggregates). |
| `summaryInvoiceSecondPage` | Array of per-truck objects: **`Truck`**, **`DocumentNumber`**, **`SecondPageTripDetails`** (line tree), tonnage, transport from/to strings, etc. |

**Resource:** Classpath **`invoice.properties`** must define **`DEDICATED_INVOICE_TEMPLATE_NAME`**.

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
