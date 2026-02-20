---
id: sql-setup
title: SQL Setup
sidebar_position: 7
---

# SQL Setup

While Hibernate `hbm2ddl.auto=update` auto-creates tables on startup, use these scripts for **manual setup**, **migration**, or **database review**.

---

## New Tables

These tables are created by the new Inventory & Stock Management module.

### inventory_category

```sql
CREATE TABLE inventory_category (
    CATEGORY_ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    DESCRIPTION VARCHAR(255),
    active TINYINT(1) DEFAULT 1,
    CREATED_DATE DATETIME
);
```

### inventory_stock_location

```sql
CREATE TABLE inventory_stock_location (
    LOCATION_ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    DESCRIPTION VARCHAR(255),
    active TINYINT(1) DEFAULT 1,
    WAREHOUSE_ID INT,
    FOREIGN KEY (WAREHOUSE_ID) REFERENCES warehouse(warehouseId)
);
```

### inventory_stock_adjustment

```sql
CREATE TABLE inventory_stock_adjustment (
    ADJUSTMENT_ID INT AUTO_INCREMENT PRIMARY KEY,
    ITEM_ID INT,
    ITEM_NAME VARCHAR(255),
    WAREHOUSE_ID INT,
    WAREHOUSE_NAME VARCHAR(255),
    ADJUSTMENT_TYPE VARCHAR(50),
    QUANTITY INT DEFAULT 0,
    REASON VARCHAR(500),
    ADJUSTED_BY VARCHAR(255),
    ADJUSTMENT_DATE DATETIME,
    STOCK_LOCATION_ID INT,
    LOCATION_NAME VARCHAR(255),
    FOREIGN KEY (ITEM_ID) REFERENCES inventory_item(itemId),
    FOREIGN KEY (WAREHOUSE_ID) REFERENCES warehouse(warehouseId)
);
```

### inventory_item_stock_location

```sql
CREATE TABLE inventory_item_stock_location (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ITEM_ID INT,
    ITEM_NAME VARCHAR(255),
    STOCK_LOCATION_ID INT,
    LOCATION_NAME VARCHAR(255),
    WAREHOUSE_ID INT,
    WAREHOUSE_NAME VARCHAR(255),
    QUANTITY INT DEFAULT 0,
    CATEGORY_ID INT,
    CATEGORY_NAME VARCHAR(255),
    UPDATED_DATE DATETIME,
    ACTIVE TINYINT(1) DEFAULT 1,
    FOREIGN KEY (ITEM_ID) REFERENCES inventory_item(itemId),
    FOREIGN KEY (STOCK_LOCATION_ID) REFERENCES inventory_stock_location(LOCATION_ID)
);
```

### inventory_purchase_order

```sql
CREATE TABLE inventory_purchase_order (
    PO_ID INT AUTO_INCREMENT PRIMARY KEY,
    PO_NUMBER VARCHAR(255),
    SUPPLIER_ID VARCHAR(255),
    SUPPLIER_NAME VARCHAR(255),
    ORDER_DATE DATETIME,
    EXPECTED_DELIVERY_DATE DATETIME,
    STATUS VARCHAR(50) DEFAULT 'DRAFT',
    TOTAL_AMOUNT VARCHAR(50),
    NOTES TEXT,
    CREATED_BY VARCHAR(255),
    CREATED_DATE DATETIME
);
```

### inventory_purchase_order_item

```sql
CREATE TABLE inventory_purchase_order_item (
    PO_ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
    PO_ID INT NOT NULL,
    ITEM_ID INT,
    ITEM_NAME VARCHAR(255),
    QUANTITY INT DEFAULT 0,
    RECEIVED_QUANTITY INT DEFAULT 0,
    UNIT_PRICE VARCHAR(50),
    SUB_TOTAL VARCHAR(50),
    CATEGORY_ID INT,
    CATEGORY_NAME VARCHAR(255),
    STOCK_LOCATION_ID INT,
    LOCATION_NAME VARCHAR(255),
    FOREIGN KEY (PO_ID) REFERENCES inventory_purchase_order(PO_ID)
);
```

### inventory_retail_sale

```sql
CREATE TABLE inventory_retail_sale (
    SALE_ID INT AUTO_INCREMENT PRIMARY KEY,
    SALE_NUMBER VARCHAR(255),
    CUSTOMER_NAME VARCHAR(255),
    CUSTOMER_PHONE VARCHAR(255),
    SALE_DATE DATETIME,
    TOTAL_AMOUNT VARCHAR(50),
    DISCOUNT VARCHAR(50),
    PAYMENT_METHOD VARCHAR(50),
    STATUS VARCHAR(50) DEFAULT 'COMPLETED',
    CREATED_BY VARCHAR(255),
    NOTES TEXT,
    CREATED_DATE DATETIME
);
```

### inventory_retail_sale_item

```sql
CREATE TABLE inventory_retail_sale_item (
    SALE_ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
    SALE_ID INT NOT NULL,
    ITEM_ID INT,
    ITEM_NAME VARCHAR(255),
    QUANTITY INT DEFAULT 0,
    UNIT_PRICE VARCHAR(50),
    SUB_TOTAL VARCHAR(50),
    WAREHOUSE_ID INT,
    CATEGORY_ID INT,
    CATEGORY_NAME VARCHAR(255),
    STOCK_LOCATION_ID INT,
    LOCATION_NAME VARCHAR(255),
    FOREIGN KEY (SALE_ID) REFERENCES inventory_retail_sale(SALE_ID)
);
```

### inventory_po_item_tax

```sql
CREATE TABLE inventory_po_item_tax (
    TAX_ID INT AUTO_INCREMENT PRIMARY KEY,
    PO_ITEM_ID INT NOT NULL,
    TAX_NAME VARCHAR(255),
    TAX_PERCENTAGE DOUBLE,
    TAX_AMOUNT VARCHAR(50),
    FOREIGN KEY (PO_ITEM_ID) REFERENCES inventory_purchase_order_item(PO_ITEM_ID)
);
```

### inventory_retail_sale_item_tax

```sql
CREATE TABLE inventory_retail_sale_item_tax (
    TAX_ID INT AUTO_INCREMENT PRIMARY KEY,
    SALE_ITEM_ID INT NOT NULL,
    TAX_NAME VARCHAR(255),
    TAX_PERCENTAGE DOUBLE,
    TAX_AMOUNT VARCHAR(50),
    FOREIGN KEY (SALE_ITEM_ID) REFERENCES inventory_retail_sale_item(SALE_ITEM_ID)
);
```

### inventory_item_tax

```sql
CREATE TABLE inventory_item_tax (
    TAX_ID INT AUTO_INCREMENT PRIMARY KEY,
    ITEM_ID INT NOT NULL,
    TAX_NAME VARCHAR(255),
    TAX_PERCENTAGE DOUBLE,
    FOREIGN KEY (ITEM_ID) REFERENCES inventory_item(itemId)
);
```

### inventory_item_price_history

```sql
CREATE TABLE inventory_item_price_history (
    HISTORY_ID INT AUTO_INCREMENT PRIMARY KEY,
    ITEM_ID INT NOT NULL,
    ITEM_NAME VARCHAR(255),
    FIELD_NAME VARCHAR(50),
    OLD_VALUE VARCHAR(50),
    NEW_VALUE VARCHAR(50),
    CHANGED_BY VARCHAR(255),
    CHANGED_DATE DATETIME,
    FOREIGN KEY (ITEM_ID) REFERENCES inventory_item(itemId)
);
```

---

## ALTER TABLE — Existing Tables

These statements add new columns to **pre-existing** tables that were modified for the category integration.

### inventory_item (add category fields & UOM)

```sql
ALTER TABLE inventory_item
    ADD COLUMN CATEGORY_ID INT,
    ADD COLUMN CATEGORY_NAME VARCHAR(255),
    ADD COLUMN UOM VARCHAR(50);
```

### inventory_transactions (add category fields)

```sql
ALTER TABLE inventory_transactions
    ADD COLUMN CATEGORY_ID INT,
    ADD COLUMN CATEGORY_NAME VARCHAR(255);
```

### inventory_stock_adjustment (add location fields)

```sql
ALTER TABLE inventory_stock_adjustment
    ADD COLUMN STOCK_LOCATION_ID INT,
    ADD COLUMN LOCATION_NAME VARCHAR(255),
    ADD COLUMN UOM VARCHAR(50);
```

### inventory_purchase_order (add tax fields)

```sql
ALTER TABLE inventory_purchase_order
    ADD COLUMN TOTAL_TAX_AMOUNT VARCHAR(50);
```

### inventory_purchase_order_item (add location fields)

```sql
ALTER TABLE inventory_purchase_order_item
    ADD COLUMN STOCK_LOCATION_ID INT,
    ADD COLUMN LOCATION_NAME VARCHAR(255),
    ADD COLUMN UOM VARCHAR(50),
    ADD COLUMN TAX_AMOUNT VARCHAR(50);
```

### inventory_retail_sale (add tax fields)

```sql
ALTER TABLE inventory_retail_sale
    ADD COLUMN TOTAL_TAX_AMOUNT VARCHAR(50);
```

### inventory_retail_sale_item (add location fields)

```sql
ALTER TABLE inventory_retail_sale_item
    ADD COLUMN STOCK_LOCATION_ID INT,
    ADD COLUMN LOCATION_NAME VARCHAR(255),
    ADD COLUMN UOM VARCHAR(50),
    ADD COLUMN TAX_AMOUNT VARCHAR(50);
```

### inventory_item (add tax, stock control & cost fields)

```sql
ALTER TABLE inventory_item
    ADD COLUMN ALLOW_NEGATIVE_STOCK TINYINT(1) DEFAULT 0,
    ADD COLUMN TAX_APPLICABLE TINYINT(1) DEFAULT 0,
    ADD COLUMN TAX_EXEMPTED TINYINT(1) DEFAULT 0,
    ADD COLUMN PURCHASE_COST VARCHAR(50),
    ADD COLUMN SELLING_COST VARCHAR(50);
```

---

## Quick Reference

| Table | Type | Purpose |
|-------|------|---------|
| `inventory_category` | NEW | Item categories |
| `inventory_stock_location` | NEW | Bin/shelf locations within warehouses |
| `inventory_stock_adjustment` | NEW | Manual stock increase/decrease records |
| `inventory_item_stock_location` | NEW | Bridge: item quantities per location |
| `inventory_purchase_order` | NEW | Purchase order headers |
| `inventory_purchase_order_item` | NEW | PO line items |
| `inventory_retail_sale` | NEW | Sale headers |
| `inventory_retail_sale_item` | NEW | Sale line items |
| `inventory_item_tax` | NEW | Per-item tax names and percentages |
| `inventory_item_price_history` | NEW | Price change audit trail |
| `inventory_item` | ALTER | Added `CATEGORY_ID`, `CATEGORY_NAME`, `ALLOW_NEGATIVE_STOCK`, `TAX_APPLICABLE`, `TAX_EXEMPTED`, `PURCHASE_COST`, `SELLING_COST` |
| `inventory_transactions` | ALTER | Added `CATEGORY_ID`, `CATEGORY_NAME` |

:::warning Execution Order
Run CREATE TABLE statements **before** ALTER TABLE statements. The foreign keys in `inventory_stock_adjustment` and `inventory_item_stock_location` depend on `inventory_item`, `warehouse`, and `inventory_stock_location` already existing.
:::

:::tip Hibernate Auto-Create
If `hbm2ddl.auto=update` is set in `hibernate.cfg.xml`, these tables and columns are created **automatically** on application startup. These scripts are provided for manual setup, auditing, or environments where auto-DDL is disabled.
:::
