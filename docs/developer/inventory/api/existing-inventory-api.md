---
id: existing-inventory-api
title: Existing Inventory API
sidebar_position: 5
---

# Existing Inventory API

**Base Path:** `/rest/inventory/`

These are the **pre-existing** endpoints that were in the module before the new stock management features were added. They manage the core `Item`, `Warehouse`, and `InventoryTransactions` entities.

---

## Create / Update Warehouse

```
POST /rest/inventory/createWarehouse
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "branch": "HQ",
  "edit": false,
  "warehouse": {
    "name": "Main Warehouse"
  }
}
```

For updates, set `edit: true` and include `warehouseId`.

:::warning Duplicate Check
Returns `"Item already exists!"` error if a warehouse with the same name exists.
:::

---

## Create / Update Item

```
POST /rest/inventory/createItem
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "branch": "HQ",
  "edit": false,
  "item": {
    "name": "Oil Filter",
    "sku": "OF-001",
    "active": true,
    "totalBalanceStock": 50,
    "purchaseCost": "5.00",
    "sellingCost": "12.50",
    "categoryId": 1,
    "categoryName": "Engine Parts",
    "uom": "Pieces",
    "stockLocationId": 1,
    "locationName": "A-01-03",
    "warehouseId": 1,
    "warehouseName": "Main Warehouse",
    "allowNegativeStock": false,
    "taxApplicable": true,
    "taxExempted": false,
    "taxes": [
      { "taxName": "GST", "taxPercentage": 6.0 },
      { "taxName": "Service Tax", "taxPercentage": 10.0 }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `purchaseCost` | `String` | Cost price per unit |
| `sellingCost` | `String` | Selling price per unit |
| `categoryId` | `int` | Category ID |
| `categoryName` | `String` | Category display name |
| `uom` | `String` | Unit of measure (e.g. Pieces, Boxes, Kg) |
| `stockLocationId` | `int` | *(Optional)* Initial stock location ID |
| `locationName` | `String` | *(Optional)* Location display name |
| `warehouseId` | `int` | *(Optional)* Warehouse ID for the location |
| `warehouseName` | `String` | *(Optional)* Warehouse display name |
| `allowNegativeStock` | `boolean` | Whether stock can go below zero |
| `taxApplicable` | `boolean` | Whether tax applies to this item |
| `taxExempted` | `boolean` | Whether this item is tax-exempt |
| `taxes` | `array` | List of taxes — each with `taxName` (String) and `taxPercentage` (double) |

:::info Database Update
When adding the `uom` field, remember to run this SQL command on your database:
```sql
ALTER TABLE inventory_item ADD COLUMN UOM VARCHAR(50);
```
:::

:::tip Category Assignment
When creating or updating items, include `categoryId` (FK to `inventory_category`) and `categoryName` (denormalized for display). Use the [Stock API's category endpoints](./stock-api#categories) to manage categories and the [Get Items by Category](./stock-api#get-items-by-category) endpoint to filter items by category.
:::

:::tip Initial Stock Location
When creating a new item with `totalBalanceStock > 0`, include `stockLocationId`, `locationName`, `warehouseId`, and `warehouseName` to automatically assign the stock to a location. These fields are optional.
:::

:::info Editing Taxes
When editing an item (`edit: true`), all existing taxes are **replaced** with the new `taxes` array. To keep existing taxes, include them in the payload.
:::

:::info Price Change Tracking
When editing an item, any changes to `purchaseCost` or `sellingCost` are **automatically recorded** in the price history. Use the [Get Price History](#get-price-history) endpoint to view the audit trail.
:::


---

## Get Item by ID

Returns a single item with all its details including taxes.

```
GET /rest/inventory/item/{itemId}/{userName}/{authKey}
```

**Response:**

```json
{
  "data": {
    "itemId": 1,
    "name": "Oil Filter",
    "sku": "OF-001",
    "active": true,
    "totalBalanceStock": 50,
    "totalBalanceStockValue": "250.00",
    "purchaseCost": "5.00",
    "sellingCost": "12.50",
    "uom": "kg",
    "categoryId": 1,
    "categoryName": "Engine Parts",
    "allowNegativeStock": false,
    "taxApplicable": true,
    "taxExempted": false,
    "taxes": [
      { "taxId": 1, "taxName": "GST", "taxPercentage": 6.0 },
      { "taxId": 2, "taxName": "Service Tax", "taxPercentage": 10.0 }
    ]
  }
}
```

---

## Get Price History

Returns the history of price changes (purchase cost / selling cost) for a specific item, ordered by most recent first.

```
GET /rest/inventory/priceHistory/{itemId}/{userName}/{authKey}
```

**Response:**

```json
{
  "data": [
    {
      "historyId": 2,
      "itemId": 1,
      "itemName": "Oil Filter",
      "fieldName": "SELLING_COST",
      "oldValue": "10.00",
      "newValue": "12.50",
      "changedBy": "admin",
      "changedDate": "2026-02-20T15:30:00.000+0530"
    },
    {
      "historyId": 1,
      "itemId": 1,
      "itemName": "Oil Filter",
      "fieldName": "PURCHASE_COST",
      "oldValue": "4.00",
      "newValue": "5.00",
      "changedBy": "admin",
      "changedDate": "2026-02-20T15:30:00.000+0530"
    }
  ]
}
```

:::info Automatic Tracking
Price history is recorded **automatically** whenever an item is edited via `createItem` (`edit: true`). Only actual changes are recorded — if `purchaseCost` or `sellingCost` remains the same, no history entry is created.
:::

---

## Create Transaction (Deprecated)

> [!CAUTION]
> **Deprecated** — Use [Purchase Order → Receive Goods](./purchase-order-api#receive-goods) for supplier stock-in, or [Stock Adjustments](./stock-api#create-stock-adjustment) for corrections. This endpoint remains functional for backward compatibility but will not receive new features.

Records a stock in/out transaction for an item at a specific warehouse.

```
POST /rest/inventory/createTransaction
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "branch": "HQ",
  "edit": false,
  "inventoryTransaction": {
    "item": { "itemId": 1 },
    "warehouse": { "warehouseId": 1 },
    "quantity": 50,
    "cost": "5.00",
    "transactionValue": "250.00",
    "supplier": "AutoParts Ltd",
    "supplierId": "SUP001",
    "description": "Initial stock",
    "transactionOnDate": "2026-02-20T00:00:00.000+0530",
    "categoryId": 1,
    "categoryName": "Engine Parts",
    "stockLocationId": 1,
    "locationName": "A-01-03"
  }
}
```

:::info Side Effects
1. Calculates `balanceStock` = previous balance + `quantity`
2. Updates `Item.totalBalanceStock` += `quantity`
3. Updates `Item.totalBalanceStockValue` += `transactionValue`
4. If `stockLocationId` is provided → `ItemStockLocation.quantity` += `quantity`
:::

---

## Delete Transaction (Deprecated)

> [!CAUTION]
> **Deprecated** — See deprecation notice on Create Transaction above.

```
GET /rest/inventory/deleteTransaction/{transactionId}/{officeBranch}/{authKey}
```

Reverses the stock changes and removes the transaction record.

---

## Get Inventory Summary (Deprecated)

> [!CAUTION]
> **Deprecated** — This endpoint queries `InventoryTransactions` which is no longer updated by the new module. Use `Item.totalBalanceStock` (returned by all item-listing endpoints) for accurate stock levels. For per-location breakdown, use the new [Item Locations API](./stock-api#item-stock-locations).

Returns all items with their latest transaction per warehouse.

```
GET /rest/inventory/inventory/{officeBranch}/{userName}/{authKey}
```

---

## Get Warehouse Stock (Deprecated)

> [!CAUTION]
> **Deprecated** — This endpoint queries `InventoryTransactions` which is no longer updated by the new module. Use the new [Item Locations API](./stock-api#item-stock-locations) for per-location stock levels.

Returns all warehouses with their latest transaction per item.

```
GET /rest/inventory/warehousestock/{officeBranch}/{userName}/{authKey}
```

---

## Get Warehouse Stock by Item (Deprecated)

> [!CAUTION]
> **Deprecated** — This endpoint queries `InventoryTransactions` which is no longer updated by the new module. Use the new [Item Locations API](./stock-api#item-stock-locations) for per-location stock levels.

Returns all transactions for a specific item in a specific warehouse.

```
GET /rest/inventory/warehousestockbyitem/{warehouseId}/{itemId}/{officeBranch}/{userName}/{authKey}
```

---

## Relationship with New Module

The new Stock Management module builds on top of these existing entities:

| Existing Entity | Used By New Features |
|----------------|---------------------|
| `Item` | Stock adjustments update `totalBalanceStock`, PO receiving adds stock, sales deduct stock |
| `Warehouse` | Stock locations belong to warehouses, adjustments reference warehouses |
| `InventoryTransactions` | **Deprecated** — replaced by PO Receiving, Sales, and Stock Adjustments |

:::warning Deprecation Notice
The `createTransaction` and `deleteTransaction` endpoints are **deprecated**. Use the new module endpoints instead:
- **Supplier stock-in** → [Receive Goods](./purchase-order-api#receive-goods) (with PO tracking, partial receiving)
- **Stock corrections** → [Stock Adjustments](./stock-api#create-stock-adjustment) (with INCREASE/DECREASE, audit trail)
- **Sales / stock-out** → [Retail Sales](./retail-sale-api#create-a-sale) (with auto-deduction, void/restore)
:::
