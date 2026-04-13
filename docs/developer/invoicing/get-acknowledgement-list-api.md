---
id: get-acknowledgement-list-api
title: Get Acknowledgement List API
sidebar_label: Acknowledgement List
---

## Introduction

Returns **`Acknowledgment`** rows for the tenant filtered by **inactive** status (`TmsConstants.INACTIVE`), **invoice date** range (`yyyy-MM-dd` via `convertFromDateString` / `convertToDateString`), and an **acknowledgement number** filter string passed to `AcknowledgementService.getAcknowledgementListWithDateFilter`.

**Source:** `InvoiceHomePageAPI.getAcknowledgementList` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getAcknowledgementList/{fromDate}/{toDate}/{ackNumber}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fromDate` | `String` | Yes | Range start, `yyyy-MM-dd`. |
| `toDate` | `String` | Yes | Range end, `yyyy-MM-dd`. |
| `ackNumber` | `String` | Yes | Filter for acknowledgement number (exact/partial per service SQL). |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

401 when invalid; 200 on success (`Access-Control-Allow-Origin: *`).

---

## Success Response

**Body:**

```json
{
  "data": [ { "...": "Acknowledgment entity fields" } ]
}
```

---

## Example Request

```http
GET /rest/invoicehome/getAcknowledgementList/2026-04-01/2026-04-30/ACK001/alice/secretKey HTTP/1.1
Host: {base}
```
