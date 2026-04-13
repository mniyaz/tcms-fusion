---
id: upload-courier-document-api
title: Upload Courier Document API
sidebar_label: Upload Courier Document
---

## Introduction

Uploads a **PDF** for a **courier (Postlaju)** record: stores under `TmsConstants.POSTLAJU_SERVER_ROOT_PATH` + image id via **`SFTPFileTransferTo.uploadFile`**. Authenticates with **`userId` + `authKey`** (`checkIfAuthKeyIsValid(userId, authKey, tenantId)`).

On success: sets Postlaju **`ACTIVE`**, file metadata, `imageStoreService.setImageDetails` with **`postlaju`** branch, then for invoices linked by `getInvoiceOriginalAcknowledgement(courierNumber, ...)` creates **`InvoiceSummary`** rows with **`POSTLAJU_STATUS`** and saves them.

**Source:** `InvoiceHomePageAPI.uploadCourierDocument` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/uploadCourierDocument` |
| **Method** | `POST` |
| **Consumes** | `multipart/form-data` |

---

## Form Fields

| Field | Required | Description |
| :--- | :--- | :--- |
| `courierNumber` | Yes | Courier id; file `{courierNumber}.pdf`. |
| `courierFile` | Yes | PDF bytes. |
| `userId` | Yes | Auth principal for `checkIfAuthKeyIsValid`. |
| `authKey` | Yes | Auth key. |

---

## Response

Same shape as [upload acknowledgement document](./upload-acknowledgement-document-api.md): `Uploaded` `Ok`/`No`, optional `ImageId`, `Filepath`. **`200`** without global CORS header on success entity.

---

## Other

`Thread.sleep(200)` at start.
