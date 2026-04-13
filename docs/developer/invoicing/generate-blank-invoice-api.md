---
id: generate-blank-invoice-api
title: Generate Blank Invoice API
sidebar_label: Generate Blank Invoice
---

## Introduction

Creates a new **blank** invoice shell: generates invoice numbers, sets type **`INVOICE_TYPE_BLANK`**, attaches **two** initial **`InvoiceModel`** rows (data row + remarks row), **sales categories**, **city list**, and tenant **use-invoice-format** / GST defaults. Does **not** persist to the database; client uses the payload for data entry before **[save blank invoice](./save-blank-invoice-api.md)**.

**Source:** `GenerateInvoiceAPI.generateBlankInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/generateBlankInvoice` |
| **Method** | `POST` |
| **Produces** | `text/plain` (JSON string) |

---

## Request Body (JSON)

| Field | Required | Description |
| :--- | :--- | :--- |
| `userName` | Yes | Auth. |
| `authKey` | Yes | Auth. |
| `branch` | Yes | Contract field. |

---

## Authentication

401 when invalid; 200 on success. **`Access-Control-Allow-Origin: *`** on success.

---

## Success Response

```json
{
  "data": "<stringified InvoiceOriginal JSON>"
}
```

`data` is produced with **`SpecificClassExclusionStrategy`**.

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default"
}
```
