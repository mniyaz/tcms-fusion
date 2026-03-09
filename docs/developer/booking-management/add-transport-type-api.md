---
sidebar_position: 5
---

# Add Transport Type

The `addTransportType` API endpoint is used to add a new customized transport type in the system. The endpoint handles duplication validation, ID generation and database persistence.

### Endpoint

`POST /rest/booking/addTransportType`

### Request Body

The request payload must provide the active `username`, its authorization token `authKey`, and the name of the new transport type `transportTypeName`.

```json
{
  "username": "admin_user",
  "authKey": "a-valid-authorization-key",
  "transportTypeName": "Refrigerated Van"
}
```

### Response

The response is a JSON object confirming the status of the operation (success or failure) alongside a message details.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Saved Successfully."
}
```

**Duplicate Transportation Type Error (200 OK):**
```json
{
  "success": false,
  "message": "Already Exist."
}
```

**Unauthorized (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Internal Server Error (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Business Logic Constraints

1. **Authentication Rule**: 
   Validates the user's `authKey` to verify permissions. Without an `authKey` the request fails. It automatically decodes the `tenantId` from the active context root.

2. **Format Rule Validation**:
   Checks whether identical transport type configurations already exist in the database for the resolved `tenantId`. Validation checks if `transportTypeName` equals any existing properties inside `checkDuplicateTransportType(transportTypeList, tenantId)`.

3. **Identifier System Constraints**:
   Auto-generates the `transportTypeId` using prefix allocations. It calls `generatedTransportId(tenantId)` that reads the `prefixtable` mappings configuration (e.g. prefix might be `TRL` yielding `TRL0025`).

4. **Persistence Operation Execution**:
   Once validated, the changes run exclusively through `addNewTransportTypeList` which commits changes directly into the configured SQL table, returning a Boolean boolean execution acknowledgment boolean, after which it performs an internal application refresh `TmsConstants.transportTypeList.put(tenantId, ...)` cache flush to ensure consistent data views.
