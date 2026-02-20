---
id: architecture
title: Architecture
sidebar_position: 2
---

# Architecture Overview

The Inventory module follows a **3-layer architecture** consistent with the rest of the TCMS application.

## Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│                   REST API Layer                     │
│  StockAPI · StockPurchaseOrderAPI · RetailSaleAPI    │
│  (JAX-RS @Path endpoints, auth, JSON parsing)       │
├─────────────────────────────────────────────────────┤
│                  Service Layer                       │
│  StockService · StockPurchaseOrderService            │
│  RetailSaleService · InventoryService                │
│  (Business logic, SafeSqlExecutor, stock updates)    │
├─────────────────────────────────────────────────────┤
│                  Model Layer                         │
│  Item · Warehouse · Category · StockLocation         │
│  StockAdjustment · StockPurchaseOrder · RetailSale   │
│  (JPA @Entity classes → MySQL tables)                │
├─────────────────────────────────────────────────────┤
│              Hibernate + MySQL 8                     │
│  Multi-tenant (schema-based) · HikariCP pool         │
└─────────────────────────────────────────────────────┘
```

## Request Flow

Every API request follows this pattern:

```
Client Request
    │
    ▼
┌─── JAX-RS Endpoint ───┐
│ 1. Parse JSON body     │
│ 2. Validate authKey    │◄── TmsUtil.checkIfAuthKeyIsValid()
│ 3. Extract tenantId    │◄── TmsUtil.getTenantIdFromServlet()
│ 4. Call service method │
│ 5. Serialize response  │◄── Gson / JSONObject
│ 6. Return Response     │
└────────────────────────┘
         │
         ▼
┌─── Service Layer ─────┐
│ SafeSqlExecutor {      │
│   exe(Session session) │◄── Hibernate session per tenant
│     → HQL / SQL query  │
│     → entity CRUD      │
│     → business logic   │
│ }                      │
│ ArgHelper → result     │
└────────────────────────┘
```

## Key Patterns

### SafeSqlExecutor

All database operations are wrapped in `SafeSqlExecutor`, which provides:
- Automatic Hibernate `Session` management
- Transaction begin/commit/rollback
- Multi-tenant schema routing via `tenantId`

```java
SafeSqlExecutor sqlExecute = new SafeSqlExecutor() {
    @Override
    public void onRollBack() { /* handle rollback */ }

    @Override
    public void exe(Session session) {
        // Your database operations here
        session.save(entity);
        args.put("result", true);
    }
};
sqlExecute.run(tenantId);
```

### ArgHelper

`ArgHelper` is used to pass results out of the anonymous `SafeSqlExecutor` class:

```java
final ArgHelper args = new ArgHelper();
args.put("updated", false);
// ... inside exe():
args.put("updated", true);
// ... after run():
return args.get("updated", Boolean.class);
```

### Authentication Pattern

Every endpoint validates the auth key before processing:

```java
boolean keyIsValid = TmsUtil.checkIfAuthKeyIsValid(
    userName, authKey, TmsUtil.getTenantIdFromServlet(request)
);
if (!keyIsValid) {
    return Response.status(401)
        .header("Access-Control-Allow-Origin", "*").build();
}
```

### JSON Response Pattern

All responses follow the same structure:

```json
{
  "data": "<result_object_or_array>",
  "error": "<optional_error_message>"
}
```

## Multi-Tenancy

The application uses **schema-based multi-tenancy**:
- Each tenant has its own database schema
- `TmsUtil.getTenantIdFromServlet(request)` extracts the tenant from the request
- `SafeSqlExecutor.run(tenantId)` routes the Hibernate session to the correct schema
- All tables are auto-created per tenant via `hbm2ddl.auto=update`

## Configuration Files

| File | Purpose |
|------|---------|
| `hibernate.cfg.xml` | Entity mappings, connection pool, multi-tenancy config |
| `web.xml` | Jersey servlet config with package scanning for `in.greenorange.inventory.api` |

:::info No web.xml Changes Required
The Jersey servlet in `web.xml` already scans the `in.greenorange.inventory.api` package, so new API classes are auto-discovered.
:::
