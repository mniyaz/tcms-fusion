---
sidebar_position: 1
---

# Petty Cash APIs

This document outlines the APIs located in `PettyCashAPI.java` that manage different types of vouchers. The core voucher types handled by these APIs include:

- **Petty cash** (`PETTY_CASH_VOUCHER = "Petty cash"`)
- **Claims** (`PETTY_CASH_VOUCHER_CLAIMS = "Claims"`)
- **Cash book** (`CASH_BOOK_VOUCHER = "Cash book"`)
- **Cash Advance** (`CASH_ADVANCE = "Cash Advance"`)

All endpoints are accessed under the base path `/pettycash`.

> All requests generally require authorization parameters (`authKey`, `officeBranch`, etc.) to process data under specific tenants.

## Base JSON Model (Voucher)

The requests generally expect a nested `pettycashvoucher` object containing `PettyCashBreakDown` items. Note that certain fields like `typeOfVoucher` might be overridden inside the API.

```json
{
  "authKey": "tenant_auth_string",
  "branch": "HQ",
  "edit": false,
  "pettycashvoucher": {
    "voucherNumber": "string",
    "typeOfVoucher": "string",
    "voucherDate": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    "paidTo": "string",
    "paidBy": "string",
    "truckNo": "string",
    "tripId": "string",
    "currency": "string",
    "amount": "string",
    "remarks": "string",
    "approvedBy": "string",
    "paymentMode": "string",
    "status": "string",
    "issuedBy": "string",
    "driverName": "string",
    "chequeTransferNo": "string",
    "chequeDate": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    "bankId": "string",
    "pettyCashBreakDown": [
      {
        "accountCode": "string",
        "category": "string",
        "amount": "string",
        "description": "string",
        "gst": false,
        "taxAmount": "string",
        "subTotal": "string",
        "financeCategory": "string",
        "glCode": "string",
        "status": "string"
      }
    ]
  }
}
```

---

## Petty Cash (`PETTY_CASH_VOUCHER`)

These APIs manage standard petty cash vouchers, handling their generation, updates, and retrieval.

### Generate Petty Cash
- **Endpoint**: `POST /generatePettyCash`
- **Content-Type**: `text/plain` (Payload is actually a JSON string)
- **Request Body Payload**: See [Base JSON Model](#base-json-model-voucher). The API forces `typeOfVoucher` to `"Petty cash"`.
- **Response**:
```json
{
  "data": true
}
```

### Get Petty Cash Entries
- **Endpoint**: `GET /getPettyCashEntries/{fromDate}/{toDate}/{officeBranch}/{authKey}`
- **Response**: Returns flattened breakdown logic mapped directly into `VoucherModel` elements for easier grid bindings.
```json
{
  "data": [
    {
      "id": 101,
      "voucherNumber": "PC-1234",
      "typeOfVoucher": "Petty cash",
      "amount": "150.00",
      "category": "Office Supplies",
      "codeAndDescription": "123 Office Supplies",
      "voucherDate": "2026-02-27T10:00:00.000Z"
    }
  ]
}
```

### Get Petty Cash Entries (Financial Accounting)
- **Endpoint**: `GET /getPettyCashEntriesFA/{fromDate}/{toDate}/{officeBranch}/{authKey}`
- **Response**: Similar format to standard petty cash retrieval, but nullifies `status` fields that equal `"issued"`.
```json
{
  "data": [
    {
      "id": 102,
      "voucherNumber": "PC-1235",
      "typeOfVoucher": "Petty cash",
      "amount": "200.00",
      "category": "Travel",
      "codeAndDescription": "567 Travel",
      "status": null
    }
  ]
}
```

---

## Claims (`PETTY_CASH_VOUCHER_CLAIMS`)

These APIs handle petty cash claims that are typically linked with particular delivery trips.

### Generate Petty Cash Claims
- **Endpoint**: `POST /generatePettyCashClaims`
- **Content-Type**: `text/plain`
- **Request Body Payload**: See [Base JSON Model](#base-json-model-voucher).
- **Response**:
```json
{
  "data": true
}
```

### Get Petty Cash Entries Claims
- **Endpoint**: `GET /getPettyCashEntriesClaims/{tripId}/{officeBranch}/{authKey}`
- **Response**:
```json
{
  "data": [
    {
      "id": 103,
      "voucherNumber": "CLM-456",
      "amount": "50.00",
      "category": "Toll",
      "codeAndDescription": "987 Toll",
      "remarks": "Highway Toll"
    }
  ]
}
```

---

## Cash Book (`CASH_BOOK_VOUCHER`)

APIs oriented towards managing cash book voucher entries explicitly.

### Generate Cash Book
- **Endpoint**: `POST /generateCashBook`
- **Content-Type**: `text/plain`
- **Request Body Payload**: See [Base JSON Model](#base-json-model-voucher). It dynamically nullifies `chequeDate` if the `paymentMode` is `"Transfer"`, resolves Bank Account Codes from Bank IDs, and categorizes the voucher as `"Cash book"`. 
- **Response**:
```json
{
  "data": true
}
```

### Get Cash Book Entries (Financial Accounting)
- **Endpoint**: `GET /getCashBookEntriesFA/{fromDate}/{toDate}/{officeBranch}/{authKey}`
- **Response**: Nullifies explicit "issued" statuses in the response array.
```json
{
  "data": [
    {
      "id": 104,
      "voucherNumber": "CB-890",
      "amount": "1200.00",
      "category": "Vendor Payment",
      "status": null
    }
  ]
}
```

---

## Cash Advance (`CASH_ADVANCE`)

APIs focused heavily on issuing, checking, and summarizing cash advances for business operations and trip-related needs (like toll or diesel expenditures).

### Generate Cash Advance
- **Endpoint**: `POST /generateCashAdvance`
- **Content-Type**: `text/plain`
- **Request Body Payload**: See [Base JSON Model](#base-json-model-voucher). Validates sufficient top-up funds against temporary box balances.
- **Response**:
```json
{
  "data": true
}
// OR, if insufficient funds available:
// {
//   "data": "noamount"
// }
```

### Get Cash Advance Details
- **Endpoint**: `GET /getCashAdvanceDetails/{fromDate}/{toDate}/{officeBranch}/{authKey}`
- **Response**: Produces an array strictly mapped down to a `CashAdvanceModel` summarizing debits, credits, remarks, auto-calculating running balances and aggregating across various expense domains (tolls, general petty boxes, trip advancements, diesel).
```json
{
  "data": [
    {
      "voucherNumber": "ADV-001",
      "voucherDate": "Jan 1, 2026",
      "paidTo": "Driver John",
      "codeAndDescription": "Cash Advance",
      "debitAmount": "500.00",
      "creditAmount": null,
      "balanceAmount": "-500.00",
      "tripId": "TRP-999"
    }
  ]
}
```

---

## Trip & Voucher Operations

These APIs represent transactional operations involving specific trips, individual system vouchers, approvals, and queries needed before manipulating entries. 

### Get Petty Cash Box By Trip
- **Endpoint**: `GET /getPettyCashBoxByTrip/{tripId}/{officeBranch}/{userName}/{authKey}`
- **Description**: Returns all temporary petty cash items matching the explicit `tripId`. Validates the `userName` against `authKey`.
- **Response**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "pettyCashBoxId": "PCB-999",
      "amount": 200.50,
      "tripId": "TRP-123",
      "paidTo": "Driver Bob",
      "remarks": "On route expenses",
      "createdDate": "2026-02-27"
    }
  ]
}
```

### Get Petty Cash Voucher By Voucher Number (Edit Pre-Req)
- **Endpoint**: `GET /getPettyCashVoucherByVoucherNumber/{pettyCashId}/{officeBranch}/{authKey}`
- **Description**: Standard mechanism to fetch an existing voucher primarily used **to populate forms for editing operations**. Pulls down the exact breakdown details into a flat array mapping.
- **Response**:
```json
{
  "data": [
    {
      "id": 105,
      "amount": "150.00",
      "category": "Office Supplies",
      "codeAndDescription": "123 Office Supplies",
      "status": "approved"
    }
  ]
}
```

### Approve Petty Cash
- **Endpoint**: `POST /approvePettyCash`
- **Content-Type**: `application/json`
- **Request Body Payload**:
```json
{
  "userId": "string",
  "voucherType": "string",
  "voucherNumber": "string"
}
```
- **Description**: Commits an approval toggle against a given voucher, logging the activity directly into the financial accounting audit trail.
- **Response**:
```json
{
  "data": true
}
```

---

## Category & Balance Lookups

Endpoints dedicated to exposing metadata lists, dropdown choices like banking lists, or overall operational cash balances to display on dashboards.

### Get Petty Cash Categories
- **Endpoint**: `GET /getPettyCashCategories/{officeBranch}/{authKey}`
- **Description**: Returns a standard JSON array of `LedgerSubAccount` strings/objects available for petty cash mapping.
- **Response**:
```json
{
  "data": [
    {
      "subACode": "123",
      "subAccountGroup": "Office Supplies"
    },
    {
      "subACode": "567",
      "subAccountGroup": "Travel"
    }
  ]
}
```

### Get Petty Cash Categories Except Sales
- **Endpoint**: `GET /getPettyCashCategoriesExceptSales/{officeBranch}/{authKey}`
- **Description**: Same as above but strictly excludes sales-linked categories.
- **Response**: Identical structure to `Get Petty Cash Categories`.

### Balances and Totals
- **Get Total Petty Cash Balance**: `GET /getPettyCashBalance/{officeBranch}/{authKey}`
- **Get Temporary Box Balance**: `GET /getTempPettyCashBalance/{officeBranch}/{authKey}`
- **Get Today's Total**: `GET /getTodayTotal/{officeBranch}/{authKey}`
- **Description**: Each returns a raw plain string number summing up the relevant scopes.
- **Response**: `text/plain`
```text
1550.00
```

---

## Utility Auto-Completes

Used in UI inputs for quick validation and hinting without pulling heavy payloads. Returns simple flat JSON arrays of strings `[ "string" ]`.

- **Auto-Complete Customer Name**: `GET /autoCompleteEmployeeName/{employeeName}/{officeBranch}/{authKey}`  *(Note: internally named Customer name but method queries employees)*
- **Auto-Complete Employee Name Exclude Driver**: `GET /autoCompleteEmployeeNameExcludeDriver/{employeeName}/{officeBranch}/{authKey}`
- **Auto-Complete Trip ID Except Order Closed**: `GET /autoCompleteTripIdExceptOrderClosed/{tripId}/{officeBranch}/{authKey}`
- **Auto-Complete Truck Number**: `GET /autoCompleteTruckNumber/{truckNo}/{officeBranch}/{authKey}`
- **Get Bank IDs**: `GET /getBankIds/{officeBranch}/{authKey}`
- **Get From Account List**: `GET /getFromAccountList/{officeBranch}/{authKey}`
- **Response** (Applies to all auto-complete arrays):
```json
[
  "Result 1",
  "Result 2",
  "Result 3"
]
```

---

## Form Uploads & Receipt Management

These handle multi-part file payloads for storing images or proof to a specific record.

### Upload Standard Proof
- **Endpoint**: `POST /uploadpettycash` (Requires `FormData` containing `voucherNumber` and `pettyCashFile` buffer)
- **Response**:
```json
{
  "Uploaded": "Ok",
  "Filepath": "/server/path/VOUCHER-123"
}
```

### Submit Petty Cash With Receipts
- **Endpoint**: `POST /submitPettyCashWithReceipts` (Combined logic that handles the same JSON as standard `POST /generatePettyCash` wrapped inside a `FormData` alongside `username` and `pettyCashFile`)
- **Response**:
```json
{
  "success": true,
  "voucherNumber": "PC-555",
  "dataSaved": true,
  "receiptUploaded": "Ok"
}
```

### Add Petty Cash With Screenshot
- **Endpoint**: `POST /addPettyCashWithScreenshot`
- **Response**:
```json
{
  "success": true,
  "message": "Petty Cash Box saved successfully!",
  "fileId": "PCB_167888999000",
  "screenshotUploaded": true
}
```

### Add Temporary Petty Cash With Screenshot
- **Endpoint**: `POST /addTempPettyCashWithScreenshot`
- **Response**: `text/plain`
```text
Temporary PettyCash Saved Successfully!
```

> Temporary box/cash entries usually correlate with advances, unallocated funds, or immediate small distributions that will later be settled under a strict voucher type.

---

## Document Generation

Generates `.pdf` files representing official slips or standard print-out formats based on existing voucher references using iText PDF libraries.

- **Print Petty Cash Voucher**: `GET /print/{pettyCashId}/{officeBranch}/{authKey}`
- **Print Cash Book Voucher**: `GET /printCashBook/{pettyCashId}/{officeBranch}/{authKey}`
- **Response**: A binary stream with `Content-Type: application/pdf` and a `Content-Disposition` header forcing an attachment download (e.g., `attachment; filename=VOUCHER-123.pdf`).
