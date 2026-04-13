---
id: get-invoice-summary-tab-list-api
title: Get Invoice Summary Tab List API
sidebar_label: Invoice Summary Tab List
---

## Introduction

Returns **`InvoiceSummary`** rows for the **invoice summary** UI tab, filtered by **date** range and **`ackOrCourierNumber`** (acknowledgement or courier reference) through `InvoiceSummaryService.getInvoiceSummaryListWithDateFilter`.

**Source:** `InvoiceHomePageAPI.getInvoiceSummaryTabList` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getInvoiceSummaryTabList/{fromDate}/{toDate}/{ackOrCourierNumber}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fromDate` | `String` | Yes | `yyyy-MM-dd`. |
| `toDate` | `String` | Yes | `yyyy-MM-dd`. |
| `ackOrCourierNumber` | `String` | Yes | Filter for ack/courier number (service-specific). |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |

---

## Success Response

```json
{ "data": [ { "...": "InvoiceSummary fields" } ] }
```

---

## Example Request

```http
GET /rest/invoicehome/getInvoiceSummaryTabList/2026-04-01/2026-04-30/ACK-100/alice/secretKey HTTP/1.1
Host: {base}
```
