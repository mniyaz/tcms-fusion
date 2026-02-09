---
slug: co-search
sidebar_position: 3
title: CO Search
description: Search collection orders by CO number, date range, or customer
---

# CO Search

**CO Search** lets you find collection orders (COs) by **CO number**, **date range**, and/or **customer**. You can use wildcard patterns in the CO number field and an optional **AI Assistant** to run searches from natural language.

## Where to find it

- In the app: open **CO Search** from the navigation (e.g. **CO Search** or `/lightapp/co-search`).

## Search criteria

You must provide **at least one** of the following:

| Field | Description |
|-------|-------------|
| **CO Number** | Full or partial CO number; supports wildcards (see below). |
| **Date range** | **From date** and **To date** together (max 30 days between them). |
| **Customer** | Select a customer from the searchable dropdown (autocomplete). |

Empty searches are not allowed: if all fields are empty, the app shows an error and does not send a request.

## Wildcard patterns (CO Number)

You can use `*` in the CO number field to match patterns:

| Pattern | Meaning | Example |
|---------|---------|--------|
| `*0900` | Ends with `0900` | Matches `CO1230900`, `X0900` |
| `*2202*` | Contains `2202` | Matches `CO2202`, `CO2202A`, `X2202Y` |
| `11230*` | Starts with `11230` | Matches `11230`, `112301`, `11230AB` |

- Use **CO number** only, or combine with **date range** and/or **customer** to narrow results.

## Date range rules

- **From** and **To** must both be set when searching by date.
- The range must be **at most 30 days** (e.g. 1 Jan–31 Jan is allowed; 1 Jan–5 Feb is not).
- **From** cannot be after **To**.

## AI Assistant

The **AI Assistant** panel is available (open by default). You can type a natural-language question and click **Interpret & Search**; the app will:

- Parse your query for CO number, date range, and customer.
- Fill the search form and run the same CO search (same 30-day and non-empty rules apply).

Examples:

- *"COs from 2024-01-01 to 2024-01-15"*
- *"CO *0900"* or *"CO CO123"*

If the AI panel is missing or shows a message, add `VITE_OPENAI_API_KEY` to `.env` and restart.

## Results

- Results are shown in a table (e.g. CO number, customer, dates, status).
- You can **Reset** to clear the form and results.
- Export or other actions depend on the buttons provided in the UI (e.g. **Download**).

## Summary

| Item | Detail |
|------|--------|
| Minimum input | At least one of: CO number, date range, or customer. |
| CO number | Supports wildcards: `*0900`, `*2202*`, `11230*`. |
| Date range | From + To required; max 30 days; From ≤ To. |
| AI | Optional; interprets natural language and runs the same search. |
