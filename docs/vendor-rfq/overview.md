# What is Vendor RFQ and how does it work?

This page explains the **purpose** of the Vendor RFQ module and **how it works** for planners and vendors.

## Purpose

When you have a booking that you want to assign to an **external vendor** (instead of your own fleet), you often need to:

- Get **price quotes** from one or more vendors.
- Compare **who offered what** (amount, truck, driver).
- Choose **one vendor** and assign the job with the agreed details.

The Vendor RFQ module supports this flow inside TCMS Booking: you create one **Request for Quote (RFQ)** per booking, send a **link** to vendors, they **submit their quote** through that link (no login), and you **accept** the quote you want and go straight to **Quick Assign** to complete the assignment.

## Who does what?

| Who | What they do |
|-----|------------------|
| **Planner / operations** | Create an RFQ from a booking, set an expiry date, send the RFQ link to vendors (e.g. via WhatsApp), view all quotes, accept one quote, then complete the assignment in Quick Assign with details already filled in. |
| **Vendor** | Receive the link (e.g. by WhatsApp), open it in the browser, read the job details (pickup, delivery, truck needed), enter their quote (price, truck, driver, phone), and submit. No account or login needed. |

## How it works (step by step)

1. **You (planner)** open **RFQ Dashboard** (from the sidebar: **Operations** → **RFQ Dashboard**).
2. You **select a booking** and **set an expiry date** for the RFQ, then click **Create RFQ**. The system creates the RFQ and a unique link for vendors.
3. You **send that link** to vendors—by copying it, sharing via WhatsApp, or using **“Send to selected vendors”** to pick vendors and send each one a personalized WhatsApp message with the link.
4. **Vendors** open the link, see the job details (pickup, delivery, truck requirement), fill in their **quoted amount**, **truck**, **tonnage**, **driver name**, and **driver phone**, then submit.
5. You see all **quotes** on the RFQ Dashboard (vendor name, amount, truck, driver). You **accept** the quote you want.
6. When asked **“Assign this booking to this vendor?”**, you choose **Yes**. You are taken to **Quick Assign** (Planning page) with the **vendor**, **truck**, **driver**, **tonnage**, and **agreed price** already filled in.
7. You **confirm and assign** in Quick Assign. The job is then assigned to that vendor with the agreed details.

## Key terms (in plain language)

- **RFQ (Request for Quote)** – One “request” per booking. It has an expiry date; after that, vendors can’t submit new quotes.
- **Quote** – One submission from one vendor for that RFQ (their price, truck, driver, etc.).
- **Accept quote** – You choose which vendor won the RFQ. After that, the RFQ is closed and you can go to Quick Assign with that vendor’s details pre-filled.
- **Vendor link** – The web link you send to vendors. When they open it, they see the job and a form to submit their quote. If you used “Send to selected vendors,” the link also identifies the vendor so they see “Submitting as: [Vendor name]” and can pick from their own truck/driver list.

## Where to find things in the app

- **RFQ Dashboard** – Sidebar → **Operations** → **RFQ Dashboard**. Here you create RFQs, see active RFQs and quotes, send links, cancel RFQs, and accept a quote.
- **Vendor page** – Vendors don’t use the sidebar. They open the **link you sent** (e.g. from WhatsApp). That link opens the page where they submit their quote.
- **Quick Assign** – You reach it after accepting a quote (by clicking **Yes** when asked to assign), or from **Booking Schedule** → **Planning** as usual.

## Next steps

- **[Using the RFQ Dashboard](/vendor-rfq/dashboard)** – Detailed steps to create RFQs, send to vendors, and accept a quote.
- **[Submitting a quote (for vendors)](/vendor-rfq/vendor-submit-quote)** – What vendors see and how to fill and submit the form.
- **[Completing the assignment](/vendor-rfq/quick-assign-integration)** – What is pre-filled in Quick Assign and how to confirm and assign.
