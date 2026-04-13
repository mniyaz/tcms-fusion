---
id: upload-acknowledgement-document-api
title: Upload Acknowledgement Document API
sidebar_label: Upload Acknowledgement Document
---

## Introduction

Uploads a **PDF** for an acknowledgement: multipart fields → SFTP via `SFTPFileTransferTo.uploadFile` under `TmsConstants.ACKNOWLEDGEMENT_SERVER_ROOT_PATH` + generated **image id**. Auth uses **`userId` + `authKey`** (passed to `checkIfAuthKeyIsValid(userId, authKey, ...)` — username is the **user id** field here).

On successful upload and image metadata save:

- Sets acknowledgement **`ACTIVE`**, `fileId`, `fileName`.
- **`acknowledgementService.saveAcknowledgement`**
- For each related **`InvoiceOriginal`** from `getInvoiceOriginalAcknowledgement`, creates **`InvoiceSummary`** with acknowledgement status and saves via `saveInvoiceSummary`.

**Source:** `InvoiceHomePageAPI.uploadAcknowledgementDocument` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| **URL** | `/rest/invoicehome/uploadAcknowledgementDocument` |
| **Method** | `POST` |
| **Consumes** | `multipart/form-data` |
| **Produces** | `text/plain` (JSON string) |

---

## Form Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `ackNumber` | Text | Yes | Acknowledgement number; also used as base file name (`{ackNumber}.pdf`). |
| `ackFile` | File | Yes | PDF body. |
| `userId` | Text | Yes | Passed as **first argument** to `checkIfAuthKeyIsValid` (acts as login id). |
| `authKey` | Text | Yes | Auth key. |

---

## Response

**Code:** `200`

**Body (JSON string):**

On full success:

```json
{
  "Uploaded": "Ok",
  "ImageId": "...",
  "Filepath": "..."
}
```

Otherwise often:

```json
{
  "Uploaded": "No",
  "Filepath": "..."
}
```

**Note:** Successful `401` responses include CORS; **`200` response does not** set `Access-Control-Allow-Origin` in code (same pattern as `uploadInvoice`).

---

## Behaviour details

- Initial **`Thread.sleep(200)`**.
- `ImageStoreService.generateImageId`, `setImageDetails`, activity log on success.
