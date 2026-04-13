---
id: generate-courier-api
title: Generate Courier (preview) API
sidebar_label: Generate Courier
---

## Introduction

**Preview-only** (no DB save in this handler). From **`invoiceData`** (`List<InvoiceOriginal>`), loads customer details, resolves location names, sets **`Postlaju`** header fields (`courierDetails`) with `generatePostlajuNumber`, and builds **`courierList`** with one **`Postlaju`** per invoice (each line gets a new `generatePostlajuNumber()`). Status **`INACTIVE`** until follow-up save/upload.

**Source:** `InvoiceHomePageAPI.generateCourier` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [save courier](./save-courier-api.md), [upload courier document](./upload-courier-document-api.md), [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/generateCourier` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required |
| :--- | :--- | :--- |
| `userName` | `String` | Yes |
| `authKey` | `String` | Yes |
| `invoiceData` | `Array` | Yes (`InvoiceOriginal`) |

---

## Success Response

```json
{
  "courierDetails": { "...": "Postlaju header" },
  "courierList": [ { "...": "per invoice" } ]
}
```

---

## Example

```json
{
  "userName": "alice",
  "authKey": "k",
  "invoiceData": [{ "invoiceNumber": "INV-1", "customerId": "C1" }]
}
```
