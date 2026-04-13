---
id: revert-from-summary-tab-api
title: Revert from Summary Tab API
sidebar_label: Revert from Summary Tab
---

## Introduction

Reverts an entry from the **invoice summary** tab back to **generated invoice**: `InvoiceService.revertToGeneratedInvoiceFromSummary(invoiceNo, ackPosNo, tenantId)`. Logs activity with the invoice number.

**Source:** `InvoiceHomePageAPI.revertFromSummaryTab` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/revertFromSummaryTab` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Activity user. |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |
| `invoiceNo` | `String` | Yes | Invoice number. |
| `ackPosNo` | `String` | Yes | Acknowledgement or Postlaju number associated with the summary row. |

---

## Response

```json
{"reverted":true}
```

---

## Example

```json
{
  "userId": "42",
  "userName": "alice",
  "authKey": "k",
  "invoiceNo": "INV-001",
  "ackPosNo": "ACK-100"
}
```
