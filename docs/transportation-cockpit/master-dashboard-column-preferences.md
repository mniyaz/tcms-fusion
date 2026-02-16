# Master Dashboard Column Preferences

This page explains how users can customize visible columns and column order in Master Dashboard.

## Screenshots

Master Dashboard with action bar:

![Master Dashboard main view](./images/master-dashboard-main.png)

Columns picker:

![Master Dashboard columns picker](./images/master-dashboard-columns-picker.png)

Invoice and User ID enabled:

![Master Dashboard with Invoice and User ID columns](./images/master-dashboard-columns-invoice-userid-enabled.png)

> Note: The screenshots were captured in local development mode. The red fetch banner is environment/API connectivity related and not part of the column preference feature itself.

## Open column settings

In `Master Dashboard`, click **Columns**.

You can:

- Show/hide columns
- Reorder columns by dragging header cells

## Locked columns

These columns are always visible and pinned:

- `checkbox`
- `expand`

## Column filters

Header filter input is shown for all columns except:

- `Status`
- utility columns `checkbox` and `expand`

## Optional columns from API

The dashboard now supports additional columns from `getLiveStatus`, including:

- Booked Date
- Vendor
- Price
- Truck
- Tonnage
- Cust Ref
- Customer ID
- Requestor Phone
- Drop Points
- Manpower
- Equipments
- Invoice (mapped from `goodsDescriptionText`)
- Sent To Invoice
- User ID

## Reset behavior

Click **Reset Columns** to restore:

- default visible columns
- default ordering

## Persistence

Column preferences are saved:

- locally in `localStorage.preferences`
- to backend via `savePreferences` API

So after next login, user-specific column settings are restored.

