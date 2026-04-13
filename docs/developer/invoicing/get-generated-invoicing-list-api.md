---
id: get-generated-invoicing-list-api
title: Get Generated Invoicing List API
sidebar_label: Get Generated Invoicing List
---

## Introduction

Returns rows from the **`invoice_original`** table for the current tenant, filtered by **status** (for example draft or generated invoices), optional **customer**, and **invoice date** range. Each row is enriched with a **`bookingIdList`** of related booking identifiers from the `invoicing` table. This endpoint backs the draft and generated invoice DataTables on the invoicing UI.

**Source:** `InvoiceHomePageAPI.getGeneratedInvoicingList` — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java` (`@Path("invoicehome")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/getGeneratedInvoicingList/{invoiceStatus}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces** | `application/json` |

Prefix your deployment base URL; Jersey resources are exposed under `/rest` as used by `invoice.xhtml`.

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceStatus` | `String` | Yes | Must match `invoice_original.STATUS`. Common values: **`DRAFT`** (draft invoices) and **`GENERATED`** (posted/generated invoices), as used by the UI (`TmsConstants.DRAFT`, `TmsConstants.GENERATED`). Other status values are accepted if present in your data. |
| `customerId` | `String` | Yes | Filter by `CUSTOMER_ID`. Send the literal string **`null`** to skip the customer filter and return all rows matching status and date rules. |
| `fromDate` | `String` | Yes | Start of the invoice date range, parsed as **`yyyy-MM-dd`**. Normalised to start of day (00:00:00.000) via `MasterAPI.convertFromDateString`. |
| `toDate` | `String` | Yes | End of the invoice date range, parsed as **`yyyy-MM-dd`**. Normalised to end of day (23:59:59.999) via `MasterAPI.convertToDateString`. |
| `officeBranch` | `String` | Yes | Path segment kept for consistency with other invoice-home URLs. Existing clients use **`default`**. Not passed into the service layer in the current Java method. |
| `userName` | `String` | Yes | Username for `authKey` validation. |
| `authKey` | `String` | Yes | Validated with `TmsUtil.checkIfAuthKeyIsValid` for the tenant resolved from the request. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (empty body; `Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

Tenant scope: `TmsUtil.getTenantIdFromServlet(request)`.

---

## Behaviour and Filtering

Implementation: `InvoiceService.getGeneratedInvoicingListWithDateFilter(status, fromDate, toDate, customerId, tenantId)`.

- **Date range:** When both `fromDate` and `toDate` are non-null after parsing, rows are restricted where **`INVOICE_DATE`** is between the formatted start and end timestamps (inclusive of the full calendar days).
- **Customer:** If `customerId` is not null and not empty, the query adds **`CUSTOMER_ID = '{customerId}'`**. The literal path value `null` clears this filter.
- **Ordering:**
  - If `invoiceStatus` equals **`DRAFT`** (case-insensitive), results are ordered by **`INVOICE_NUMBER`**.
  - Otherwise, results are ordered by **`INVOICE_DATE DESC`** (newest first).
- **Booking IDs:** After the query, each `InvoiceOriginal` has **`bookingIdList`** set from related `invoicing` rows for that invoice number (`getAllBookingIdFromInvoicing`).

The SQL projection includes standard invoice fields plus e-invoice-related columns where defined in the schema (for example submission UID/status), mapped into `InvoiceOriginal`.

---

## Success Response

**Code:** `200 OK`  

**Content-Type:** `application/json`

| Field | Type | Description |
| :--- | :--- | :--- |
| `data` | `Array` | List of `InvoiceOriginal` objects serialised with Gson. |

### Example shape (illustrative)

```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-2026-001",
      "bookingId": "...",
      "invoiceType": "INDIVIDUAL",
      "customerId": "CUST01",
      "customerName": "Example Customer",
      "bookedDate": "2026-04-01T10:00:00",
      "invoiceDate": "2026-04-02T00:00:00",
      "status": "GENERATED",
      "amount": "100.00",
      "grandTotal": "106.00",
      "remarks": "",
      "mailSentStatus": "",
      "fileId": "",
      "fileName": "",
      "discount": 0,
      "discountTotal": "0",
      "gstDiscount": 0,
      "gstDiscountTotal": "0",
      "generatedBy": "user1",
      "generatedAcknowledgementOrPostlajuNo": "",
      "knockedOff": false,
      "accountId": "",
      "creditTerms": "",
      "comment": "",
      "invoicePdfId": "",
      "colorCode": 0,
      "bookingIdList": ["BK001", "BK002"],
      "...": "other Gson-serialised fields (transient lists may be null or omitted)"
    }
  ]
}
```

Exact property names and types follow the `InvoiceOriginal` bean and Gson defaults. Empty results: `"data": []`.

**Headers:** `Access-Control-Allow-Origin: *` on success.

---

## Example Requests

All invoices in status **GENERATED** for April 2026 (any customer):

```http
GET /rest/invoicehome/getGeneratedInvoicingList/GENERATED/null/2026-04-01/2026-04-30/default/myuser/myAuthKeyValue HTTP/1.1
Host: {base}
```

Draft invoices for one customer:

```http
GET /rest/invoicehome/getGeneratedInvoicingList/DRAFT/CUST01/2026-04-01/2026-04-30/default/myuser/myAuthKeyValue HTTP/1.1
Host: {base}
```

Percent-encode path segments that contain reserved characters.

---

## Related UI References

- `invoice.xhtml` uses **`DRAFT`** for the new draft invoice table and **`GENERATED`** for the generated invoice table, with **`default`** for `officeBranch` and date inputs in `yyyy-MM-dd` format.
