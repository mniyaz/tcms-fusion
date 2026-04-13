---
id: delete-generated-invoice-api
title: Delete Generated Invoice API
sidebar_label: Delete Generated Invoice
---

## Introduction

**Cancels** a generated invoice: if an **e-invoice UUID** exists, calls the e-invoice cancel flow (`EInvoiceService.cancelEInvoice`) and may send a cancel notification email. When cancel preconditions are satisfied (successful cancel, already cancelled, or no UUID with empty status branch per code), the service **removes** the generated invoice data via `InvoiceService.delInvoiceAndBookingFromGenerated`, writes an **`InvoiceSummary`** row with **cancelled** status, and logs activity.

**Source:** `InvoiceHomePageAPI.deleteGeneratedInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/deleteGeneratedInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | User id for activity log and optional mail context. |
| `userName` | `String` | Yes | Username for auth. |
| `authKey` | `String` | Yes | Auth key for tenant. |
| `cancelReason` | `String` | Yes | Reason passed to e-invoice cancel when applicable. |
| `invoiceOriginalData` | `String` | Yes | String argument to `invoiceService.getInvoiceOriginalForUpload(...)` to resolve the **`InvoiceOriginal`** row (typically invoice number or serialised key as used by the UI). |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour (high level)

1. Resolve `InvoiceOriginal` via `getInvoiceOriginalForUpload(invoiceOriginalData, tenantId)`.
2. If `eInvoiceUUID` is non-null and not empty string (note: code uses `"" != invoiceOriginal.geteInvoiceUUID()`):
   - `status = eInvoiceService.cancelEInvoice(invoiceNumber, uuid, cancelReason, tenantId)`.
   - If `status` is `Invoice Cancelled Successfully`, may call `mailService.sendEInvoiceCancelMail(...)`.
3. If  
   `status.equals("Invoice Cancelled Successfully")` **or**  
   `status.equals("The document is already cancelled.")` **or**  
   `(eInvoiceUUID == null && status.equals(TmsConstants.EMPTY_STRING))`  
   then attempt `delInvoiceAndBookingFromGenerated`; on success update activity and **`InvoiceSummary`** with `TmsConstants.INVOICE_CANCELLED`.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{"deleted":true}
```

or

```json
{"deleted":false}
```

**Headers:** `Access-Control-Allow-Origin: *`

`deleted` is `true` only when the delete path runs and the service returns success; e-invoice or business rules may leave it `false`.

---

## Example Request

```http
POST /rest/invoicehome/deleteGeneratedInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "userName": "alice",
  "authKey": "secretKey",
  "cancelReason": "Customer request",
  "invoiceOriginalData": "INV-2026-001"
}
```
