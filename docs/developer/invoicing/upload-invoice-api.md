---
id: upload-invoice-api
title: Upload Invoice Document API
sidebar_label: Upload Invoice
---

## Introduction

Accepts **multipart form data** with an invoice number, user id, and file bytes, wraps them in **`PodQueueObjectHelper`**, and enqueues processing via **`InvoiceQueue.UploadInvoice`**. The handler sleeps **200 ms** before processing (rate/smoothing). Used by the invoicing UI to attach documents to an invoice.

**Source:** `InvoiceHomePageAPI.uploadMultipart` (`@Path("uploadInvoice")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

**No** auth validation in this method. Ensure uploads are restricted by reverse proxy, session filters, or application firewall rules.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/uploadInvoice` |
| **Method** | `POST` |
| **Consumes** | `multipart/form-data` |
| **Produces** | `text/plain` (JSON string entity) |

---

## Form Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | Text | Yes | Treated as the logical id for storage path (`PodQueueObjectHelper.setBookingId` uses this field name). |
| `userId` | Text | Yes | Stored on the helper object. |
| `invoiceUploadFile` | File | Yes | Binary body read via `BodyPartEntity` → `IOUtils.toByteArray`. |

---

## Behaviour

1. `Thread.sleep(200)`.
2. Reads fields from `FormDataMultiPart`.
3. `fileToPath = TmsConstants.SINGLE_INVOICING_SERVER_ROOT_PATH + invoiceNumber` (informational string in response).
4. `InvoiceQueue.UploadInvoice(objectHelper, tenantId)` → `sentToQueue`.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

On queue success:

```json
{
  "Uploaded": "Ok",
  "Filepath": "/path/prefix/{invoiceNumber}"
}
```

On failure:

```json
{
  "Uploaded": "No",
  "Filepath": "/path/prefix/{invoiceNumber}"
}
```

**Note:** Unlike most invoice-home endpoints, this response **does not** add `Access-Control-Allow-Origin: *` in the current code.

---

## Example Request

```http
POST /rest/invoicehome/uploadInvoice HTTP/1.1
Host: {base}
Content-Type: multipart/form-data; boundary=----Boundary

------Boundary
Content-Disposition: form-data; name="invoiceNumber"

INV-2026-001
------Boundary
Content-Disposition: form-data; name="userId"

42
------Boundary
Content-Disposition: form-data; name="invoiceUploadFile"; filename="scan.pdf"
Content-Type: application/pdf

<binary data>
------Boundary--
```
