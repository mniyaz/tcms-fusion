---
id: data-models
title: Data Models
sidebar_position: 3
---

# Data Models

All models are JPA `@Entity` classes that map to MySQL tables. With `hbm2ddl.auto=update`, tables are auto-created on application startup.

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│   Category   │       │    Warehouse     │
│──────────────│       │──────────────────│
│ categoryId   │       │ warehouseId      │
│ name         │       │ name             │
│ description  │       │                  │
│ active       │       └────────┬─────────┘
│ createdDate  │                │
└──────┬───────┘                │ 1:N
       │ 1:N                    │
       │                ┌───────┴──────────┐
┌──────┴───────┐       │  StockLocation   │
│     Item     │       │──────────────────│
│──────────────│       │ locationId       │
│ itemId       │       │ name             │
│ name         │       │ warehouseId (FK) │
│ sku          │       │ description      │
│ active       │       │ active           │
│ totalBalance │       └──────┬───────────┘
│ stockValue   │              │
│ categoryId   │◄── FK to Category
│ categoryName │              │
│ allowNeg...  │              │
│ taxApplicable│              │
│ taxExempted  │              │
│ createdDate  │              │
└──────┬───────┘              │
       │                      │
       │ 1:N                  │
       │                      │
┌──────┴───────┐   ┌─────────┴──────────────┐
│   ItemTax    │   │   ItemStockLocation    │
│──────────────│   │────────────────────────│
│ taxId (PK)   │   │ id (PK)                │
│ itemId (FK)  │   │ itemId (FK) / itemName │
│ taxName      │   │ stockLocationId (FK)   │
│ taxPercentage│   │ locationName           │
└──────────────┘   │ warehouseId / Name     │
                   │ quantity               │
                   │ categoryId / Name      │
                   └────────────────────────┘
       │
       │ Referenced by ──────────────────────────
       │                                         │
       ▼                                         ▼
┌──────────────────┐              ┌──────────────────────────┐
│ StockAdjustment  │              │   StockPurchaseOrder     │
│──────────────────│              │──────────────────────────│
│ adjustmentId     │              │ poId                     │
│ itemId (FK)      │              │ poNumber                 │
│ warehouseId (FK) │              │ supplierId               │
│ adjustmentType   │              │ supplierName             │
│ quantity         │              │ orderDate                │
│ reason           │              │ expectedDeliveryDate     │
│ adjustedBy       │              │ status                   │
│ adjustmentDate   │              │ totalAmount / notes      │
│ itemName         │              │ createdBy / createdDate  │
│ warehouseName    │              └────────────┬─────────────┘
└──────────────────┘                           │ 1:N
                                               │
                               ┌───────────────┴──────────────┐
                               │  StockPurchaseOrderItem      │
                               │──────────────────────────────│
                               │ poItemId                     │
                               │ poId (FK)                    │
                               │ itemId                       │
                               │ itemName                     │
                               │ quantity / receivedQuantity  │
                               │ unitPrice / subTotal         │
                               └──────────────────────────────┘

┌──────────────────┐
│   RetailSale     │
│──────────────────│
│ saleId           │
│ saleNumber       │
│ customerName     │
│ customerPhone    │
│ saleDate         │
│ totalAmount      │
│ discount         │
│ paymentMethod    │
│ status           │
│ createdBy / notes│
└────────┬─────────┘
         │ 1:N
         │
┌────────┴──────────────┐
│   RetailSaleItem      │
│───────────────────────│
│ saleItemId            │
│ saleId (FK)           │
│ itemId                │
│ itemName              │
│ quantity              │
│ unitPrice / subTotal  │
│ warehouseId           │
└───────────────────────┘
```

---

## Model Details

### Category

**Table:** `inventory_category`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `categoryId` | `int` | `CATEGORY_ID` | PK, auto-generated |
| `name` | `String` | `NAME` | Category name |
| `description` | `String` | `DESCRIPTION` | Optional |
| `active` | `boolean` | `active` | Default `true`, used for soft-delete |
| `createdDate` | `Date` | `CREATED_DATE` | Auto-set to current date |

---

### StockLocation

**Table:** `inventory_stock_location`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `locationId` | `int` | `LOCATION_ID` | PK, auto-generated |
| `name` | `String` | `NAME` | Location code (e.g. "A-01-03") |
| `description` | `String` | `DESCRIPTION` | Optional |
| `active` | `boolean` | `active` | Default `true` |
| `warehouse` | `Warehouse` | `WAREHOUSE_ID` | `@ManyToOne` FK |
| `warehouseId` | `int` | `WAREHOUSE_ID` | Read-only duplicate column |

---

### StockAdjustment

**Table:** `inventory_stock_adjustment`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `adjustmentId` | `int` | `ADJUSTMENT_ID` | PK |
| `item` | `Item` | `ITEM_ID` | `@ManyToOne` FK |
| `itemId` | `int` | `ITEM_ID` | Read-only |
| `warehouse` | `Warehouse` | `WAREHOUSE_ID` | `@ManyToOne` FK |
| `warehouseId` | `int` | `WAREHOUSE_ID` | Read-only |
| `adjustmentType` | `String` | `ADJUSTMENT_TYPE` | `INCREASE` or `DECREASE` |
| `quantity` | `int` | `QUANTITY` | Adjustment amount |
| `reason` | `String` | `REASON` | Free-text explanation |
| `adjustedBy` | `String` | `ADJUSTED_BY` | User who made the adjustment |
| `adjustmentDate` | `Date` | `ADJUSTMENT_DATE` | When the adjustment occurred |
| `itemName` | `String` | `ITEM_NAME` | Denormalized for display |
| `warehouseName` | `String` | `WAREHOUSE_NAME` | Denormalized for display |
| `stockLocationId` | `Integer` | `STOCK_LOCATION_ID` | Optional FK to StockLocation |
| `locationName` | `String` | `LOCATION_NAME` | Denormalized for display |

:::info Side Effect
Creating an adjustment **automatically updates** `Item.totalBalanceStock` — increasing or decreasing based on `adjustmentType`. If `stockLocationId` is provided, the `ItemStockLocation` bridge table quantity is also updated.
:::

---

### ItemStockLocation

**Table:** `inventory_item_stock_location`

Bridge table connecting items to specific stock locations with per-location quantity tracking.

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `id` | `int` | `ID` | PK, auto-generated |
| `item` | `Item` | `ITEM_ID` | `@ManyToOne` FK |
| `itemId` | `Integer` | `ITEM_ID` | Read-only |
| `itemName` | `String` | `ITEM_NAME` | Denormalized |
| `stockLocation` | `StockLocation` | `STOCK_LOCATION_ID` | `@ManyToOne` FK |
| `stockLocationId` | `Integer` | `STOCK_LOCATION_ID` | Read-only |
| `locationName` | `String` | `LOCATION_NAME` | Denormalized |
| `warehouseId` | `Integer` | `WAREHOUSE_ID` | Parent warehouse |
| `warehouseName` | `String` | `WAREHOUSE_NAME` | Denormalized |
| `quantity` | `int` | `QUANTITY` | Units at this location |
| `categoryId` | `Integer` | `CATEGORY_ID` | Denormalized |
| `categoryName` | `String` | `CATEGORY_NAME` | Denormalized |
| `updatedDate` | `Date` | `UPDATED_DATE` | Last modified |
| `active` | `boolean` | `ACTIVE` | Default `true` |

:::info Purpose
This bridge table answers: **"Where exactly within a warehouse are my items stored, and how many are at each location?"** The sum of all `quantity` values for an item should match `Item.totalBalanceStock`.
:::

---

### StockPurchaseOrder

**Table:** `inventory_purchase_order`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `poId` | `int` | `PO_ID` | PK |
| `poNumber` | `String` | `PO_NUMBER` | Human-readable PO number |
| `supplierId` | `String` | `SUPPLIER_ID` | FK to existing Supplier |
| `supplierName` | `String` | `SUPPLIER_NAME` | Denormalized |
| `orderDate` | `Date` | `ORDER_DATE` | |
| `expectedDeliveryDate` | `Date` | `EXPECTED_DELIVERY_DATE` | |
| `status` | `String` | `STATUS` | `DRAFT` / `ORDERED` / `PARTIAL` / `RECEIVED` / `CANCELLED` |
| `totalAmount` | `String` | `TOTAL_AMOUNT` | |
| `notes` | `String` | `NOTES` | TEXT column |
| `createdBy` | `String` | `CREATED_BY` | |
| `createdDate` | `Date` | `CREATED_DATE` | |
| `items` | `List<StockPurchaseOrderItem>` | — | `@OneToMany` cascade all |

---

### StockPurchaseOrderItem

**Table:** `inventory_purchase_order_item`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `poItemId` | `int` | `PO_ITEM_ID` | PK |
| `purchaseOrder` | `StockPurchaseOrder` | `PO_ID` | `@ManyToOne` FK |
| `itemId` | `int` | `ITEM_ID` | FK to Item |
| `itemName` | `String` | `ITEM_NAME` | Denormalized |
| `quantity` | `int` | `QUANTITY` | Ordered qty |
| `receivedQuantity` | `int` | `RECEIVED_QUANTITY` | Received so far |
| `unitPrice` | `String` | `UNIT_PRICE` | Price per unit |
| `subTotal` | `String` | `SUB_TOTAL` | quantity × unitPrice |
| `categoryId` | `Integer` | `CATEGORY_ID` | FK to Category (denormalized) |
| `categoryName` | `String` | `CATEGORY_NAME` | Denormalized for display |
| `stockLocationId` | `Integer` | `STOCK_LOCATION_ID` | Optional — source bin/shelf |
| `locationName` | `String` | `LOCATION_NAME` | Denormalized for display |

---

### RetailSale

**Table:** `inventory_retail_sale`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `saleId` | `int` | `SALE_ID` | PK |
| `saleNumber` | `String` | `SALE_NUMBER` | Sale/invoice number |
| `customerName` | `String` | `CUSTOMER_NAME` | |
| `customerPhone` | `String` | `CUSTOMER_PHONE` | |
| `saleDate` | `Date` | `SALE_DATE` | |
| `totalAmount` | `String` | `TOTAL_AMOUNT` | |
| `discount` | `String` | `DISCOUNT` | |
| `paymentMethod` | `String` | `PAYMENT_METHOD` | `CASH` / `CARD` / `CREDIT` / `TRANSFER` |
| `status` | `String` | `STATUS` | `COMPLETED` / `REFUNDED` / `VOID` |
| `createdBy` | `String` | `CREATED_BY` | |
| `notes` | `String` | `NOTES` | TEXT column |
| `items` | `List<RetailSaleItem>` | — | `@OneToMany` cascade all |

---

### RetailSaleItem

**Table:** `inventory_retail_sale_item`

| Field | Type | Column | Notes |
|-------|------|--------|-------|
| `saleItemId` | `int` | `SALE_ITEM_ID` | PK |
| `sale` | `RetailSale` | `SALE_ID` | `@ManyToOne` FK |
| `itemId` | `int` | `ITEM_ID` | FK to Item |
| `itemName` | `String` | `ITEM_NAME` | Denormalized |
| `quantity` | `int` | `QUANTITY` | Sold qty |
| `unitPrice` | `String` | `UNIT_PRICE` | |
| `subTotal` | `String` | `SUB_TOTAL` | |
| `warehouseId` | `int` | `WAREHOUSE_ID` | Source warehouse |
| `categoryId` | `Integer` | `CATEGORY_ID` | FK to Category (denormalized) |
| `categoryName` | `String` | `CATEGORY_NAME` | Denormalized for display |
| `stockLocationId` | `Integer` | `STOCK_LOCATION_ID` | Optional — source bin/shelf |
| `locationName` | `String` | `LOCATION_NAME` | Denormalized for display |

---

## Existing Models (Pre-existing)

These models existed before this module and are referenced by the new entities:

| Model | Table | Key Fields |
|-------|-------|------------|
| `Item` | `inventory_item` | `itemId`, `name`, `sku`, `totalBalanceStock`, `totalBalanceStockValue`, `purchaseCost`, `sellingCost`, `categoryId`, `categoryName`, `allowNegativeStock`, `taxApplicable`, `taxExempted` |
| `Warehouse` | `warehouse` | `warehouseId`, `name` |
| `InventoryTransactions` | `inventory_transactions` | `transactionId`, `item`, `warehouse`, `quantity`, `balanceStock` |
| `ItemPriceHistory` | `inventory_item_price_history` | `historyId`, `itemId`, `itemName`, `fieldName`, `oldValue`, `newValue`, `changedBy`, `changedDate` |

:::tip Item ↔ Category Relationship
Each `Item` now has a `@ManyToOne` relationship to `Category` via `CATEGORY_ID`. The `categoryName` field is denormalized for display convenience. When creating or updating an item, include `categoryId` and `categoryName` in the JSON payload.
:::

---

### ItemTax

**Table:** `inventory_item_tax`

Stores multiple tax entries per item. Each item can have zero or more taxes with user-defined names and percentages.

| Field | Type | Column | Notes |
|-------|------|-----------|-------|
| `taxId` | `int` | `TAX_ID` | PK, auto-generated |
| `item` | `Item` | `ITEM_ID` | `@ManyToOne` FK, `@JsonIgnore` |
| `taxName` | `String` | `TAX_NAME` | e.g. "GST", "SST", "Service Tax" |
| `taxPercentage` | `double` | `TAX_PERCENTAGE` | e.g. 6.0 for 6% |

:::info Cascading
`ItemTax` entries are managed via `Item.taxes` (`@OneToMany`, cascade ALL, orphanRemoval). When editing an item, all old taxes are deleted and replaced with the new list from the JSON payload.
:::
