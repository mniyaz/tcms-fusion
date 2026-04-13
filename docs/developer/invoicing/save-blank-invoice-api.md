---
id: save-blank-invoice-api
title: Save Blank Invoice API
sidebar_label: Save Blank Invoice
---

## Introduction

Queues async persistence for a **blank** invoice: **`SaveInvoiceQueue.saveInvoice`** with title set to **blank** invoice type. **`Thread.sleep(200)`** before enqueue.

**Source:** `GenerateInvoiceAPI.saveBlankInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/saveBlankInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required |
| :--- | :--- |
| `userName` | Yes |
| `authKey` | Yes |
| `branch` | Yes |
| `userId` | Yes |
| `invoiceData` | Yes (`InvoiceOriginal`) |

---

## Response

```json
{"data": true}
```

**CORS:** Not set on **`200`** success (only on **`401`**).

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": { "...": "blank InvoiceOriginal" }
}
```
