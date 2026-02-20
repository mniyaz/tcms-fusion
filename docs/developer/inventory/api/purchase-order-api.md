---
id: purchase-order-api
title: Purchase Order API
sidebar_position: 3
---

# Purchase Order API

**Base Path:** `/rest/inventory/purchaseOrder/`

Manages the full lifecycle of stock purchase orders: create, update, receive goods, and delete.

---

## Create / Update Purchase Order

```
POST /rest/inventory/purchaseOrder/create
```

**Request Body (Create):**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "edit": false,
  "purchaseOrder": {
    "poNumber": "PO-2026-001",
    "supplierId": "SUP001",
    "supplierName": "AutoParts Sdn Bhd",
    "orderDate": "2026-02-20T00:00:00.000+0530",
    "expectedDeliveryDate": "2026-02-25T00:00:00.000+0530",
    "status": "DRAFT",
    "totalAmount": "1500.00",
    "notes": "Monthly parts restock",
    "createdBy": "admin",
    "items": [
      {
        "itemId": 1,
        "itemName": "Oil Filter",
        "quantity": 100,
        "unitPrice": "5.00",
        "subTotal": "500.00",
        "taxAmount": "50.00",
        "categoryId": 1,
        "categoryName": "Engine Parts",
        "taxes": [
          { "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "50.00" }
        ]
      },
      {
        "itemId": 2,
        "itemName": "Brake Pad",
        "quantity": 50,
        "unitPrice": "20.00",
        "subTotal": "1000.00",
        "taxAmount": "0.00",
        "categoryId": 2,
        "categoryName": "Brake System",
        "taxes": []
      }
    ]
  }
}
```

:::info Automatic Tax Calculation
When creating a Purchase Order, you do not strictly need to send the `taxes` array. The backend will automatically fetch the taxes configured on the `Item` master and apply them to your line items. However, if you include them (as shown above), they will be recorded as part of the line item.
:::

**Request Body (Update):**

Set `edit: true`. The existing items are cleared and replaced with the new items list:

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "edit": true,
  "purchaseOrder": {
    "poId": 1,
    "poNumber": "PO-2026-001",
    "totalAmount": "2000.00",
    "items": [
      { "itemId": 1, "itemName": "Oil Filter", "quantity": 100, "unitPrice": "5.00", "subTotal": "500.00", "categoryId": 1, "categoryName": "Engine Parts", "taxes": [] },
      { "itemId": 2, "itemName": "Brake Pad", "quantity": 50, "unitPrice": "20.00", "subTotal": "1000.00", "categoryId": 2, "categoryName": "Brake System", "taxes": [] },
      { "itemId": 3, "itemName": "Spark Plug", "quantity": 100, "unitPrice": "5.00", "subTotal": "500.00", "categoryId": 1, "categoryName": "Engine Parts", "taxes": [] }
    ]
  }
}
```

**Response:**

```json
{ "data": true }
```

---

## List All Purchase Orders

```
GET /rest/inventory/purchaseOrder/list/{userName}/{authKey}
```

Returns all POs sorted by `createdDate` descending, including their line items.

**Response:**

```json
{
  "data": [
    {
      "poId": 1,
      "poNumber": "PO-2026-001",
      "supplierId": "SUP001",
      "supplierName": "AutoParts Sdn Bhd",
      "orderDate": "2026-02-20T00:00:00.000+0530",
      "expectedDeliveryDate": "2026-02-25T00:00:00.000+0530",
      "status": "DRAFT",
      "totalAmount": "1500.00",
      "totalTaxAmount": "150.00",
      "createdBy": "admin",
      "items": [
        { 
          "poItemId": 1, "itemId": 1, "itemName": "Oil Filter", "quantity": 100, 
          "receivedQuantity": 0, "unitPrice": "5.00", "subTotal": "500.00", 
          "taxAmount": "50.00", "categoryId": 1, "categoryName": "Engine Parts",
          "taxes": [
            { "taxId": 1, "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "50.00" }
          ]
        },
        { 
          "poItemId": 2, "itemId": 2, "itemName": "Brake Pad", "quantity": 50, 
          "receivedQuantity": 0, "unitPrice": "20.00", "subTotal": "1000.00", 
          "taxAmount": "0.00", "categoryId": 2, "categoryName": "Brake System",
          "taxes": []
        }
      ]
    }
  ]
}
```

---

## Get Purchase Order by ID

```
GET /rest/inventory/purchaseOrder/get/{poId}/{userName}/{authKey}
```

**Response:**

```json
{
  "data": {
    "poId": 1,
    "poNumber": "PO-2026-001",
    "status": "ORDERED",
    "totalAmount": "1500.00",
    "totalTaxAmount": "150.00",
    "items": [
      {
        "poItemId": 1,
        "itemId": 1,
        "itemName": "Oil Filter",
        "taxAmount": "50.00",
        "taxes": [
          { "taxId": 1, "taxName": "GST", "taxPercentage": 10.0, "taxAmount": "50.00" }
        ]
      }
    ]
  }
}
```

---

## Update PO Status

```
POST /rest/inventory/purchaseOrder/updateStatus
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "poId": 1,
  "status": "ORDERED"
}
```

**Valid Status Values:**

| Status | Description |
|--------|-------------|
| `DRAFT` | PO created but not yet sent to supplier |
| `ORDERED` | PO has been sent/confirmed with supplier |
| `PARTIAL` | Some items received, others pending |
| `RECEIVED` | All items fully received |
| `CANCELLED` | PO cancelled |

**Response:**

```json
{ "data": true }
```

---

## Receive Goods

This is the most important endpoint — it updates stock levels when goods arrive.

```
POST /rest/inventory/purchaseOrder/receive
```

**Request Body:**

```json
{
  "authKey": "abc123",
  "userName": "admin",
  "poId": 1,
  "receivedItems": [
    { "itemId": 1, "receivedQuantity": 100, "stockLocationId": 1, "locationName": "A-01-03" },
    { "itemId": 2, "receivedQuantity": 30 }
  ]
}
```

:::info Side Effects
For each received item:
1. `StockPurchaseOrderItem.receivedQuantity` += `receivedQuantity`
2. `Item.totalBalanceStock` += `receivedQuantity`
3. `Item.totalBalanceStockValue` += `receivedQuantity × unitPrice`
4. If `stockLocationId` is provided → `ItemStockLocation.quantity` += `receivedQuantity`
5. PO status auto-transitions:
   - **All items fully received** → `RECEIVED`
   - **Any item partially received** → `PARTIAL`
:::

**Response:**

```json
{ "data": true }
```

:::tip Partial Receiving
You can call this endpoint multiple times. The `receivedQuantity` accumulates:
- First receive: 30 of 50 items → status = `PARTIAL`
- Second receive: 20 of 50 items → status = `RECEIVED`
:::

---

## Delete Purchase Order

Deletes a PO, but **only if its status is `DRAFT`**.

```
GET /rest/inventory/purchaseOrder/delete/{poId}/{userName}/{authKey}
```

**Response:**

```json
{ "data": true }
```

If the PO is not in `DRAFT` status:

```json
{ "data": false }
```
