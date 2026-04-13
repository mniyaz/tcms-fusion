---
id: view-single-invoice-api
title: View Single Invoice API
sidebar_label: View Single Invoice
---

## Introduction

Loads an existing **individual or blank** invoice for **view/edit** in the UI. Fetches **`InvoiceOriginal`** by **`invoiceNumber`**, reloads **line items**, merges **customer** details (with country/zone/state/city names), optional **DO number** for non-blank types, ensures a **remarks** line exists, recalculates **row totals** from qty × cost, and builds **`codeAndDescription`** from account code + category.

**Source:** `GenerateInvoiceAPI.viewSingleInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/viewSingleInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract. |
| `invoiceNumber` | Yes | Key for `getInvoiceOriginalForUpload`. |

---

## Authentication

401 invalid; 200 success.

---

## Success Response

```json
{
  "data": "<InvoiceOriginal JSON string>"
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "invoiceNumber": "INV-2026-100"
}
```
