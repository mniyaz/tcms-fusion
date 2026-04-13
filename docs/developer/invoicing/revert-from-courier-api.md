---
id: revert-from-courier-api
title: Revert from Courier API
sidebar_label: Revert from Courier
---

## Introduction

Reverts a **courier (Postlaju)** record back to **generated invoice** state: `PostlajuService.revertToGeneratedInvoice(courierNumber, tenantId)`. Logs activity on success.

**Source:** `InvoiceHomePageAPI.revertFromCourier` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/revertFromCourier` |
| **Method** | `POST` |

---

## Request Body (JSON)

| Field | Type | Required |
| :--- | :--- | :--- |
| `userId` | `String` | Yes |
| `userName` | `String` | Yes |
| `authKey` | `String` | Yes |
| `courierNumber` | `String` | Yes |

---

## Response

```json
{"reverted":true}
```

---

## Example

```json
{"userId":"42","userName":"alice","authKey":"k","courierNumber":"PLJ-001"}
```
