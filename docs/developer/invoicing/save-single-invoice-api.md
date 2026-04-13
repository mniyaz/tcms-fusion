---
id: save-single-invoice-api
title: Save Single Invoice API
sidebar_label: Save Single Invoice
---

## Introduction

Queues an **asynchronous save** for an **individual** generated invoice. Wraps **`InvoiceOriginal`** in **`PodQueueObjectHelper`**, sets queue **title** to the individual DB invoice type constant, and calls **`SaveInvoiceQueue.saveInvoice`**. A **200 ms** sleep runs before enqueueing.

**Source:** `GenerateInvoiceAPI.saveSingleInvoice`.

**See also:** [Generate Invoice — all endpoints](./generate-invoice-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/generateinvoice/saveSingleInvoice` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |
| `branch` | `String` | Yes | Contract. |
| `userId` | `String` | Yes | Passed to helper for queue/activity context. |
| `invoiceData` | `Object` | Yes | Gson → **`InvoiceOriginal`**. |

---

## Authentication

401 with CORS on failure. Success **`200`** response **does not** set `Access-Control-Allow-Origin` in the current code.

---

## Success Response

```json
{"data": true}
```

or `false` if the queue rejects the job.

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "branch": "default",
  "userId": "42",
  "invoiceData": { "invoiceNumber": "...", "...": "InvoiceOriginal" }
}
```
