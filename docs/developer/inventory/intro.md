---
id: intro
title: Getting Started
sidebar_position: 1
---

# Inventory & Stock Management Module

Welcome to the developer documentation for the **TCMS Inventory Module** — a comprehensive REST API module for managing parts, retail stock, purchase orders, and sales for a retail business or workshop.

## Overview

The Inventory module provides a complete set of REST APIs organized into three functional areas:

| API Group | Base Path | Purpose |
|-----------|-----------|---------|
| **Stock API** | `/rest/inventory/stock/` | Categories, stock locations, adjustments, low-stock alerts |
| **Purchase Order API** | `/rest/inventory/purchaseOrder/` | Full PO lifecycle management |
| **Retail Sale API** | `/rest/inventory/sale/` | Sales with automatic stock management |

:::tip Quick Links
- [Architecture Overview](./architecture) — Understand how the module is structured
- [Data Models](./data-models) — Database schema and entity relationships
- [Workflow Guide](./workflow) — Business processes and stock flow
- [API Reference](./api/authentication) — Complete endpoint documentation
:::

## Key Features

- **Multi-tenant** — All operations are scoped to tenant via `TmsUtil.getTenantIdFromServlet()`
- **Auth-protected** — Every endpoint validates authentication via `authKey`
- **Automatic stock tracking** — Stock levels auto-update on PO receiving, sales, adjustments, and voids
- **Category & location management** — Organize items by type and physical location
- **Purchase order lifecycle** — Draft → Ordered → Partial → Received workflow
- **Low stock alerts** — Query items below a configurable threshold

## Tech Stack

| Technology | Usage |
|-----------|-------|
| **JAX-RS (Jersey)** | REST endpoints via `@Path`, `@GET`, `@POST` |
| **Hibernate** | ORM with `hbm2ddl.auto=update` for auto-schema |
| **Gson / JSONObject** | Request parsing and response serialization |
| **SafeSqlExecutor** | Thread-safe Hibernate session management |
| **MySQL 8** | Database via `MySQL8Dialect` |

## Package Structure

```
in.greenorange.inventory/
├── api/                          # REST API controllers
│   ├── InventoryControllerAPI.java  # Existing (items, warehouses, transactions)
│   ├── StockAPI.java               # Categories, locations, adjustments
│   ├── StockPurchaseOrderAPI.java   # Purchase order management
│   └── RetailSaleAPI.java          # Sales management
├── model/                        # JPA entities
│   ├── Item.java                    # Existing
│   ├── Warehouse.java               # Existing
│   ├── InventoryTransactions.java   # Existing
│   ├── Inventory.java               # Existing (placeholder)
│   ├── Category.java                # NEW
│   ├── StockLocation.java           # NEW
│   ├── StockAdjustment.java         # NEW
│   ├── StockPurchaseOrder.java      # NEW
│   ├── StockPurchaseOrderItem.java  # NEW
│   ├── RetailSale.java             # NEW
│   └── RetailSaleItem.java         # NEW
└── service/                      # Business logic
    ├── InventoryService.java        # Existing
    ├── StockService.java            # NEW
    ├── StockPurchaseOrderService.java # NEW
    └── RetailSaleService.java       # NEW
```
