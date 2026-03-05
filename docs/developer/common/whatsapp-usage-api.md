---
id: whatsapp-usage-api
title: WhatsApp Usage API
sidebar_label: WhatsApp Usage
---

## Introduction

The WhatsApp Usage API allows for retrieving metrics and paginated details of all WhatsApp messages sent through the system via Twilio. These messages include OTPs, template messages, and media messages. The system records the initial "sent" status, and the final status is automatically updated by the Twilio webhook (`/rest/twilio/update`).

## Database Requirements

Before utilising the API, the following table must be created in the database to store the usage logs. It uses the `twilio_sid` to allow the webhook to uniquely identify and update a given message's status.

```sql
CREATE TABLE `whatsapp_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `twilio_sid` varchar(100) DEFAULT NULL,
  `message_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_twilio_sid` (`twilio_sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## HTTP Endpoints

All WhatsApp API endpoints are available under the `/rest/whatsapp` path.

### 1. Get Usage Metrics

Retrieves an aggregated count of all WhatsApp messages grouped by their current status.

- **URL:** `/rest/whatsapp/metrics`
- **Method:** `GET`
- **Auth Required:** Yes (`userName` and `authKey`)

#### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `startDate` | `String` | No | Optional starting date for the metrics in `YYYY-MM-DD` format. |
| `endDate` | `String` | No | Optional ending date for the metrics in `YYYY-MM-DD` format. |

#### Success Response

**Code:** `200 OK`

```json
{
  "sent": 15,
  "delivered": 140,
  "read": 130,
  "failed": 2,
  "total": 287
}
```

---

### 2. Get Usage Details

Retrieves a paginated list of usage records detailing specific messages sent to individual users, including timestamps and completion status.

- **URL:** `/rest/whatsapp/details`
- **Method:** `GET`
- **Auth Required:** Yes (`userName` and `authKey`)

#### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `startDate` | `String` | No | Filter records starting from this date (`YYYY-MM-DD`). |
| `endDate` | `String` | No | Filter records up to this date (`YYYY-MM-DD`). |
| `status` | `String` | No | Filter records by a specific status (e.g., `delivered`, `failed`). |
| `phoneNumber` | `String` | No | Filter records sent to a specific phone number. |
| `start` | `Integer` | No | The offset for pagination (default: `0`). |
| `limit` | `Integer` | No | Maximum number of records to return (default: `50`). |

#### Success Response

**Code:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "phoneNumber": "0162999666",
      "twilioSid": "SMabcdefgh123456",
      "messageType": "OTP",
      "status": "delivered",
      "createdDate": "2026-03-02 22:04:00",
      "updatedDate": "2026-03-02 22:04:05"
    }
  ]
}
```

---

## Data Integration & Lifecycle

1. **Sending:**
   When the Application calls `TwilioUpdate.sendDigitalDoOTP` or `TwilioUpdate.sendWhatsappMessage`, it communicates with the Twilio API and inserts a record into the `whatsapp_usage` table with a state of `sent`.
2. **Callback Handling:**
   Twilio is configured to automatically call back to `/rest/twilio/update` via HTTP POST whenever the message transitions between states (i.e. `delivered`, `read`, `failed`). The system then queries the `whatsapp_usage` table by `twilio_sid` and updates the `status` field.
