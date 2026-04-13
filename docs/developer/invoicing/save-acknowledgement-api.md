---
id: save-acknowledgement-api
title: Save Acknowledgement API
sidebar_label: Save Acknowledgement
---

## Introduction

Persists acknowledgement data after preview: accepts **`acknowledgementDetails`** (single **`Acknowledgment`**) and **`acknowledgementList`** (array of **`Acknowledgment`** line rows from the UI). Sets `generatedBy` from `userName`, **regenerates** the main acknowledgement number with `generateAcknowledgementNumber`, and calls **`acknowledgementService.saveAcknowledgement(acknowledgementList, null, false, tenantId)`** with a list containing the details row.

On success: for each item in **`acknowledgementList`**, loads **`InvoiceOriginal`** rows by invoice number, sets **`generatedAcknowledgementOrPostlajuNo`** to the new acknowledgement number, **`status`** to **`TmsConstants.CLOSED`**, and **`updateInvoiceOriginal`**. Activity log records generated acknowledgement.

**Source:** `InvoiceHomePageAPI.saveAcknowledgement` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [generate acknowledgement](./generate-acknowledgement-api.md), [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/saveAcknowledgement` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth + `generatedBy`. |
| `authKey` | `String` | Yes | Auth. |
| `acknowledgementList` | `Array` | Yes | `List<Acknowledgment>` (line items). |
| `acknowledgementDetails` | `Object` | Yes | Header **`Acknowledgment`** (number regenerated server-side). |

---

## Response

```json
{"saved":true}
```

or `false` if `saveAcknowledgement` returns false.

**Headers:** `Access-Control-Allow-Origin: *` on `Response.ok()`.

---

## Example (illustrative)

```json
{
  "userName": "alice",
  "authKey": "k",
  "acknowledgementDetails": { "customerId": "C1", "...": "..." },
  "acknowledgementList": [
    { "invoiceNumber": "INV-1", "...": "..." }
  ]
}
```
