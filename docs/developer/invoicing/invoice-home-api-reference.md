---
id: invoice-home-api-reference
title: Invoice Home API Reference
sidebar_label: Invoice Home (all APIs)
---

## Overview

JAX-RS resource **`InvoiceHomePageAPI`** (`@Path("invoicehome")`). URLs are relative to **`/rest/invoicehome`**.

### Source

**Transport Supply** — `transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java` (**37** resource methods: invoicing, acknowledgements, courier/Postlaju, e-invoice metadata lists, cash bookings, invoice summary tab).

| Concern | Detail |
| :--- | :--- |
| **Base path** | `/rest/invoicehome` |
| **Tenant** | `TmsUtil.getTenantIdFromServlet(request)` |
| **CORS** | Many responses set `Access-Control-Allow-Origin: *` (exceptions noted in individual guides, e.g. some multipart uploads). |

### Authentication summary

Most endpoints use **`TmsUtil.checkIfAuthKeyIsValid(userName, authKey, tenantId)`** (or **`userId`** instead of `userName` where documented). Several legacy GETs **do not** validate keys — see each guide’s **Security note**.

### Related APIs

- **[Generate Invoice API](./generate-invoice-api-reference.md)** — `GenerateInvoiceAPI` under **`/rest/generateinvoice`**: generate/save/view/update single, summary, and blank invoices, draft merges, and print JSON payloads.

---

## Complete endpoint list (37)

Paths under **`/rest/invoicehome`**. POST subpaths have no leading slash in `@Path`.

| # | Method | Path | Java method | Doc |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/getInvoiceBookings/{invoiceType}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` | `getInvoiceBookings` | [get-invoice-bookings-api.md](./get-invoice-bookings-api.md) |
| 2 | `GET` | `/printInvoice/{bookingId}/{invoiceNumber}/{userName}/{authKey}` | `printInvoice` | [print-invoice-pdf-api.md](./print-invoice-pdf-api.md) |
| 3 | `GET` | `/getGeneratedInvoicingList/{invoiceStatus}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` | `getGeneratedInvoicingList` | [get-generated-invoicing-list-api.md](./get-generated-invoicing-list-api.md) |
| 4 | `POST` | `holdSummaryInvoice` | `holdSummaryInvoice` | [hold-summary-invoice-api.md](./hold-summary-invoice-api.md) |
| 5 | `GET` | `/deleteinvoice/{bookingId}/{userId}/{officeBranch}/{authKey}` | `deleteInvoice` | [delete-invoice-booking-api.md](./delete-invoice-booking-api.md) |
| 6 | `GET` | `/getCreditTermList/{officeBranch}/{authKey}` | `getFromAccountList` | [get-credit-term-list-api.md](./get-credit-term-list-api.md) |
| 7 | `GET` | `/autoFillCustomerAddress/{customerId}/{officeBranch}/{authKey}` | `autoFillCustomerAddress` | [auto-fill-customer-address-api.md](./auto-fill-customer-address-api.md) |
| 8 | `POST` | `deleteGeneratedInvoice` | `deleteGeneratedInvoice` | [delete-generated-invoice-api.md](./delete-generated-invoice-api.md) |
| 9 | `POST` | `revertGeneratedInvoice` | `revertFromGeneratedInvoice` | [revert-generated-invoice-api.md](./revert-generated-invoice-api.md) |
| 10 | `POST` | `submitEInvoice` | `submitEInvoice` | [submit-e-invoice-api.md](./submit-e-invoice-api.md) |
| 11 | `POST` | `revertSIDrafts` | `revertFromSIDrafts` | [revert-si-drafts-api.md](./revert-si-drafts-api.md) |
| 12 | `GET` | `/getInvoiceUploadStatus/{invoiceNumber}/{userId}/{officeBranch}/{authKey}` | `getPoduploadstatus` | [get-invoice-upload-status-api.md](./get-invoice-upload-status-api.md) |
| 13 | `POST` | `uploadInvoice` | `uploadMultipart` | [upload-invoice-api.md](./upload-invoice-api.md) |
| 14 | `POST` | `holdGeneratedInvoice` | `holdGeneratedInvoice` | [hold-generated-invoice-api.md](./hold-generated-invoice-api.md) |
| 15 | `GET` | `/getPendingSummaryInvoicingForCustomer/{customerId}/{officeBranch}/{userName}/{authKey}` | `getPendingSummaryInvoicingForCustomer` | [get-pending-summary-invoicing-api.md](./get-pending-summary-invoicing-api.md) |
| 16 | `POST` | `deleteInvoiceModel` | `deleteInvoiceModel` | [delete-invoice-model-api.md](./delete-invoice-model-api.md) |
| 17 | `POST` | `deleteBookingFromDraft` | `deleteBookingFromDraft` | [delete-booking-from-draft-api.md](./delete-booking-from-draft-api.md) |
| 18 | `GET` | `/getInvoiceSaveStatus/{tempInvoiceNumber}/{userId}/{officeBranch}/{authKey}` | `getInvoiceSaveStatus` | [get-invoice-save-status-api.md](./get-invoice-save-status-api.md) |
| 19 | `POST` | `approveGeneratedInvoice` | `approveGeneratedInvoice` | [approve-generated-invoice-api.md](./approve-generated-invoice-api.md) |
| 20 | `POST` | `changeCustomerFromInvoicing` | `changeCustomerNameFromInvoicing` | [change-customer-from-invoicing-api.md](./change-customer-from-invoicing-api.md) |
| 21 | `POST` | `removeUploadedDocument` | `removeUploadedDocumentFromGeneratedInvoice` | [remove-uploaded-document-api.md](./remove-uploaded-document-api.md) |
| 22 | `GET` | `/downloadExcelReport/{invoiceNumber}/{userName}/{authKey}` | `downloadsstreport` | [download-excel-report-api.md](./download-excel-report-api.md) |
| 23 | `GET` | `/getInvoiceAccountCodeList/{userName}/{authKey}` | `getInvoiceAccountCodeList` | [get-invoice-account-code-list-api.md](./get-invoice-account-code-list-api.md) |
| 24 | `GET` | `/getEInvoiceCodeList/{userName}/{authKey}` | `getEInvoiceCodeList` | [get-e-invoice-code-list-api.md](./get-e-invoice-code-list-api.md) |
| 25 | `GET` | `/getAcknowledgementList/{fromDate}/{toDate}/{ackNumber}/{userName}/{authKey}` | `getAcknowledgementList` | [get-acknowledgement-list-api.md](./get-acknowledgement-list-api.md) |
| 26 | `GET` | `/getCourierList/{fromDate}/{toDate}/{courierNumber}/{userName}/{authKey}` | `getCourierList` | [get-courier-list-api.md](./get-courier-list-api.md) |
| 27 | `GET` | `/getInvoiceSummaryTabList/{fromDate}/{toDate}/{ackOrCourierNumber}/{userName}/{authKey}` | `getInvoiceSummaryTabList` | [get-invoice-summary-tab-list-api.md](./get-invoice-summary-tab-list-api.md) |
| 28 | `GET` | `/getCashInvoiceBookings/{invoiceType}/{customerId}/{fromDate}/{toDate}/{officeBranch}/{userName}/{authKey}` | `getCashInvoiceBookings` | [get-cash-invoice-bookings-api.md](./get-cash-invoice-bookings-api.md) |
| 29 | `POST` | `revertFromAcknowledgement` | `revertFromAcknowledgement` | [revert-from-acknowledgement-api.md](./revert-from-acknowledgement-api.md) |
| 30 | `POST` | `revertFromCourier` | `revertFromCourier` | [revert-from-courier-api.md](./revert-from-courier-api.md) |
| 31 | `POST` | `revertFromSummaryTab` | `revertFromSummaryTab` | [revert-from-summary-tab-api.md](./revert-from-summary-tab-api.md) |
| 32 | `POST` | `generateAcknowledgement` | `generateAcknowledgement` | [generate-acknowledgement-api.md](./generate-acknowledgement-api.md) |
| 33 | `POST` | `generateCourier` | `generateCourier` | [generate-courier-api.md](./generate-courier-api.md) |
| 34 | `POST` | `uploadAcknowledgementDocument` | `uploadAcknowledgementDocument` | [upload-acknowledgement-document-api.md](./upload-acknowledgement-document-api.md) |
| 35 | `POST` | `uploadCourierDocument` | `uploadCourierDocument` | [upload-courier-document-api.md](./upload-courier-document-api.md) |
| 36 | `POST` | `saveAcknowledgement` | `saveAcknowledgement` | [save-acknowledgement-api.md](./save-acknowledgement-api.md) |
| 37 | `POST` | `saveCourier` | `saveCourier` | [save-courier-api.md](./save-courier-api.md) |

---

## Detailed documentation (all guides)

| Topic | Guide |
| :--- | :--- |
| Get invoice bookings (pending) | [get-invoice-bookings-api.md](./get-invoice-bookings-api.md) |
| Print invoice PDF | [print-invoice-pdf-api.md](./print-invoice-pdf-api.md) |
| Get generated invoicing list | [get-generated-invoicing-list-api.md](./get-generated-invoicing-list-api.md) |
| Hold summary invoice | [hold-summary-invoice-api.md](./hold-summary-invoice-api.md) |
| Delete invoice booking | [delete-invoice-booking-api.md](./delete-invoice-booking-api.md) |
| Credit term list | [get-credit-term-list-api.md](./get-credit-term-list-api.md) |
| Auto-fill customer address | [auto-fill-customer-address-api.md](./auto-fill-customer-address-api.md) |
| Delete generated invoice | [delete-generated-invoice-api.md](./delete-generated-invoice-api.md) |
| Revert generated invoice | [revert-generated-invoice-api.md](./revert-generated-invoice-api.md) |
| Submit e-invoice | [submit-e-invoice-api.md](./submit-e-invoice-api.md) |
| Revert SI drafts | [revert-si-drafts-api.md](./revert-si-drafts-api.md) |
| Invoice upload status | [get-invoice-upload-status-api.md](./get-invoice-upload-status-api.md) |
| Upload invoice document | [upload-invoice-api.md](./upload-invoice-api.md) |
| Hold generated invoice | [hold-generated-invoice-api.md](./hold-generated-invoice-api.md) |
| Pending summary invoicing | [get-pending-summary-invoicing-api.md](./get-pending-summary-invoicing-api.md) |
| Delete invoice model line | [delete-invoice-model-api.md](./delete-invoice-model-api.md) |
| Remove booking from draft | [delete-booking-from-draft-api.md](./delete-booking-from-draft-api.md) |
| Invoice save status | [get-invoice-save-status-api.md](./get-invoice-save-status-api.md) |
| Approve generated invoice | [approve-generated-invoice-api.md](./approve-generated-invoice-api.md) |
| Change customer | [change-customer-from-invoicing-api.md](./change-customer-from-invoicing-api.md) |
| Remove uploaded document | [remove-uploaded-document-api.md](./remove-uploaded-document-api.md) |
| Download Excel report | [download-excel-report-api.md](./download-excel-report-api.md) |
| Invoice account codes | [get-invoice-account-code-list-api.md](./get-invoice-account-code-list-api.md) |
| E-invoice code list | [get-e-invoice-code-list-api.md](./get-e-invoice-code-list-api.md) |
| Acknowledgement list | [get-acknowledgement-list-api.md](./get-acknowledgement-list-api.md) |
| Courier list | [get-courier-list-api.md](./get-courier-list-api.md) |
| Invoice summary tab list | [get-invoice-summary-tab-list-api.md](./get-invoice-summary-tab-list-api.md) |
| Cash invoice bookings | [get-cash-invoice-bookings-api.md](./get-cash-invoice-bookings-api.md) |
| Revert from acknowledgement | [revert-from-acknowledgement-api.md](./revert-from-acknowledgement-api.md) |
| Revert from courier | [revert-from-courier-api.md](./revert-from-courier-api.md) |
| Revert from summary tab | [revert-from-summary-tab-api.md](./revert-from-summary-tab-api.md) |
| Generate acknowledgement | [generate-acknowledgement-api.md](./generate-acknowledgement-api.md) |
| Generate courier | [generate-courier-api.md](./generate-courier-api.md) |
| Upload acknowledgement PDF | [upload-acknowledgement-document-api.md](./upload-acknowledgement-document-api.md) |
| Upload courier PDF | [upload-courier-document-api.md](./upload-courier-document-api.md) |
| Save acknowledgement | [save-acknowledgement-api.md](./save-acknowledgement-api.md) |
| Save courier | [save-courier-api.md](./save-courier-api.md) |

---

## Quick reference

| Method | Path / name | Auth validated |
| :--- | :--- | :--- |
| GET | `/getInvoiceBookings/...` | Yes |
| GET | `/printInvoice/...` | Yes |
| GET | `/getGeneratedInvoicingList/...` | Yes |
| POST | `holdSummaryInvoice` | Yes |
| GET | `/deleteinvoice/...` | **No** |
| GET | `/getCreditTermList/...` | **No** |
| GET | `/autoFillCustomerAddress/...` | **No** |
| POST | `deleteGeneratedInvoice` | Yes |
| POST | `revertGeneratedInvoice` | Yes |
| POST | `submitEInvoice` | Yes |
| POST | `revertSIDrafts` | Yes |
| GET | `/getInvoiceUploadStatus/...` | **No** |
| POST | `uploadInvoice` | **No** |
| POST | `holdGeneratedInvoice` | Yes |
| GET | `/getPendingSummaryInvoicingForCustomer/...` | Yes |
| POST | `deleteInvoiceModel` | **No** |
| POST | `deleteBookingFromDraft` | Yes |
| GET | `/getInvoiceSaveStatus/...` | **No** |
| POST | `approveGeneratedInvoice` | Yes |
| POST | `changeCustomerFromInvoicing` | Yes |
| POST | `removeUploadedDocument` | Yes |
| GET | `/downloadExcelReport/...` | Yes |
| GET | `/getInvoiceAccountCodeList/...` | Yes |
| GET | `/getEInvoiceCodeList/...` | Yes |
| GET | `/getAcknowledgementList/...` | Yes |
| GET | `/getCourierList/...` | Yes |
| GET | `/getInvoiceSummaryTabList/...` | Yes |
| GET | `/getCashInvoiceBookings/...` | Yes |
| POST | `revertFromAcknowledgement` | Yes |
| POST | `revertFromCourier` | Yes |
| POST | `revertFromSummaryTab` | Yes |
| POST | `generateAcknowledgement` | Yes |
| POST | `generateCourier` | Yes |
| POST | `uploadAcknowledgementDocument` | Yes (`userId` + key) |
| POST | `uploadCourierDocument` | Yes (`userId` + key) |
| POST | `saveAcknowledgement` | Yes |
| POST | `saveCourier` | Yes |

---

## Implementation source

`transportsupplyproject/src/in/greenorange/api/invoice/InvoiceHomePageAPI.java`
