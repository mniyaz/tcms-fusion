---
id: get-credit-term-list-api
title: Get Credit Term List API
sidebar_label: Get Credit Term List
---

## Introduction

Returns all **credit terms** for the current tenant as a JSON array, loaded via `CreditTermService.getCreditTermList(tenantId)`. Used by invoice forms to populate credit-term dropdowns (for example `invoiceForm.xhtml`).

**Source:** `InvoiceHomePageAPI.getFromAccountList` (mapped to path **`getCreditTermList`**) (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

`authKey` (and `officeBranch`) appear in the URL but **`checkIfAuthKeyIsValid` is not invoked**. Treat as an internal or trusted call path unless another layer enforces authentication.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getCreditTermList/{officeBranch}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (entity is a **JSON array string**, not wrapped in `{ "data": ... }`) |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `officeBranch` | `String` | Yes | Convention: `default`; **not** read in the Java method (still required in the path). |
| `authKey` | `String` | Yes | Convention: placeholder or real key; **not** validated in code. |

---

## Behaviour

Executes `creditTermService.getCreditTermList(TmsUtil.getTenantIdFromServlet(request))` and returns `gson.toJson(creditTermLIst)`.

---

## Success Response

**Code:** `200 OK`

**Body:** Gson serialisation of `List<CreditTerm>` — a **top-level JSON array**, for example:

```json
[
  {
    "id": 1,
    "termCode": "...",
    "description": "...",
    "...": "fields from CreditTerm entity"
  }
]
```

Exact property names follow the `CreditTerm` model and Gson defaults.

**Headers:** `Access-Control-Allow-Origin: *`

---

## Example Request

```http
GET /rest/invoicehome/getCreditTermList/default/29384729 HTTP/1.1
Host: {base}
```
