---
id: workflow
title: Workflow Guide
sidebar_position: 4
---

# Workflow Guide

This page documents the key business workflows and how stock levels are managed across different operations.

## Stock Flow Overview

```
                    ┌─────────────────┐
                    │    Supplier      │
                    └────────┬────────┘
                             │
                    Purchase Order (receive)
                             │ + Stock
                             ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Adjustment   │──▶│     Item      │◀──│   Void Sale   │
│  (INCREASE)   │   │  Stock Level  │   │   (restore)   │
└───────────────┘   │               │   └───────────────┘
                    │ totalBalance  │
┌───────────────┐   │    Stock      │   ┌───────────────┐
│  Adjustment   │◀──│               │──▶│  Retail Sale  │
│  (DECREASE)   │   └───────────────┘   │  (deduct)     │
└───────────────┘           │           └───────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Customer    │
                    └───────────────┘
```

## 1. Purchase Order Lifecycle

The purchase order goes through discrete status transitions:

```
  DRAFT ──▶ ORDERED ──▶ PARTIAL ──▶ RECEIVED
    │                                    
    ▼                                    
  CANCELLED                              
```

### Step-by-Step

#### 1.1 Create a Draft PO

```bash
POST /rest/inventory/purchaseOrder/create
```

```json
{
  "authKey": "abc", "userName": "admin", "edit": false,
  "purchaseOrder": {
    "poNumber": "PO-2026-001",
    "supplierId": "SUP001",
    "supplierName": "AutoParts Sdn Bhd",
    "status": "DRAFT",
    "totalAmount": "1500.00",
    "notes": "Monthly parts restock",
    "items": [
      { "itemId": 1, "itemName": "Oil Filter", "quantity": 100, "unitPrice": "5.00", "subTotal": "500.00" },
      { "itemId": 2, "itemName": "Brake Pad", "quantity": 50, "unitPrice": "20.00", "subTotal": "1000.00" }
    ]
  }
}
```

:::note
At this stage, **no stock changes occur**. The PO is just a record.
:::

#### 1.2 Update Status to ORDERED

```bash
POST /rest/inventory/purchaseOrder/updateStatus
```

```json
{ "authKey": "abc", "userName": "admin", "poId": 1, "status": "ORDERED" }
```

#### 1.3 Receive Goods (Partial or Full)

```bash
POST /rest/inventory/purchaseOrder/receive
```

```json
{
  "authKey": "abc", "userName": "admin", "poId": 1,
  "receivedItems": [
    { "itemId": 1, "receivedQuantity": 100 },
    { "itemId": 2, "receivedQuantity": 30 }
  ]
}
```

:::info What Happens on Receive
1. Each `StockPurchaseOrderItem.receivedQuantity` is incremented
2. Each `Item.totalBalanceStock` is increased by the received amount
3. Each `Item.totalBalanceStockValue` is updated: `+= receivedQty × unitPrice`
4. PO status auto-transitions:
   - All items fully received → **RECEIVED**
   - Some items partially received → **PARTIAL**
:::

#### 1.4 Receive Remaining Goods

Call the `/receive` endpoint again with the remaining quantities. The system accumulates `receivedQuantity` and will auto-set status to `RECEIVED` when all items are fully received.

---

## 2. Retail Sale Workflow

### 2.1 Create a Sale

```bash
POST /rest/inventory/sale/create
```

```json
{
  "authKey": "abc", "userName": "admin",
  "sale": {
    "saleNumber": "INV-2026-0042",
    "customerName": "Ali bin Ahmad",
    "customerPhone": "0123456789",
    "paymentMethod": "CASH",
    "totalAmount": "65.00",
    "discount": "5.00",
    "items": [
      { "itemId": 1, "itemName": "Oil Filter", "quantity": 3, "unitPrice": "10.00", "subTotal": "30.00", "warehouseId": 1 },
      { "itemId": 3, "itemName": "Spark Plug", "quantity": 5, "unitPrice": "7.00", "subTotal": "35.00", "warehouseId": 1 }
    ]
  }
}
```

:::info What Happens on Sale
1. The sale record and line items are saved
2. For each line item, `Item.totalBalanceStock` is **decremented** by the sold quantity
3. `Item.totalBalanceStockValue` is reduced: `-= soldQty × unitPrice` (minimum 0)
:::

### 2.2 Void a Sale

If a sale needs to be reversed:

```bash
GET /rest/inventory/sale/void/{saleId}/{userName}/{authKey}
```

:::warning What Happens on Void
1. Sale status changes to `VOID`
2. For each line item, `Item.totalBalanceStock` is **restored** (increased back)
3. `Item.totalBalanceStockValue` is restored
4. A sale can only be voided **once** — already voided sales are ignored
:::

---

## 3. Stock Adjustment Workflow

Manual adjustments handle cases outside normal purchase/sale flows:

| Scenario | Adjustment Type | Effect on Stock |
|----------|----------------|-----------------|
| Physical count found extra units | `INCREASE` | Stock goes **up** |
| Damaged goods written off | `DECREASE` | Stock goes **down** |
| Customer return | `INCREASE` | Stock goes **up** |
| Theft or loss | `DECREASE` | Stock goes **down** |
| Stock transfer between warehouses | Both | One `DECREASE`, one `INCREASE` |

### Example: Write Off Damaged Stock

```bash
POST /rest/inventory/stock/createAdjustment
```

```json
{
  "authKey": "abc", "userName": "admin",
  "adjustment": {
    "itemId": 1,
    "warehouseId": 1,
    "adjustmentType": "DECREASE",
    "quantity": 5,
    "reason": "Water damage during storage",
    "adjustedBy": "admin",
    "itemName": "Oil Filter",
    "warehouseName": "Main Warehouse"
  }
}
```

---

## 4. Low Stock Monitoring

Query for items that are running low:

```bash
GET /rest/inventory/stock/lowStock/10/{userName}/{authKey}
```

This returns all active items where `totalBalanceStock <= 10`. Use this to trigger reorder workflows.

---

## Stock Level Summary

| Operation | Effect on `totalBalanceStock` |
|-----------|------------------------------|
| PO Receive | **+ receivedQuantity** |
| Sale Create | **− soldQuantity** |
| Sale Void | **+ restoredQuantity** |
| Adjustment INCREASE | **+ quantity** |
| Adjustment DECREASE | **− quantity** |

:::tip Best Practice
Always check low stock levels after bulk sales or adjustments to identify items that need reordering.
:::
