---
id: authentication
title: Authentication
sidebar_position: 1
---

# Authentication

All Inventory module APIs require authentication. This page explains the auth mechanism used across every endpoint.

## Auth Mechanism

The module uses a **key-based authentication** system via `TmsUtil.checkIfAuthKeyIsValid()`.

### Required Parameters

Every API call must include:

| Parameter | Location | Description |
|-----------|----------|-------------|
| `userName` | Path param (GET) or JSON body (POST) | The username of the authenticated user |
| `authKey` | Path param (GET) or JSON body (POST) | The user's authentication key/token |

### GET Requests

Auth parameters are passed as **path segments**:

```
GET /rest/inventory/stock/categories/{userName}/{authKey}
```

**Example:**

```bash
curl -X GET "http://localhost:8080/tcms/rest/inventory/stock/categories/admin/a1b2c3d4e5"
```

### POST Requests

Auth parameters are passed in the **JSON body**:

```json
{
  "authKey": "a1b2c3d4e5",
  "userName": "admin",
  ...
}
```

**Example:**

```bash
curl -X POST "http://localhost:8080/tcms/rest/inventory/stock/createCategory" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "a1b2c3d4e5",
    "userName": "admin",
    "edit": false,
    "category": { "name": "Engine Parts" }
  }'
```

## Response on Auth Failure

If the auth key is invalid, the API returns:

```
HTTP 401 Unauthorized
```

With header:
```
Access-Control-Allow-Origin: *
```

## Multi-Tenancy

The tenant is **not** passed by the client. It is automatically extracted from the HTTP request by the server:

```java
String tenantId = TmsUtil.getTenantIdFromServlet(request);
```

This means the same API endpoints serve different tenants based on the request context (typically determined by the domain or subdomain).

## Response Format

All successful responses return `HTTP 200` with a JSON body:

```json
{
  "data": "<result>",
  "error": "<optional_error_message>"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Object` / `Array` / `boolean` | The response payload |
| `error` | `String` | Empty string if no error, otherwise the error message |

:::tip
The `data` field type varies by endpoint:
- **List endpoints** → JSON Array
- **Single entity endpoints** → JSON Object
- **Create/update/delete endpoints** → `true` / `false` boolean
:::
