---
id: truck-group-management-api
title: Truck Group APIs
sidebar_label: Truck Group APIs
---

# Truck Group Management APIs

These APIs allow developers to effectively manage truck group assignments. You can retrieve trucks filtered by their group and assign or clear group metadata across single or multiple trucks simultaneously.

---

## 1. Auto Complete/Get Trucks (Header Filter)

This is an extension to the existing API used for fetching all trucks. It now optionally filters the response natively via a new HTTP header variable.

### Endpoint

```http
GET /truck/get/{officeBranch}/{userName}/{authKey}
```

### Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `officeBranch` | `String` | The office branch code or identifier. |
| `userName` | `String` | The username of the authenticated application user. |
| `authKey` | `String` | The authentication security key for verifying the user. |

### Headers (Optional Filters)

| Header | Type | Description |
| :--- | :--- | :--- |
| `group` | `String` | The exact group name to filter out trucks from the response payload. |

### Response

**Content-Type**: `text/plain`

Returns a serialized JSON array representing the `Truck` entities. Will return status `401 Unauthorized` if validation fails.

---

## 2. Update Truck Group

This POST endpoint updates the `group` attribute for one or more trucks. Passing `null` as the group payload element clears the truck group field. 

### Endpoint

```http
POST /truck/updateGroup/{userName}/{authKey}
```

### Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `userName` | `String` | The username of the authenticated application user. |
| `authKey` | `String` | The authentication security key for verifying the user. |

### Request Payload

**Method**: `POST`
**Content-Type**: `application/json`

```json
{
  "group": "Maintenance Division",
  "truckIds": ["TRK202301", "TRK202305"]
}
```

| Field      | Type               | Description                                                                                     |
| :--------- | :----------------- | :---------------------------------------------------------------------------------------------- |
| `group`    | `String` (Nullable)| The name of the group to place the target trucks inside. Providing `null` unlinks the group.    |
| `truckIds` | `Array of Strings` | The specific identifiers of the `Truck` entities that should receive the group adjustment.      |

### Validations & Errors

- **`400 Bad Request`**: Received if the JSON is malformed, no `truckIds` list is present, or the array evaluated is completely empty.
- **`401 Unauthorized`**: Indicates a mismatch preventing access due to token or authorization logic.

### Response

**Content-Type**: `application/json`

```json
{
  "success": true,
  "message": "Group updated successfully."
}
```
_(The endpoint will safely handle partial fallbacks but report success: false if unable to resolve or save some items provided)_

---

## 3. Update Truck Max Stops

This POST endpoint allows bulk or single updates to the `maxStops` integer value assigned to trucks. It follows the same optimized bulk-update pattern as the truck group API.

### Endpoint

```http
POST /truck/updateMaxStops/{userName}/{authKey}
```

### Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `userName` | `String` | The username of the authenticated application user. |
| `authKey` | `String` | The authentication security key for verifying the user. |

### Request Payload

**Method**: `POST`
**Content-Type**: `application/json`

```json
{
  "maxStops": 15,
  "truckIds": ["TRK202301", "TRK202305"]
}
```

| Field      | Type               | Description                                                                                     |
| :--------- | :----------------- | :---------------------------------------------------------------------------------------------- |
| `maxStops` | `Integer` (Nullable)| The maximum number of stops permitted for the specified trucks. Providing `null` removes the limit. |
| `truckIds` | `Array of Strings` | The specific identifiers of the `Truck` entities that should receive the maxStops adjustment.      |

### Validations & Errors

- **`400 Bad Request`**: Received if the JSON is malformed, no `truckIds` list is present, the array is empty, or `maxStops` is not a valid integer.
- **`401 Unauthorized`**: Indicates a mismatch preventing access due to token or authorization logic.

### Response

**Content-Type**: `application/json`

```json
{
  "success": true,
  "message": "MaxStops updated successfully."
}
```

---

## 4. Get Combined Trucks (Truck & Vendor Fleet)

This GET endpoint generates an aggregated array of both internal company `Truck` entities alongside driver-managed `VendorFleet` properties mapped into a single response model, using the same optional `group` header logic.

### Endpoint

```http
GET /truck/getCombined/{officeBranch}/{userName}/{authKey}
```

### Path Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `officeBranch` | `String` | The office branch code or identifier. |
| `userName` | `String` | The username of the authenticated application user. |
| `authKey` | `String` | The authentication security key for verifying the user. |

### Headers (Optional Filters)

| Header | Type | Description |
| :--- | :--- | :--- |
| `group` | `String` | The exact group name to filter out trucks and vendor fleets from the response payload. |

### Response Schema & Discriminator

**Content-Type**: `application/json`

The JSON objects returned encompass properties native to both the `Truck` and `VendorFleet` Java models natively (volumetric limits, shift/break time metrics, ID logic, max weight constraints). 

To cleanly distinguish model types on deserialization, an extra dynamic discriminator attribute is natively injected:

- `"fleetType": "INTERNAL"` dictates an internal company truck object.
- `"fleetType": "VENDOR"` dictates an external vendor fleet object.

Example object representation natively returned for each element inside the array:
```json
[
  {
    "fleetType": "INTERNAL",
    "truckId": "TRK12345",
    "truckNumber": "ABC1234",
    "group": "Maintenance Division",
    ...
  },
  {
    "fleetType": "VENDOR",
    "driverName": "John Smith",
    "mobileNumber": "123456789",
    "group": "Maintenance Division",
    "maxWeightInKgs": 3000,
    "truckLength": 14.0,
    ...
  }
]
```

---

## Truck JSON Response Schema

The `GET /truck/get/{officeBranch}/{userName}/{authKey}` method returns an array of serialized `Truck` objects. When the `group` header is provided, this list is filtered accordingly. The snippet below contains the core properties typically consumed by frontend applications.

### Example Payload

```json
[
  {
    "truckId": "TRK12345",
    "truckLabel": "TRK12345 (Lorry 14ft)",
    "typeCode": "LTYP4",
    "truckNumber": "ABC1234",
    "truckName": "Volvo Master",
    "manufactureDate": "2018-01-01T00:00:00Z",
    "engineNumber": "ENG987654321",
    "chasisNumber": "CHS123456789",
    "truckType": "Lorry",
    "tonage": "3 Tonne",
    "axle": "2 Axle",
    "status": "Active",
    "bonded": "Yes",
    "tailGate": "No",
    "purchaseDate": "2019-05-20T00:00:00Z",
    "roadTaxExpireDate": "2024-12-31T00:00:00Z",
    "insurance": "2024-10-15T00:00:00Z",
    "inspection": "2024-08-20T00:00:00Z",
    "permitExpire": "2025-01-10T00:00:00Z",
    "customBondNumber": "CB100200",
    "customBondExpire": "2025-06-30T00:00:00Z",
    "statusReason": null,
    "createdDate": "2020-01-15T08:30:00Z",
    "truckHeight": 3.5,
    "truckWidth": 2.2,
    "truckLength": 14.0,
    "truckLengthType": "Feet",
    "truckWidthType": "Meters",
    "truckHeightType": "Meters",
    "driverName": "John Doe",
    "driverICNo": "900101-01-1234",
    "zoneName": "North Zone",
    "maxWeightInKgs": 3000,
    "group": "Maintenance Division",
    "maxStops": 15,
    "nextScheduledMaintenanceDate": "2024-11-01T00:00:00Z",
    "truckDocuments": [],
    "customerTruckExpiries": []
  }
]
```
