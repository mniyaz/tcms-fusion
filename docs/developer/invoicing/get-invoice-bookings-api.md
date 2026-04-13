---
id: get-invoice-bookings-api
title: Get Invoice Bookings API
sidebar_label: Get Invoice Bookings
---

## Introduction

Returns **pending** invoice booking rows from the `invoicing` table for the current tenant, filtered by invoice type, optional customer, and delivery date range. Results are sorted by invoice date in **descending** order (newest first). This endpoint backs the invoice and summary booking tables on the invoicing UI.

**Source:** `InvoiceHomePageAPI.getInvoiceBookings` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getInvoiceBookings/{invoiceType}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

The application base URL (scheme, host, port, context path) must be prefixed; the JAX-RS servlet is mounted under `/rest` as used by the existing invoicing pages (for example `invoice.xhtml`).

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceType` | `String` | Yes | Value stored in `invoicing.INVOICE_TYPE`. The UI commonly uses `INDIVIDUAL` for single bookings and `Summary` for summary bookings (must match how rows are stored in your tenant). |
| `customerId` | `String` | Yes | Customer identifier to filter by. Send the literal string `null` (URL-encoded if needed) to **omit** the customer filter and return all matching pending rows for the type and date range. |
| `fromDate` | `String` | Yes | Start of the date range, parsed as **`yyyy-MM-dd`**. The server normalises this to the start of that calendar day (00:00:00.000). |
| `toDate` | `String` | Yes | End of the date range, parsed as **`yyyy-MM-dd`**. The server normalises this to the end of that calendar day (23:59:59.999). |
| `officeBranch` | `String` | Yes | Present in the path for URL compatibility with other invoice-home APIs. Existing clients pass `default`. This value is **not** passed into the invoicing query in the current implementation. |
| `userName` | `String` | Yes | Authenticated username; used with `authKey` for validation. |
| `authKey` | `String` | Yes | Session/auth key validated via `TmsUtil.checkIfAuthKeyIsValid` for the resolved tenant. |

---

## Authentication

Authentication uses the same **username + authKey** pattern as other `/rest/invoicehome` resources. The tenant is taken from the servlet request (`TmsUtil.getTenantIdFromServlet`).

| Condition | HTTP status |
| :--- | :--- |
| Invalid or missing credentials | `401 Unauthorized` (empty body; `Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour and Filtering

- **Status:** Only rows with status **`PENDING`** (`TmsConstants.PENDING`) are returned.
- **Date filter:** When both `fromDate` and `toDate` parse successfully, the service restricts rows where **`DELIVERY_DATE`** falls between the computed start and end instants (inclusive of the full days). The underlying query is built in `InvoiceService.getInvoicingListWithDateFilter`.
- **Customer filter:** If `customerId` is not the literal `null`, rows are further restricted to that `CUSTOMER_ID`.
- **Sorting:** `InvoiceDateComparator` is applied in **reverse** order so newer items appear first.

---

## Success Response

**Code:** `200 OK`

**Content-Type:** `application/json`

Body is a JSON object with a single property:

| Field | Type | Description |
| :--- | :--- | :--- |
| `data` | `Array` | Array of invoicing objects, each serialised from the `Invoicing` entity (Gson → JSON array wrapped in the response object). |

### Example shape (illustrative)

Field names in each element follow the Java bean / Gson naming for `Invoicing`, for example:

```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-1001",
      "bookingId": "BK-001",
      "invoiceType": "INDIVIDUAL",
      "customerId": "CUST01",
      "customerName": "Example Customer",
      "status": "PENDING",
      "deliveryDate": "2026-04-01T08:00:00",
      "cost": 150.0,
      "qty": 1.0,
      "pickup": "...",
      "delivery": "...",
      "truck": "...",
      "driver": "...",
      "tempInvoiceNumber": "...",
      "createdDate": "...",
      "description": "...",
      "...": "additional columns and transient fields as serialised by Gson"
    }
  ]
}
```

Exact properties depend on the `Invoicing` model and Gson defaults (dates typically as ISO-8601-style strings). Empty lists return `"data": []`.

**Headers:** Successful responses include `Access-Control-Allow-Origin: *`.

---

## Example Request

Replace `{base}`, dates, customer, and credentials with real values:

```http
GET /rest/invoicehome/getInvoiceBookings/INDIVIDUAL/null/2026-04-01/2026-04-30/default/myuser/myAuthKeyValue HTTP/1.1
Host: {base}
```

Example with a specific customer:

```http
GET /rest/invoicehome/getInvoiceBookings/Summary/CUST01/2026-04-01/2026-04-30/default/myuser/myAuthKeyValue HTTP/1.1
Host: {base}
```

**Note:** If any path segment contains reserved characters (for example `/` or `?`), it must be **percent-encoded** in the URL.

---

## Related UI References

- `invoice.xhtml` loads this endpoint for the invoice booking table (`INDIVIDUAL`) and summary booking table (`Summary`), using `default` for `officeBranch` and date values from the date pickers (`yyyy-MM-dd`).
