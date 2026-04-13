---
id: get-cash-invoice-bookings-api
title: Get Cash Invoice Bookings API
sidebar_label: Cash Invoice Bookings
---

## Introduction

Returns **`Invoicing`** rows for **cash / generated** booking flows using `InvoiceService.getCashInvoicingListWithDateFilter` with status **`TmsConstants.GENERATED`**, optional **customer** (`customerId` literal `null` = all), and **date** range. Results are sorted by invoice date **descending** (same comparator pattern as pending bookings).

**Source:** `InvoiceHomePageAPI.getCashInvoiceBookings` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## Path shape note

The URL includes **`{invoiceType}`** and **`{officeBranch}`**, but the Java method **does not** declare `@PathParam` for them and the service call **does not** pass `invoiceType` — only **`GENERATED`** status is used. Clients should still supply path segments (e.g. placeholder values) so the path matches the template.

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getCashInvoiceBookings/{invoiceType}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

---

## Path Parameters (contract)

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceType` | `String` | Yes | Present in URL; **not** applied in current handler logic. |
| `customerId` | `String` | Yes | Use literal `null` for no customer filter. |
| `fromDate` / `toDate` | `String` | Yes | `yyyy-MM-dd`. |
| `officeBranch` | `String` | Yes | URL placeholder (e.g. `default`); not bound in method. |
| `userName` / `authKey` | `String` | Yes | Auth. |

---

## Success Response

```json
{ "data": [ { "...": "Invoicing" } ] }
```

---

## Example Request

```http
GET /rest/invoicehome/getCashInvoiceBookings/CASH/null/2026-04-01/2026-04-30/default/alice/secretKey HTTP/1.1
Host: {base}
```
