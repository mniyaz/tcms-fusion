---
id: revert-from-acknowledgement-api
title: Revert from Acknowledgement API
sidebar_label: Revert from Acknowledgement
---

## Introduction

Reverts an **acknowledgement** back to **generated invoice** state: `AcknowledgementService.revertToGeneratedInvoice(ackNumber, tenantId)`. Logs activity on success.

**Source:** `InvoiceHomePageAPI.revertFromAcknowledgement` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/revertFromAcknowledgement` |
| **Method** | `POST` |
| **Consumes** | JSON body |
| **Produces** | `text/plain` (JSON string) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Activity log user. |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |
| `ackNumber` | `String` | Yes | Acknowledgement number to revert. |

---

## Response

```json
{"reverted":true}
```

**Headers:** `Access-Control-Allow-Origin: *` on success path.

---

## Example

```http
POST /rest/invoicehome/revertFromAcknowledgement HTTP/1.1
Content-Type: application/json

{"userId":"42","userName":"alice","authKey":"k","ackNumber":"ACK-001"}
```
