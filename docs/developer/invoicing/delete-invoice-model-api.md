---
id: delete-invoice-model-api
title: Delete Invoice Model API
sidebar_label: Delete Invoice Model
---

## Introduction

Deletes a single **invoice line** (`InvoiceModel`) associated with a draft/generated invoice context. The request supplies both **`invoiceModel`** and **`invoiceData`** (`InvoiceOriginal`); the code calls **`invoiceModel.setInvoiceNumber(invoiceOriginal)`** before invoking `InvoiceService.deleteInvoiceModel` with a one-element list.

**Source:** `InvoiceHomePageAPI.deleteInvoiceModel` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

**No** `checkIfAuthKeyIsValid` — anyone who can reach the endpoint can trigger deletion logic for the tenant inferred from the request.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/deleteInvoiceModel` |
| **Method** | `POST` |
| **Consumes** | Raw JSON body |
| **Produces** | `text/plain` (JSON string entity) |

---

## Request Body (JSON)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceModel` | `Object` | Yes | Gson deserialised to **`InvoiceModel`**. |
| `invoiceData` | `Object` | Yes | Gson deserialised to **`InvoiceOriginal`**; linked to the model via `setInvoiceNumber`. |

---

## Behaviour

`deleted = invoiceService.deleteInvoiceModel(toDeleteInvoiceModel, false, tenantId)` with a singleton list containing the prepared `invoiceModel`.

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

---

## Example Request

```http
POST /rest/invoicehome/deleteInvoiceModel HTTP/1.1
Host: {base}
Content-Type: application/json

{
  "invoiceModel": {
    "id": 10,
    "...": "line fields"
  },
  "invoiceData": {
    "invoiceNumber": "INV-DRAFT-1",
    "customerId": "C1",
    "...": "header fields"
  }
}
```
