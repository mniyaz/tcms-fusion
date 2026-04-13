---
id: generate-acknowledgement-api
title: Generate Acknowledgement (preview) API
sidebar_label: Generate Acknowledgement
---

## Introduction

**Does not persist** acknowledgement rows by itself. Builds a **preview** payload from selected **`InvoiceOriginal`** rows (`invoiceData` array): resolves customer address via `getCustomerDetailsForSingleInvoice`, resolves country/zone/state names with `PopulateLocationService`, generates acknowledgement numbers with `invoiceService.generateAcknowledgementNumber`, and returns:

- **`acknowledgementDetails`** — one **`Acknowledgment`** object (header-style customer + first invoice’s grand total, shared acknowledge number on the summary object).
- **`acknowledgementList`** — one **`Acknowledgment`** per selected invoice line (each gets a **new** `generateAcknowledgementNumber()` call in the loop).

All constructed rows use status **`TmsConstants.INACTIVE`** until saved/uploaded elsewhere.

**Source:** `InvoiceHomePageAPI.generateAcknowledgement` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [save acknowledgement](./save-acknowledgement-api.md), [upload acknowledgement document](./upload-acknowledgement-document-api.md), [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/generateAcknowledgement` |
| **Method** | `POST` |
| **Produces** | `text/plain` (JSON string) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |
| `invoiceData` | `Array` | Yes | `List<InvoiceOriginal>` (same customer expected; code uses `invoiceSelected.get(0)` for customer fields). |

---

## Success Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{
  "acknowledgementDetails": { "...": "Acknowledgment JSON" },
  "acknowledgementList": [ { "...": "per invoice" } ]
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "invoiceData": [
    { "invoiceNumber": "INV-1", "customerId": "C1", "customerName": "Acme", "grandTotal": "100.00", "invoiceDate": "2026-04-01T00:00:00" }
  ]
}
```
