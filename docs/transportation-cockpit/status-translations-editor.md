---
slug: status-translations-editor
sidebar_position: 1
title: Status Translations Editor
description: Manage delivery and pickup statuses and reasons in English, Bahasa, and Chinese
---

# Status Translations Editor

The **Status Translations Editor** lets you manage status and reason labels used for **Delivery** and **Pickup** in three languages: **English (en)**, **Bahasa (ms)**, and **中文 (zh)**. You can add or edit statuses, add reasons under each status, and use AI to translate or generate labels from a list.

## Where to find it

- In the app: **Settings** → **Status Translations**  
- Or navigate directly to the status-translations route (e.g. `/lightapp/settings/status-translations`).

## Categories

- **Delivery** – Statuses and reasons for delivery orders.
- **Pickup** – Statuses and reasons for pickup/collection.

Switch between Delivery and Pickup using the category tabs at the top.

## Statuses and reasons

- Each **status** has:
  - An **ID** (e.g. `STATUS_123`, or a custom code).
  - **Translations** for `en`, `ms`, and `zh`.
- Each status can have multiple **reasons**:
  - Each reason has an **ID** and translations in `en`, `ms`, `zh`.
  - A **Needs review** checkbox is available for existing reasons.

You can:

- **Add status** – New status with empty translations and no reasons.
- **Remove status** – Deletes the status and all its reasons.
- **Add reason** – Add a reason under the currently selected status.
- **Remove reason** – Remove a reason from the selected status.

## Load default template

The **Load default template** button:

- Adds any **missing** statuses and reasons from the built-in default set.
- Fills **empty** translation fields (e.g. Chinese) from the default where you have not entered data.
- Does **not** overwrite existing text you have already entered.

Use this to bring in new statuses/reasons or to fill gaps in translations.

## Save changes

- **Save Changes** is enabled only when there are unsaved edits.
- Click **Save Changes** to persist all edits to the server. The editor will show loading state until the save completes.

## AI Assistant

When `VITE_OPENAI_API_KEY` is set in your `.env`, the **AI Assistant** panel is available. It provides:

### Translate selection

- **Translate current status labels**  
  - Fill at least one language (en, ms, or zh) for the selected status, then click this.  
  - AI fills the other two languages for that status.

- **Translate all reasons in this status**  
  - Fill at least one language for at least one reason under the selected status.  
  - AI translates all reasons for that status into en, ms, and zh.

### Add from list

- Paste a **list of names** (one per line).  
- Choose:
  - **Add as statuses** – AI generates ID and en/ms/zh for each line and adds them as new statuses in the current category.
  - **Add as reasons (under selected status)** – Select a status first, then AI generates ID and en/ms/zh for each line and adds them as reasons under that status.
- Click **Generate and add** to create the items and add them to the list.

If the AI panel is not available, add `VITE_OPENAI_API_KEY` to your `.env` and restart the app.

## Summary

| Action | How |
|--------|-----|
| Edit status/reason labels | Select item, edit ID and en/ms/zh in the form. |
| Add status | Click “Add status”, then edit. |
| Add reason | Select a status, click “Add reason”, then edit. |
| Fill missing translations | Use “Load default template”. |
| Translate with AI | Fill one language, then use “Translate current status labels” or “Translate all reasons in this status”. |
| Bulk add from list | Paste one name per line, choose statuses or reasons, click “Generate and add”. |
| Save | Click “Save Changes” when the editor shows unsaved changes. |
