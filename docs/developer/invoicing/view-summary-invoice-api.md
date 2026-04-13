---
id: view-summary-invoice-api
title: View Summary Invoice API
sidebar_label: View Summary Invoice
---

## Introduction

Loads a **summary** (or **draft**) invoice using **`getInvoiceOriginalFromNativeQuery`**. Sets **`draftToInvoice`** when status is **DRAFT**. Hydrates **summary first page** via **`SummaryInvoiceFirstPageService`**, **customer** block for summary, **invoice lines** sorted by **delivery date** with **serial numbers**, **`summaryFirstPageData`** for mail/list context, and remarks/description/comment from first-page rows.

**Source:** `GenerateInvoiceAPI.viewSummaryInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/viewSummaryInvoice` |
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

## Success Response

```json
{ "data": "<InvoiceOriginal JSON>" }
```

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
