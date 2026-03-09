---
sidebar_position: 5
slug: resend-email-provider
title: Resend Email Provider
description: Configure and use Resend as an alternative email provider for sending system notifications
---

# Resend Email Provider

The **Resend Email Provider** integration allows you to send system emails (bookings, plans, PODs, invoices, etc.) using the Resend service instead of traditional SMTP. Resend offers better deliverability, modern API-based sending, and detailed analytics.

## Prerequisites

Before configuring Resend in the system, ensure you have:

1.  A [Resend account](https://resend.com).
2.  A **verified domain** in your Resend dashboard.
3.  An **API Key** with "Sending" permissions.

---

## Configuration

To switch from SMTP to Resend, follow these steps:

1.  Navigate to **Settings** → **SMTP Configuration**.
2.  Select the email category you want to configure (e.g., *Booking Mail*, *Invoice Mail*).
3.  Fill in the following details:

| Field | Value / Description |
| :--- | :--- |
| **Provider** | Select **Resend** from the dropdown. |
| **Username** | Enter your **Verified From Email** (e.g., `operations@yourdomain.com`). |
| **Resend API Key** | Enter your **Resend API Key** (starts with `re_`). |

4.  Click **Save**.

> [!NOTE]
> When **Resend** is selected as the provider, the Host, Port, and TLS/SSL settings are ignored as the system communicates directly with the Resend API.

---

## Technical Details

### Features Supported
- **Multiple Recipients**: Supports multiple `To` and `CC` addresses.
- **Attachments**: Automatically handles system attachments (ODFs, Invoices, POPs) by converting them to Base64 for Resend API compatibility.
- **HTML Templates**: Uses the same templates as the SMTP provider for consistent email branding.

### Developer Info
The integration uses the official Resend Java SDK.

---

## Troubleshooting

- **Authentication Error**: Ensure your API key is correct and has not expired.
- **Forbidden Sender**: Verify that the email address in the **Username** field belongs to a domain already verified in your Resend dashboard.
- **Attachments Not Received**: Resend has a total size limit for attachments (typically 10MB). If sending many PODs at once, consider using the "Send POD as Link" option if configured.
