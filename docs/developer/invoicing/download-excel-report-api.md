---
id: download-excel-report-api
title: Download Invoice Excel Report API
sidebar_label: Download Excel Report
---

## Introduction

Builds an **Excel workbook** from the template resource **`InvoiceExcelReport.xlsx`** (GrapeCity Documents for Excel), bound with tenant **Settings** (including logo from `httpUrlPhoto`), invoice line data (`InvoiceExcelReport` list), summary date range (`SummaryInvoiceFirstPage`), totals, and week/year metadata. Post-processes cells matching a regex (long runs of `A` replaced with non-breaking space). Returns binary **XLSX** as a download.

**Source:** `InvoiceHomePageAPI.downloadsstreport` (`@Path("downloadExcelReport")`).

**See also:** [Invoice Home — all endpoints](./invoice-home-api-reference.md).

---

## HTTP Endpoint

| Property | Value |
| :--- | :--- |
| **URL** | `/rest/invoicehome/downloadExcelReport/{invoiceNumber}/{userName}/{authKey}` |
| **Method** | `GET` |
| **Produces (annotation)** | `text/plain` — **incorrect** for the actual binary body; clients should treat the response as **Excel** based on `Content-Disposition` and bytes. |

---

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | `String` | Yes | Loads `InvoiceOriginal` and drives report title / data. |
| `userName` | `String` | Yes | Auth username. |
| `authKey` | `String` | Yes | Auth key. |

---

## Authentication

| Condition | HTTP status |
| :--- | :--- |
| Invalid credentials | `401 Unauthorized` (`Access-Control-Allow-Origin: *`) |
| Success | `200 OK` |

---

## Behaviour (summary)

1. `invoiceService.getInvoiceOriginalForUpload(invoiceNumber, tenantId)`.
2. `getInvoiceExcelDataList` and `summaryInvoiceFirstPageService.getSummaryInvoiceFirstPageFromNativeQuery`.
3. Opens classpath template `InvoiceExcelReport.xlsx`; registers data sources (`ds`, `title`, `data`, `minDate`, `maxDate`, `invoiceDate`, `fullTotal`, `weekYear`, etc.).
4. `workbook.processTemplate()`; cell cleanup loop; `SetLicenseKey`; `workbook.save(output)`.
5. Returns bytes with attachment filename **`SST_Report.xlsx`**.

**Failure:** IOException during template/load is caught and printed; response may be incomplete — operational monitoring should watch logs.

---

## Success Response

**Code:** `200 OK`

**Headers:**

- `Content-Disposition: attachment; filename=SST_Report.xlsx`
- `Access-Control-Allow-Origin: *`

**Body:** XLSX file bytes (binary).

---

## Example Request

```http
GET /rest/invoicehome/downloadExcelReport/INV-2026-001/alice/secretKey HTTP/1.1
Host: {base}
```

Save the response body to a `.xlsx` file or open from a client that honours `Content-Disposition`.
