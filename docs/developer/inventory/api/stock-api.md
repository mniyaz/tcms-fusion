---
id: stock-api
title: Stock API
sidebar_position: 2
---

# Stock API

**Base Path:** `/rest/inventory/stock/`

Manages product categories, stock locations (bins/shelves), manual stock adjustments, and low-stock alerts.

---

## Categories

### Create / Update Category

Creates a new category or updates an existing one.

```
POST /rest/inventory/stock/createCategory
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "edit": false,
  "category": {
    "name": "Engine Parts",
    "description": "All engine-related parts and components"
  }
}
```

For updates, set `edit: true` and include `categoryId`:

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "edit": true,
  "category": {
    "categoryId": 1,
    "name": "Engine Parts (Updated)",
    "description": "Updated description"
  }
}
```

**Response:**

```json
{
  "data": true,
  "error": ""
}
```

:::warning Duplicate Check
If `edit` is `false` and a category with the same name already exists, the response will be:
```json
{ "data": false, "error": "Category already exists!" }
```
:::

---

### List All Categories

```
GET /rest/inventory/stock/categories/{userName}/{authKey}
```

**Response:**

```json
{
  "data": [
    {
      "categoryId": 1,
      "name": "Engine Parts",
      "description": "All engine-related parts",
      "active": true,
      "createdDate": "2026-02-20T01:00:00.000+0530"
    },
    {
      "categoryId": 2,
      "name": "Electrical",
      "description": "Electrical components",
      "active": true,
      "createdDate": "2026-02-20T01:30:00.000+0530"
    }
  ]
}
```

---

### Delete Category (Soft Delete)

Sets `active = false` on the category.

```
GET /rest/inventory/stock/deleteCategory/{categoryId}/{userName}/{authKey}
```

**Response:**

```json
{ "data": true }
```

---

## Stock Locations

### Create / Update Stock Location

```
POST /rest/inventory/stock/createStockLocation
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "edit": false,
  "stockLocation": {
    "name": "A-01-03",
    "description": "Rack A, Shelf 1, Bin 3",
    "warehouse": {
      "warehouseId": 1
    }
  }
}
```

**Response:**

```json
{ "data": true }
```

---

### List All Stock Locations

```
GET /rest/inventory/stock/stockLocations/{userName}/{authKey}
```

**Response:**

```json
{
  "data": [
    {
      "locationId": 1,
      "name": "A-01-03",
      "description": "Rack A, Shelf 1, Bin 3",
      "active": true,
      "warehouseId": 1
    }
  ]
}
```

---

### List Locations by Warehouse

```
GET /rest/inventory/stock/stockLocations/warehouse/{warehouseId}/{userName}/{authKey}
```

Returns only locations belonging to the specified warehouse.

---

## Stock Adjustments

### Create Stock Adjustment

```
POST /rest/inventory/stock/createAdjustment
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "adjustment": {
    "itemId": 1,
    "warehouseId": 1,
    "adjustmentType": "DECREASE",
    "quantity": 5,
    "reason": "Damaged in storage — water leak",
    "adjustedBy": "admin",
    "itemName": "Oil Filter",
    "warehouseName": "Main Warehouse",
    "stockLocationId": 1,
    "locationName": "A-01-03"
  }
}
```

:::tip Optional Location
`stockLocationId` and `locationName` are **optional**. When provided, the `ItemStockLocation` bridge table is automatically updated (quantity increased or decreased). When omitted, only `Item.totalBalanceStock` is affected.
:::

| `adjustmentType` | Effect |
|-----------------|--------|
| `INCREASE` | Adds `quantity` to `Item.totalBalanceStock` |
| `DECREASE` | Subtracts `quantity` from `Item.totalBalanceStock` |

**Response:**

```json
{ "data": true }
```

---

### List Adjustments for an Item

```
GET /rest/inventory/stock/adjustments/{itemId}/{userName}/{authKey}
```

Returns adjustments sorted by date descending.

**Response:**

```json
{
  "data": [
    {
      "adjustmentId": 1,
      "itemId": 1,
      "warehouseId": 1,
      "adjustmentType": "DECREASE",
      "quantity": 5,
      "reason": "Damaged in storage",
      "adjustedBy": "admin",
      "adjustmentDate": "2026-02-20T06:00:00.000+0530",
      "itemName": "Oil Filter",
      "warehouseName": "Main Warehouse",
      "stockLocationId": 1,
      "locationName": "A-01-03"
    }
  ]
}
```

---

## Low Stock Alert

### Get Low Stock Items

Returns all active items where `totalBalanceStock` is at or below the given threshold.

```
GET /rest/inventory/stock/lowStock/{threshold}/{userName}/{authKey}
```

**Example:** Get items with 10 or fewer units:

```
GET /rest/inventory/stock/lowStock/10/admin/abc123
```

**Response:**

```json
{
  "data": [
    {
      "itemId": 3,
      "name": "Spark Plug",
      "sku": "SP-001",
      "active": true,
      "totalBalanceStock": 7,
      "totalBalanceStockValue": "49.00",
      "categoryId": 1,
      "categoryName": "Engine Parts"
    }
  ]
}
```

---

## Items by Category

### Get Items by Category

Returns all active items that belong to a specific category.

```
GET /rest/inventory/stock/items/category/{categoryId}/{userName}/{authKey}
```

**Example:** Get all items in category 1 (Engine Parts):

```
GET /rest/inventory/stock/items/category/1/admin/abc123
```

**Response:**

```json
{
  "data": [
    {
      "itemId": 1,
      "name": "Oil Filter",
      "sku": "OF-001",
      "active": true,
      "totalBalanceStock": 50,
      "uom": "kg",
      "categoryId": 1,
      "categoryName": "Engine Parts"
    },
    {
      "itemId": 3,
      "name": "Spark Plug",
      "sku": "SP-001",
      "active": true,
      "uom": "kg",
      "totalBalanceStock": 30,
      "categoryId": 1,
      "categoryName": "Engine Parts"
    }
  ]
}
```

---

## Item Stock Locations

These endpoints query the `ItemStockLocation` bridge table, which is automatically maintained by stock adjustments, PO receiving, and sales when a `stockLocationId` is provided.

### Get Locations for an Item

Returns all stock locations where a specific item is stored, with quantities.

```
GET /rest/inventory/stock/itemLocations/{itemId}/{userName}/{authKey}
```

**Example:** Get all locations for item 1 (Oil Filter):

```
GET /rest/inventory/stock/itemLocations/1/admin/abc123
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "itemId": 1,
      "itemName": "Oil Filter",
      "stockLocationId": 1,
      "locationName": "A-01-03",
      "quantity": 45,
      "warehouseId": 1,
      "warehouseName": "Main Warehouse",
      "categoryId": 1,
      "categoryName": "Engine Parts",
      "active": true,
      "updatedDate": "2026-02-20T11:00:00.000+0530"
    },
    {
      "id": 2,
      "itemId": 1,
      "itemName": "Oil Filter",
      "stockLocationId": 3,
      "locationName": "B-02-01",
      "quantity": 5,
      "warehouseId": 1,
      "warehouseName": "Main Warehouse",
      "categoryId": 1,
      "categoryName": "Engine Parts",
      "active": true,
      "updatedDate": "2026-02-20T09:30:00.000+0530"
    }
  ]
}
```

:::tip
The sum of all `quantity` values across locations should equal `Item.totalBalanceStock` (assuming all stock changes specify a `stockLocationId`).
:::

---

### Get Items at a Location

Returns all items stored at a specific stock location, with quantities.

```
GET /rest/inventory/stock/locationItems/{locationId}/{userName}/{authKey}
```

**Example:** Get all items at location 1 (A-01-03):

```
GET /rest/inventory/stock/locationItems/1/admin/abc123
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "itemId": 1,
      "itemName": "Oil Filter",
      "stockLocationId": 1,
      "locationName": "A-01-03",
      "quantity": 45,
      "warehouseId": 1,
      "categoryId": 1,
      "categoryName": "Engine Parts",
      "active": true,
      "updatedDate": "2026-02-20T11:00:00.000+0530"
    },
    {
      "id": 5,
      "itemId": 2,
      "itemName": "Brake Pad",
      "stockLocationId": 1,
      "locationName": "A-01-03",
      "quantity": 20,
      "warehouseId": 1,
      "categoryId": 2,
      "categoryName": "Brake System",
      "active": true,
      "updatedDate": "2026-02-20T10:15:00.000+0530"
    }
  ]
}
```

---

## All Items with Stock & Locations

Returns all active items with their stock levels, taxes, and per-location breakdown — **in a single API call**.

```
GET /rest/inventory/stock/items/{userName}/{authKey}
```

**Response:**

```json
{
  "data": [
    {
      "itemId": 1,
      "name": "Oil Filter",
      "sku": "OF-001",
      "active": true,
      "totalBalanceStock": 50,
      "uom": "kg",
      "totalBalanceStockValue": "250.00",
      "purchaseCost": "5.00",
      "sellingCost": "12.50",
      "categoryId": 1,
      "categoryName": "Engine Parts",
      "allowNegativeStock": false,
      "taxApplicable": true,
      "taxExempted": false,
      "taxes": [
        { "taxId": 1, "taxName": "GST", "taxPercentage": 6.0 },
        { "taxId": 2, "taxName": "Service Tax", "taxPercentage": 10.0 }
      ],
      "locations": [
        {
          "id": 1,
          "stockLocationId": 1,
          "locationName": "A-01-03",
          "quantity": 45,
          "warehouseId": 1,
          "warehouseName": "Main Warehouse",
          "categoryId": 1,
          "categoryName": "Engine Parts"
        },
        {
          "id": 2,
          "stockLocationId": 3,
          "locationName": "B-02-01",
          "quantity": 5,
          "warehouseId": 1,
          "warehouseName": "Main Warehouse",
          "categoryId": 1,
          "categoryName": "Engine Parts"
        }
      ]
    }
  ]
}
```

:::tip Performance
This endpoint uses only **2 database queries** regardless of item count: one for all items, one for all locations. Locations are grouped by item in memory.
:::

---

## Get Item Transaction History

Returns a single consolidated chronological list of all stock movements for a specific item, regardless of where they originated (e.g. manual adjustments, legacy transactions, stock receives, retail sales).

```
GET /rest/inventory/stock/itemTransactions/{itemId}/{userName}/{authKey}
```

**Parameters:**

- `itemId` (Path, required) - The internal ID of the item.
- `userName` (Path, required) - Valid username for authentication.
- `authKey` (Path, required) - Valid session key token.

**Response Body:**

```json
{
  "data": [
    {
      "transactionType": "PURCHASE_RECEIVE",
      "referenceNumber": "PO-10023",
      "transactionDate": "2023-11-06T14:32:00.000+0800",
      "quantityDelta": 150,
      "uom": "kg",
      "currentLocation": "Main Warehouse",
      "adjustedBy": "admin",
      "reason": "PO Receive from AutoParts Supplier Inc",
      "additionalInfo": "Supplier: AutoParts Supplier Inc"
    },
    {
      "transactionType": "RETAIL_SALE",
      "referenceNumber": "INV-00154",
      "transactionDate": "2023-11-05T09:15:22.000+0800",
      "quantityDelta": -2,
      "uom": "kg",
      "currentLocation": "Retail",
      "adjustedBy": "cashier_jhon",
      "reason": "Retail Sale to Walk-in Customer",
      "additionalInfo": "Customer: Walk-in Customer"
    },
    {
      "transactionType": "MANUAL_ADJUSTMENT",
      "referenceNumber": "ADJ-42",
      "transactionDate": "2023-10-30T10:00:00.000+0800",
      "quantityDelta": 5,
      "uom": "kg",
      "currentLocation": "A-01-02",
      "adjustedBy": "inventory_manager",
      "reason": "Found extra 5 units during cycle count",
      "additionalInfo": null
    }
  ]
}
```

:::info Transaction Types
`transactionType` will be one of the following:
- `MANUAL_ADJUSTMENT`: An explicit adjustment via the Inventory/Stock Adjustments UI.
- `PURCHASE_RECEIVE`: Stock added via a Purchase Order receive.
- `RETAIL_SALE`: Stock deducted via a Retail Sale.
- `LEGACY_TRANSACTION`: Manual adjustments made via the old Inventory Summary UI.
:::
