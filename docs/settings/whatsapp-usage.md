---
sidebar_position: 4
slug: whatsapp-usage
title: WhatsApp Usage
description: View message usage and statistics for WhatsApp messages sent through the system
---

# WhatsApp Usage

The **WhatsApp Usage** page helps you see how many WhatsApp messages your system has sent—and whether they reached your customers successfully. Messages include OTPs (one-time passwords), template messages, and media messages sent via tcms.ai.

## Where to find it

- In the app: **Settings** (sidebar) → **WhatsApp Usage**
- Or navigate to: `/lightapp/settings/whatsapp-usage`

---

## What you see on the page

### Summary cards (top section)

Five cards show a quick overview of your message status:

| Card        | Meaning                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| **Sent**    | Number of messages that left your system and are on their way           |
| **Delivered** | Number of messages that reached the recipient's phone                  |
| **Read**   | Number of messages that the recipient opened                            |
| **Failed** | Number of messages that did not reach the recipient (e.g. invalid number, network issue) |
| **Total**  | Total count of all messages in the selected period                      |

---

## How to use it

### 1. Choose a date range

- **Start date** – First day of the period you want to review
- **End date** – Last day of the period

The page loads with the current month by default. Change these dates to view other periods.

### 2. Refresh the data

Click the **Refresh** button to load the latest metrics and details for your chosen date range.

### 3. Filter the details table

Below the summary cards, a table lists each message. You can narrow it down:

- **All statuses** – View all messages, or pick one status (sent, delivered, read, failed)
- **Phone number** – Enter a phone number to see only messages sent to that number

### 4. Paginate through results

If there are many records:

- **Prev** – Go to the previous page
- **Next** – Go to the next page

Each page shows up to 50 records.

---

## Understanding message statuses

1. **Sent** – Your system sent the message via tcms.ai. It's in transit.
2. **Delivered** – The message reached the recipient's phone.
3. **Read** – The recipient opened the message.
4. **Failed** – The message could not be delivered (wrong number, blocked, etc.).

Statuses are updated automatically when tcms.ai reports back to the system. You don't need to do anything—just refresh the page to see the latest status.

---

## Notes

- Data depends on your system being configured to log WhatsApp messages and to receive status updates from tcms.ai.
- Use this page to monitor delivery rates, troubleshoot failed messages, and review usage for a specific period.
- If you see no data, check that WhatsApp messaging is set up and that messages have been sent in the selected date range.
