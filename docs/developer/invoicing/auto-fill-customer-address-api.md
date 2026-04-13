---
id: auto-fill-customer-address-api
title: Auto-Fill Customer Address API
sidebar_label: Auto-Fill Customer Address
---

## Introduction

Loads a **Customer** by id for the current tenant, serialises it to JSON with Gson using **`SpecificClassExclusionStrategy`** (to omit configured types), then augments the object with **`mailId`** and **`attnName`** from the **primary** finance contact (`TmsConstants.CUSTOMER_FINANCE_TYPECODE_PRIMARY`) when available. Used to pre-fill invoice / customer panels in the UI.

**Source:** `InvoiceHomePageAPI.autoFillCustomerAddress` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Security note

**No** `checkIfAuthKeyIsValid` call. `officeBranch` and `authKey` are path placeholders only.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/autoFillCustomerAddress/{customerId}/{officeBranch}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `text/plain` (entity is a **JSON string** wrapping customer data) |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `customerId` | `String` | Yes | Customer identifier passed to `CustomerService.getCustomerDetails`. |
| `officeBranch` | `String` | Yes | URL convention (e.g. `default`); unused in handler. |
| `authKey` | `String` | Yes | URL convention; unused in handler. |

---

## Behaviour

1. `customerService.getCustomerDetails(customerId, tenantId)`.
2. `GsonBuilder` + `SpecificClassExclusionStrategy` → JSON object.
3. Iterates `customer.getCustomerFinance()`; for primary type code, sets:
   - `mailId` from `financeTeam.getMail()` if non-null
   - `attnName` from `financeTeam.getFullName()` if non-null
4. Wraps result: `{"data": { ... }}`.

---

## Success Response

**Code:** `200 OK`

**Body (JSON string):**

```json
{
  "data": {
    "id": "...",
    "customerName": "...",
    "mailId": "billing@example.com",
    "attnName": "Accounts Payable",
    "...": "other Customer fields per Gson exclusion rules"
  }
}
```

**Headers:** `Access-Control-Allow-Origin: *`

---

## Errors

`ParseException` / `IllegalAccessException` / `InvocationTargetException` are declared on the method; framework or wrapper behaviour determines HTTP mapping if they propagate.

---

## Example Request

```http
GET /rest/invoicehome/autoFillCustomerAddress/CUST01/default/98237942 HTTP/1.1
Host: {base}
```
