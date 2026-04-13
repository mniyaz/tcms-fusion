---
id: print-invoice-pdf-api
title: Print Invoice (PDF) API
sidebar_label: Print Invoice PDF
---

## Introduction

Generates a **PDF** for a given booking and invoice number by rendering HTML from `PrintInvoicePDF.printInvoicePdf`, converting each HTML page to PDF with iText `XMLWorker`, then merging all parts with `PDFService.mergePDF`. Used for inline viewing or printing from the invoicing UI.

**Source:** `InvoiceHomePageAPI.printInvoice` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/printInvoice/{bookingId}/{invoiceNumber}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/pdf` |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `bookingId` | `String` | Yes | Booking identifier passed to the PDF generator. |
| `invoiceNumber` | `String` | Yes | Invoice number; also used as the suggested download filename. |
| `userName` | `String` | Yes | Username for auth validation. |
| `authKey` | `String` | Yes | Session/auth key validated for the tenant. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid `userName` / `authKey` | `401 Unauthorized` (empty body; `Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

Tenant: `TmsUtil.getTenantIdFromServlet(request)`.

---

## Behaviour

1. Validates credentials.
2. Calls `PrintInvoicePDF.printInvoicePdf(bookingId, invoiceNumber, tenantId)` to obtain one or more HTML strings.
3. For each HTML string: parses as XML/HTML through iText pipelines (with `Base64ImageProvider` for images), appends PDF bytes to a list.
4. Merges PDFs with `PDFService.mergePDF(files, null)`.

---

## Success Response

**Code:** `200 OK`

**Headers:**

- `Content-Type: application/pdf`
- `Content-Disposition: inline; filename="{invoiceNumber}.pdf"`
- `Access-Control-Allow-Origin: *`

**Body:** Raw PDF bytes.

---

## Error Response

**Code:** `500 Internal Server Error`

**Body:** Plain text `PDF generation failed`

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/printInvoice/BK-001/INV-2026-100/alice/secretAuthKey HTTP/1.1
Host: {base}
```

Percent-encode path segments if they contain reserved characters.
