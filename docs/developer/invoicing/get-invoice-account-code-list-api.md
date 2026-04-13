---
id: get-invoice-account-code-list-api
title: Get Invoice Account Code List API
sidebar_label: Invoice Account Codes
---

## Introduction

Returns **sales category / ledger sub-account** rows used when assigning account codes on invoices: `InvoiceService.getAllSalesCategories(tenantId)` as a Gson JSON array of **`LedgerSubAccount`**.

**Source:** `InvoiceHomePageAPI.getInvoiceAccountCodeList` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getInvoiceAccountCodeList/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (entity is a **JSON array string**) |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Success Response

**Code:** `200 OK`

**Body:** Top-level JSON array, for example:

```json
[
  {
    "id": 1,
    "accountCode": "...",
    "description": "...",
    "...": "LedgerSubAccount fields per Gson"
  }
]
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getInvoiceAccountCodeList/alice/secretKey HTTP/1.1
Host: {base}
```
