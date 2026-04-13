---
id: revert-generated-invoice-api
title: Revert Generated Invoice API
sidebar_label: Revert Generated Invoice
---

## Introduction

**Reverts** a generated invoice back into the invoicing workflow (pending/draft side) using `InvoiceService.revertToInvoiceFromGenerated`, after the same **e-invoice cancel** preconditions used by [delete generated invoice](./delete-generated-invoice-api.md). The response includes **`invoiceType`**, set from the customer’s **`invoiceFrequency`** after a successful revert, so the client can refresh the correct list (individual vs summary behaviour).

**Source:** `InvoiceHomePageAPI.revertFromGeneratedInvoice` (`@Path("revertGeneratedInvoice")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/revertGeneratedInvoice` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Yes | Acting user for activity log and mail. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |
| `revertReason` | `String` | Yes | Passed to e-invoice cancel as the reason. |
| `invoiceOriginalData` | `String` | Yes | Lookup string for `getInvoiceOriginalForUpload`. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour (high level)

1. Same e-invoice cancel branch as `deleteGeneratedInvoice` when UUID is present (including possible cancel mail).
2. When the same combined condition on `status` / empty UUID holds, calls `revertToInvoiceFromGenerated(invoiceOriginal, tenantId)`.
3. Loads `Customer` by `invoiceOriginal.getCustomerId()` and sets `invoiceType = customerDetails.getInvoiceFrequency()`.
4. On successful revert, saves activity: reverted invoice number.

---

## Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{
  "reverted": true,
  "invoiceType": "..."
}
```

- `reverted`: result of `revertToInvoiceFromGenerated`.
- `invoiceType`: customer invoice frequency string (may be empty if customer lookup or revert path does not set it as expected).

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
POST /rest/invoicehome/revertGeneratedInvoice HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "userId": "42",
  "userName": "alice",
  "authKey": "secretKey",
  "revertReason": "Regenerate invoice",
  "invoiceOriginalData": "INV-2026-001"
}
```
