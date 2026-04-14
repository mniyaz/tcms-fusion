# Planner APIs

These APIs provide endpoints for resolving vendor drivers and vendor trucks, along with vendor details. The endpoint parameters are passed via the path (for authentication) and via HTTP headers (for query variables) as requested.

---

### 1. Get Vendor Drivers

Retrieves a list of driver names associated with a specific vendor based on a search query.

- **URL**: `/planner/getVendorDrivers/{userName}/{authKey}`
- **Method**: `GET`
- **Path Parameters**:
  - `userName`: The authenticated username.
  - `authKey`: The authentication key corresponding to the username.
- **Header Parameters**:
  - `vendorId` (required): The unique identifier of the selected vendor.
  - `query` (optional): The search string for driver auto-completion.
- **Response**:
  - **Success (200 OK)**: Returns a JSON array of driver objects.
    ```json
    [
      {
        "name": "John Doe",
        "ic_no": "P12345678",
        "phone": "+1234567890"
      },
      {
        "name": "Jane Smith",
        "ic_no": "A87654321",
        "phone": "+0987654321"
      }
    ]
    ```
  - **Error cases**:
    - `400 Bad Request`: If `vendorId` header is missing.
    - `401 Unauthorized`: If the `userName` and `authKey` are invalid.
    - `404 Not Found`: If the vendor cannot be found.
    - `500 Server Error`: If an internal server exception occurs.

---

### 2. Get Vendor Trucks

Retrieves a list of truck numbers associated with a specific vendor based on a search query.

- **URL**: `/planner/getVendorTrucks/{userName}/{authKey}`
- **Method**: `GET`
- **Path Parameters**:
  - `userName`: The authenticated username.
  - `authKey`: The authentication key corresponding to the username.
- **Header Parameters**:
  - `vendorId` (required): The unique identifier of the selected vendor.
  - `query` (optional): The search string for truck auto-completion.
- **Response**:
  - **Success (200 OK)**: Returns a JSON array of truck objects.
    ```json
    [
      {
        "truckNo": "TRK-1001"
      },
      {
        "truckNo": "TRK-2044"
      }
    ]
    ```
  - **Error cases**: Similar to the `getVendorDrivers` endpoint.

---

### 3. Get Vendor Details

Retrieves basic vendor details such as business name, email, and mobile number. Usually called when a vendor is selected from the UI.

- **URL**: `/planner/getVendorDetails/{userName}/{authKey}`
- **Method**: `GET`
- **Path Parameters**:
  - `userName`: The authenticated username.
  - `authKey`: The authentication key corresponding to the username.
- **Header Parameters**:
  - `vendorId` (required): The unique identifier of the selected vendor.
- **Response**:
  - **Success (200 OK)**: Returns a JSON object with vendor details.
    ```json
    {
      "vendorId": "VND123",
      "bussinessName": "Acme Transport Services",
      "email": "operations@acme.com",
      "mobileNumber": "+1234567890"
    }
    ```
  - **Error cases**:
    - `400 Bad Request`: If `vendorId` header is missing.
    - `401 Unauthorized`: If the `userName` and `authKey` are invalid.
    - `404 Not Found`: If the vendor cannot be found.
    - `500 Server Error`: If an internal server exception occurs.
