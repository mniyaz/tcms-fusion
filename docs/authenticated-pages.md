---
sidebar_position: 100
title: Authentication-based views
---

# Authentication-based views

Some pages in this documentation can be restricted to **signed-in users** using the **AuthGate** component.

## For readers

- When you open a page that uses **AuthGate**, you will see a short message and a **Sign in to view** button if you are not signed in.
- Click **Sign in to view** to go to the login page. After signing in, you will be redirected back and the protected content will be visible.

## For editors: gating content in a doc

In any **MDX** doc, wrap the content that should require sign-in with `<AuthGate>`:

```mdx
# My doc

Public intro text here.

<AuthGate>

This paragraph and the list below are only visible when the user is signed in.

- Point one
- Point two

</AuthGate>

More public content after the gate.
```

### Optional props

- **`loginUrl`** – Link used for the “Sign in to view” button (default: `/login`).
- **`fallback`** – Custom content when not authenticated (e.g. a custom message or link).

Example with custom login URL:

```mdx
<AuthGate loginUrl="https://app.tcms.ai/login">

Internal-only section here.

</AuthGate>
```

Example with custom fallback:

```mdx
<AuthGate fallback={<p>Contact support for access.</p>}>

Restricted content.

</AuthGate>
```

## How it works

- **Auth** uses **Netlify Functions** and **environment variables**. The login form sends username and password to `/api/login`, which compares them to `DOCS_USERNAME` and `DOCS_PASSWORD`. On success, a signed cookie is set; `/api/check-auth` is used on load to see if the user is signed in.
- Set **Netlify environment variables**: **Site settings → Environment variables** and add:
  - `DOCS_USERNAME` – default username (e.g. `admin`).
  - `DOCS_PASSWORD` – password for docs access.
  - `DOCS_SESSION_SECRET` – a long random string used to sign the session cookie (e.g. `openssl rand -hex 32`).
- For **local development** with auth, use `netlify dev` (and a `.env` file with the same variables); see `.env.example`.

## Files involved

| File | Purpose |
|------|--------|
| `src/context/AuthContext.js` | Auth state; calls `/api/check-auth`, `/api/login`, `/api/logout`. |
| `src/components/AuthGate.js` | Component used in MDX to gate content. |
| `src/theme/Root.js` | Wraps the app with `AuthProvider`. |
| `src/theme/MDXComponents/index.js` | Registers `AuthGate` for use in MDX. |
| `src/pages/login.js` | Login page (username/password form). |
| `netlify/functions/login.js` | Validates credentials against env and sets session cookie. |
| `netlify/functions/check-auth.js` | Verifies session cookie. |
| `netlify/functions/logout.js` | Clears session cookie. |
