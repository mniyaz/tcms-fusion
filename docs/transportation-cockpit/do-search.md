---
slug: do-search
sidebar_position: 2
title: DO Search
description: Search delivery orders by DO number, date range, or customer
---

# DO Search

**DO Search** lets you find delivery orders (DOs) by **DO number**, **date range**, and/or **customer**. You can use wildcard patterns in the DO number field and an optional **AI Assistant** to run searches from natural language.

## Where to find it

- In the app: open **DO Search** from the navigation (e.g. **DO Search** or `/lightapp/do-search`).

## Search criteria

You must provide **at least one** of the following:

| Field | Description |
|-------|-------------|
| **DO Number** | Full or partial DO number; supports wildcards (see below). |
| **Date range** | **From date** and **To date** together (max 30 days between them). |
| **Customer** | Select a customer from the searchable dropdown (autocomplete). |

Empty searches are not allowed: if all fields are empty, the app shows an error and does not send a request.

## Wildcard patterns (DO Number)

You can use `*` in the DO number field to match patterns:

| Pattern | Meaning | Example |
|---------|---------|--------|
| `*0900` | Ends with `0900` | Matches `DO1230900`, `X0900` |
| `*2202*` | Contains `2202` | Matches `DO2202`, `DO2202A`, `X2202Y` |
| `11230*` | Starts with `11230` | Matches `11230`, `112301`, `11230AB` |

- Use **DO number** only, or combine with **date range** and/or **customer** to narrow results.

## Date range rules

- **From** and **To** must both be set when searching by date.
- The range must be **at most 30 days** (e.g. 1 Jan–31 Jan is allowed; 1 Jan–5 Feb is not).
- **From** cannot be after **To**.

## AI Assistant

When `VITE_OPENAI_API_KEY` is set, the **AI Assistant** panel is available (open by default). You can type a natural-language question and click **Interpret & Search**; the app will:

- Parse your query for DO number, date range, and customer.
- Fill the search form and run the same DO search (same 30-day and non-empty rules apply).

Examples:

- *"DOs from 2024-01-01 to 2024-01-15"*
- *"DO *0900"* or *"last week for customer CUS1"*

If the AI panel is missing or shows a message, add `VITE_OPENAI_API_KEY` to `.env` and restart.

## Results

- Results are shown in a table (e.g. DO number, customer, dates, status, links to details/POD).
- You can **Reset** to clear the form and results.
- Export or other actions depend on the buttons provided in the UI (e.g. **Download**).

## Summary

| Item | Detail |
|------|--------|
| Minimum input | At least one of: DO number, date range, or customer. |
| DO number | Supports wildcards: `*0900`, `*2202*`, `11230*`. |
| Date range | From + To required; max 30 days; From ≤ To. |
| AI | Optional; interprets natural language and runs the same search. |
