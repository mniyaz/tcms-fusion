---
id: save-summary-invoice-api
title: Save Summary Invoice API
sidebar_label: Save Summary Invoice
---

## Introduction

Queues async save for a **summary** invoice using **`SaveInvoiceQueue.saveInvoice`** and the **summary-for-DB** title constant. Same queue pattern as single/blank saves.

**Source:** `GenerateInvoiceAPI.saveSummaryInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/saveSummaryInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Required |
| :--- | :--- |
| `userName` | Yes |
| `authKey` | Yes |
| `branch` | Yes |
| `userId` | Yes |
| `invoiceData` | Yes (`InvoiceOriginal` including summary structures) |

---

## Response

```json
{"data": true}
```

**CORS:** Omitted on **`200`** success.

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": { "invoiceNumber": "SUM-001", "...": "..." }
}
```
