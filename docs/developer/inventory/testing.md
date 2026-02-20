---
id: testing
title: Testing Guide
sidebar_position: 6
---

# Testing Guide

This page provides a step-by-step testing workflow to verify the Inventory module after deployment.

## Prerequisites

- TCMS application deployed on Tomcat
- A valid `userName` and `authKey` for API access
- An HTTP client (Postman, cURL, or similar)
- Base URL: `http://localhost:8080/tcms/rest`

## Test Workflow

Follow these steps in order — each step builds on the previous.

### Step 1: Create a Warehouse

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/createWarehouse \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "branch": "HQ",
    "edit": false,
    "warehouse": { "name": "Main Warehouse" }
  }'
```

✅ **Expected:** `{ "data": true, "error": "" }`

---

### Step 2: Create Items

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/createItem \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "branch": "HQ",
    "edit": false,
    "item": { "name": "Oil Filter", "sku": "OF-001", "active": true, "categoryId": 1, "categoryName": "Engine Parts" }
  }'
```

Repeat for a second item:

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/createItem \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "branch": "HQ",
    "edit": false,
    "item": { "name": "Brake Pad", "sku": "BP-001", "active": true, "categoryId": 1, "categoryName": "Engine Parts" }
  }'
```

---

### Step 3: Create a Category

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/stock/createCategory \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "edit": false,
    "category": { "name": "Engine Parts", "description": "Engine-related parts" }
  }'
```

✅ **Verify:** `GET /rest/inventory/stock/categories/admin/YOUR_AUTH_KEY`

---

### Step 4: Create a Stock Location

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/stock/createStockLocation \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "edit": false,
    "stockLocation": {
      "name": "A-01-01",
      "description": "Rack A, Shelf 1, Bin 1",
      "warehouse": { "warehouseId": 1 }
    }
  }'
```

✅ **Verify:** `GET /rest/inventory/stock/stockLocations/admin/YOUR_AUTH_KEY`

---

### Step 5: Create a Purchase Order

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/purchaseOrder/create \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "edit": false,
    "purchaseOrder": {
      "poNumber": "PO-TEST-001",
      "supplierName": "Test Supplier",
      "status": "DRAFT",
      "totalAmount": "750.00",
      "items": [
        { "itemId": 1, "itemName": "Oil Filter", "quantity": 50, "unitPrice": "5.00", "subTotal": "250.00", "categoryId": 1, "categoryName": "Engine Parts" },
        { "itemId": 2, "itemName": "Brake Pad", "quantity": 25, "unitPrice": "20.00", "subTotal": "500.00", "categoryId": 1, "categoryName": "Engine Parts" }
      ]
    }
  }'
```

✅ **Verify:** `GET /rest/inventory/purchaseOrder/list/admin/YOUR_AUTH_KEY`

---

### Step 6: Update PO Status → ORDERED

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/purchaseOrder/updateStatus \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "poId": 1,
    "status": "ORDERED"
  }'
```

---

### Step 7: Receive Goods (Partial)

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/purchaseOrder/receive \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "poId": 1,
    "receivedItems": [
      { "itemId": 1, "receivedQuantity": 50 },
      { "itemId": 2, "receivedQuantity": 15 }
    ]
  }'
```

✅ **Verify:**
- PO status should be `PARTIAL` (Brake Pad: 15/25 received)
- Item "Oil Filter" `totalBalanceStock` should have increased by 50
- Item "Brake Pad" `totalBalanceStock` should have increased by 15

---

### Step 8: Receive Remaining Goods

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/purchaseOrder/receive \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "poId": 1,
    "receivedItems": [
      { "itemId": 2, "receivedQuantity": 10 }
    ]
  }'
```

✅ **Verify:** PO status should now be `RECEIVED`

---

### Step 9: Create a Sale

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/sale/create \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "sale": {
      "saleNumber": "INV-TEST-001",
      "customerName": "Test Customer",
      "paymentMethod": "CASH",
      "totalAmount": "30.00",
      "items": [
        { "itemId": 1, "itemName": "Oil Filter", "quantity": 3, "unitPrice": "10.00", "subTotal": "30.00", "warehouseId": 1, "categoryId": 1, "categoryName": "Engine Parts" }
      ]
    }
  }'
```

✅ **Verify:** Item "Oil Filter" `totalBalanceStock` should have decreased by 3

---

### Step 10: Void the Sale

```bash
curl -X GET "http://localhost:8080/tcms/rest/inventory/sale/void/1/admin/YOUR_AUTH_KEY"
```

✅ **Verify:**
- Sale status should be `VOID`
- Item "Oil Filter" `totalBalanceStock` should be restored (increased by 3)

---

### Step 11: Test Stock Adjustment

```bash
curl -X POST http://localhost:8080/tcms/rest/inventory/stock/createAdjustment \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "userName": "admin",
    "adjustment": {
      "itemId": 1,
      "warehouseId": 1,
      "adjustmentType": "DECREASE",
      "quantity": 2,
      "reason": "Damaged units",
      "adjustedBy": "admin",
      "itemName": "Oil Filter",
      "warehouseName": "Main Warehouse"
    }
  }'
```

✅ **Verify:**  `totalBalanceStock` decreased by 2

---

### Step 12: Check Low Stock

```bash
curl -X GET "http://localhost:8080/tcms/rest/inventory/stock/lowStock/100/admin/YOUR_AUTH_KEY"
```

✅ **Verify:** Returns items with stock ≤ 100

---

## Verification Checklist

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Create warehouse | `data: true` |
| 2 | Create items | `data: true` |
| 3 | Create category | `data: true`, verify list |
| 4 | Create location | `data: true`, verify list |
| 5 | Create PO | `data: true`, verify list |
| 6 | Update PO status | Status → ORDERED |
| 7 | Partial receive | Status → PARTIAL, stock up |
| 8 | Full receive | Status → RECEIVED |
| 9 | Create sale | Stock decremented |
| 10 | Void sale | Stock restored, status → VOID |
| 11 | Stock adjustment | Stock changed by adjustment |
| 12 | Low stock query | Returns low-stock items |
| 13 | Items by category | Returns items in the given category |

---

### Step 13: Get Items by Category

```bash
curl -X GET "http://localhost:8080/tcms/rest/inventory/stock/items/category/1/admin/YOUR_AUTH_KEY"
```

✅ **Verify:** Returns all active items where `categoryId = 1` (Engine Parts)
