---
id: get-invoice-upload-status-api
title: Get Invoice Upload Status API
sidebar_label: Get Invoice Upload Status
---

## Introduction

Returns whether an uploaded document is associated with the given **invoice number** for the tenant, via `InvoiceService.getInvoiceUploadStatus(invoiceNumber, tenantId)`. The UI polls this after multipart upload to confirm processing completion.

**Source:** `InvoiceHomePageAPI.getPoduploadstatus` (`@Path("getInvoiceUploadStatus")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

**No** `checkIfAuthKeyIsValid`. `userId`, `officeBranch`, and `authKey` are not used for authentication in the handler.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getInvoiceUploadStatus/{invoiceNumber}/{userId}/{officeBranch}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (JSON string entity) |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | `String` | Yes | Invoice number checked for upload status. |
| `userId` | `String` | Yes | Present in URL; **unused** in handler (activity logging is commented out). |
| `officeBranch` | `String` | Yes | URL convention; unused. |
| `authKey` | `String` | Yes | URL convention; not validated. |

---

## Behaviour

`boolean uploaded = invoiceService.getInvoiceUploadStatus(invoiceNumber, tenantId)`.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"data":true}
```

or

```json
{"data":false}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getInvoiceUploadStatus/INV-2026-001/alice/default/9274923 HTTP/1.1
Host: {base}
```
