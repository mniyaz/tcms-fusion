---
id: save-courier-api
title: Save Courier API
sidebar_label: Save Courier
---

## Introduction

Persists **Postlaju** data: **`courierDetails`** (header **`Postlaju`**) and **`courierList`** (line array). Sets `generatedBy` from `userName`, **regenerates** `postlajuNumber` via `generatePostlajuNumber`, calls **`postlajuService.savePostlaju(postlajuList, tenantId)`** with a singleton list of the details object.

On success: for each entry in **`courierList`**, loads invoice originals by invoice number, sets **`generatedAcknowledgementOrPostlajuNo`** to the saved courier number, status **`CLOSED`**, **`updateInvoiceOriginal`**. Activity log for generated courier.

**Source:** `InvoiceHomePageAPI.saveCourier` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [generate courier](./generate-courier-api.md), [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/saveCourier` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required |
| :--- | :--- | :--- |
| `userName` | `String` | Yes |
| `authKey` | `String` | Yes |
| `courierList` | `Array` | Yes (`List<Postlaju>`) |
| `courierDetails` | `Object` | Yes (`Postlaju`) |

---

## Response

```json
{"saved":true}
```

**Headers:** `Access-Control-Allow-Origin: *`
