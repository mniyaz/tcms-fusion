---
id: remove-uploaded-document-api
title: Remove Uploaded Document API
sidebar_label: Remove Uploaded Document
---

## Introduction

Clears the **uploaded document** association for a **generated invoice** by invoice number: `InvoiceService.removeUploadedDocumentFromGeneratedInvoice(invoiceNo, tenantId)`. On success, logs activity for the invoicing module.

**Source:** `InvoiceHomePageAPI.removeUploadedDocumentFromGeneratedInvoice` (`@Path("removeUploadedDocument")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/removeUploadedDocument` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Acting user for activity log. |
| `invoiceNumber` | `String` | Yes | Invoice whose upload should be removed. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

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

(`deleted` reflects service success.)

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/removeUploadedDocument HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "invoiceNumber": "INV-2026-001",
  "userName": "alice",
  "authKey": "secretKey"
}
```
