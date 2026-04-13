---
id: get-courier-list-api
title: Get Courier (Postlaju) List API
sidebar_label: Courier List
---

## Introduction

Returns **`Postlaju`** (courier) records for the tenant with status **`INACTIVE`**, filtered by **date** range and **courier number** via `PostlajuService.getPostlajuListWithDateFilter`.

**Source:** `InvoiceHomePageAPI.getCourierList` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`.

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getCourierList/{fromDate}/{toDate}/{courierNumber}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fromDate` | `String` | Yes | `yyyy-MM-dd`. |
| `toDate` | `String` | Yes | `yyyy-MM-dd`. |
| `courierNumber` | `String` | Yes | Filter (e.g. Postlaju number). |
| `userName` | `String` | Yes | Auth. |
| `authKey` | `String` | Yes | Auth. |

---

## Success Response

```json
{ "data": [ { "...": "Postlaju fields" } ] }
```

---

## Example Request

```http
GET /rest/invoicehome/getCourierList/2026-04-01/2026-04-30/PLJ001/alice/secretKey HTTP/1.1
Host: {base}
```
