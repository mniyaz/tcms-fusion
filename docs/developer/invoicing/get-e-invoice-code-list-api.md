---
id: get-e-invoice-code-list-api
title: Get E-Invoice Code List API
sidebar_label: E-Invoice Code List
---

## Introduction

Returns **e-invoice classification codes** and **unit** lists from `EInvoiceService` for populating e-invoice UI fields. Both lists are embedded in one JSON object.

**Source:** `InvoiceHomePageAPI.getEInvoiceCodeList` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getEInvoiceCodeList/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (entity is a **JSON object string**) |

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

## Behaviour

- `eInvoiceService.getClassificationCodeList()` → `List<String>`
- `eInvoiceService.getUnitList()` → `List<String>`
- Response JSON: `classificationCodeList` and `unitList` as JSON arrays.

---

## Success Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{
  "classificationCodeList": ["...", "..."],
  "unitList": ["...", "..."]
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getEInvoiceCodeList/alice/secretKey HTTP/1.1
Host: {base}
```
