---
id: retail-sale-api
title: Retail Sale API
sidebar_position: 4
---

# Retail Sale API

**Base Path:** `/rest/inventory/sale/`

Manages retail sales / outgoing stock. Sales automatically deduct stock; voiding restores it.

---

## Create a Sale

Creates a sale record and **automatically deducts stock** for each item.

```
POST /rest/inventory/sale/create
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "sale": {
    "saleNumber": "INV-2026-0042",
    "customerName": "Ali bin Ahmad",
    "customerPhone": "0123456789",
    "saleDate": "2026-02-20T10:30:00.000+0530",
    "paymentMethod": "CASH",
    "totalAmount": "65.00",
    "discount": "5.00",
    "createdBy": "admin",
    "notes": "Walk-in customer",
    "items": [
      {
        "itemId": 1,
        "itemName": "Oil Filter",
        "quantity": 3,
        "unitPrice": "10.00",
        "subTotal": "30.00",
        "taxAmount": "3.00",
        "warehouseId": 1,
        "categoryId": 1,
        "categoryName": "Engine Parts",
        "stockLocationId": 1,
        "locationName": "A-01-03",
        "taxes": [
          { "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "3.00" }
        ]
      },
      {
        "itemId": 3,
        "itemName": "Spark Plug",
        "quantity": 5,
        "unitPrice": "7.00",
        "subTotal": "35.00",
        "taxAmount": "3.50",
        "warehouseId": 1,
        "categoryId": 1,
        "categoryName": "Engine Parts",
        "taxes": [
          { "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "3.50" }
        ]
      }
    ]
  }
}
```

:::info Automatic Tax Calculation
When creating a Retail Sale, you do not explicitly need to send the `taxes` array. The backend will automatically fetch the applicable taxes configured on the `Item` master and apply them to your line items. However, if you include them (as shown above), they will be recorded as part of the line item.
:::

:::info Side Effects
For each sale item:
1. `Item.totalBalanceStock` −= `quantity`
2. `Item.totalBalanceStockValue` −= `quantity × unitPrice` (minimum 0)
3. If `stockLocationId` is provided → `ItemStockLocation.quantity` −= `quantity`
:::

**Payment Method Values:**

| Value | Description |
|-------|-------------|
| `CASH` | Cash payment |
| `CARD` | Card payment |
| `CREDIT` | On credit / pay later |
| `TRANSFER` | Bank transfer |

**Response:**

```json
{ "data": true }
```

---

## List All Sales

```
GET /rest/inventory/sale/list/{userName}/{authKey}
```

Returns all sales sorted by `createdDate` descending, including line items.

**Response:**

```json
{
  "data": [
    {
      "saleId": 1,
      "saleNumber": "INV-2026-0042",
      "customerName": "Ali bin Ahmad",
      "customerPhone": "0123456789",
      "saleDate": "2026-02-20T10:30:00.000+0530",
      "totalAmount": "65.00",
      "totalTaxAmount": "6.50",
      "discount": "5.00",
      "paymentMethod": "CASH",
      "status": "COMPLETED",
      "createdBy": "admin",
      "items": [
        {
          "saleItemId": 1,
          "itemId": 1,
          "itemName": "Oil Filter",
          "quantity": 3,
          "unitPrice": "10.00",
          "subTotal": "30.00",
          "taxAmount": "3.00",
          "warehouseId": 1,
          "categoryId": 1,
          "categoryName": "Engine Parts",
          "taxes": [
            { "taxId": 1, "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "3.00" }
          ]
        },
        {
          "saleItemId": 2,
          "itemId": 3,
          "itemName": "Spark Plug",
          "quantity": 5,
          "unitPrice": "7.00",
          "subTotal": "35.00",
          "taxAmount": "3.50",
          "warehouseId": 1,
          "categoryId": 1,
          "categoryName": "Engine Parts",
          "taxes": [
            { "taxId": 1, "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "3.50" }
          ]
        }
      ]
    }
  ]
}
```

---

## Get Sale by ID

```
GET /rest/inventory/sale/get/{saleId}/{userName}/{authKey}
```

Returns a single sale with its line items.

**Response:**

```json
{
  "data": {
    "saleId": 1,
    "saleNumber": "INV-2026-0042",
    "status": "COMPLETED",
    "totalAmount": "65.00",
    "totalTaxAmount": "6.50",
    "items": [
      {
        "saleItemId": 1,
        "itemId": 1,
        "itemName": "Oil Filter",
        "taxAmount": "3.00",
        "taxes": [
          { "taxId": 1, "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "3.00" }
        ]
      }
    ]
  }
}
```

---

## Search Sales by Date Range

```
GET /rest/inventory/sale/search/{fromDate}/{toDate}/{userName}/{authKey}
```

**Date Format:** `yyyy-MM-dd`

**Example:**

```
GET /rest/inventory/sale/search/2026-02-01/2026-02-28/admin/abc123
```

Returns all sales where `saleDate` falls within the date range (inclusive), sorted by date descending.

**Response:**

```json
{
  "data": [
    { "saleId": 1, "saleNumber": "INV-2026-0042", ... },
    { "saleId": 2, "saleNumber": "INV-2026-0041", ... }
  ]
}
```

---

## Void a Sale

Voids a completed sale and **restores stock** for all line items.

```
GET /rest/inventory/sale/void/{saleId}/{userName}/{authKey}
```

:::warning Side Effects
1. Sale `status` changes to `VOID`
2. For each line item:
   - `Item.totalBalanceStock` += `quantity` (restored)
   - `Item.totalBalanceStockValue` += `quantity × unitPrice` (restored)
   - If `stockLocationId` was provided → `ItemStockLocation.quantity` += `quantity` (restored)
3. **Idempotent**: Voiding an already-voided sale has no effect
:::

**Response:**

```json
{ "data": true }
```

If the sale is already voided:

```json
{ "data": false }
```

---

## Sale Status Values

| Status | Description |
|--------|-------------|
| `COMPLETED` | Sale is finalized (default on creation) |
| `REFUNDED` | Reserved for future use |
| `VOID` | Sale reversed, stock restored |
