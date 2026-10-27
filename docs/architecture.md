<!--
  ==============================================================================
  EduRelay — School Supplies · Passed Forward
  Copyright (c) 2026 EduRelay. All rights reserved.
  
  PRIVATE REPOSITORY — CONFIDENTIAL.
  This file is part of a private, proprietary codebase. Access is granted by
  prior written permission from the owner only. If you are reading this without
  that permission you must stop now and delete every copy: you may not view,
  copy, modify, distribute or disclose this file.
  Unauthorised access or use may give rise to civil and/or criminal liability
  under applicable law, including Tunisian intellectual-property law (Law No.
  94-36) and the law on electronic exchanges (Law No. 2000-83).
  
  Code owned by EduRelay · Made by Sejed TRABELSSI
    Portfolio      https://sejed.dev
    Instagram      https://instagram.com/sejed.dev
    Discord        https://discord.gg/sejed.dev
    Dev Community  https://dev.to/sejed.dev
    Facebook       https://facebook.com/TSSEJED
    Mobile         +216 94 155 000
  
  @file     docs/architecture.md
  @summary  System architecture, data model, money rules, security posture.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Architecture

How EduRelay is put together, and why. If a decision here surprises you, check
`docs/adr/` before changing it — the reasoning is usually recorded there.

## 1. The problem, in constraints

| Constraint                                         | Consequence in the design                                          |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| Buyers are families, not power users               | Mobile-first, two languages, no account required to browse         |
| Card penetration is low, cash is normal            | Cash on delivery is a first-class payment method, not an edge case |
| Sellers are one-off, not shops                     | No subscription, no storefront builder; publish in 3 minutes       |
| Courier networks are fragmented and partly offline | Adapter interface + webhook ledger + manual fallback               |
| School year is cyclical                            | Peak load in August–September; the rest of the year is quiet       |
| Trust is the scarce resource                       | Held funds, 48 h confirmation window, visible dispute trail        |
| Two official languages                             | Path-prefixed locales, Arabic RTL from the first commit            |

## 2. System shape

```
                    ┌──────────────────────────────┐
   Browser  ───────▶│  Next.js 15 (App Router)      │
   fr / ar          │  RSC + server actions         │
                    │  next-intl, Tailwind v4        │
                    └───────┬──────────────┬────────┘
                            │              │
              anon key + RLS│              │service role (server only)
                            ▼              ▼
                    ┌──────────────────────────────┐
                    │  Supabase                    │
                    │  Postgres 17 · Auth · Storage│
                    │  RLS on every exposed table  │
                    │  pg_cron: release + expiry   │
                    └───────┬──────────────┬───────┘
                            │              │
                webhooks    │              │  adapter calls
                            ▼              ▼
                    ┌──────────────┐  ┌──────────────────┐
                    │ Konnect /    │  │ First Delivery / │
                    │ Paymee       │  │ Aramex           │
                    └──────────────┘  └──────────────────┘
```

Three rules keep this honest:

1. **The browser never holds a privileged key.** Only `anon` + RLS, or a server
   action using the service role.
2. **Money moves in Postgres, not in the client.** Status changes go through
   `confirm_order`, `open_dispute`, or a webhook handler; no client `UPDATE` on
   `orders` exists.
3. **Every external event is idempotent by constraint.** A replayed webhook hits
   a unique index and does nothing.

## 3. Monorepo layout

| Package           | Responsibility                                          |
| ----------------- | ------------------------------------------------------- |
| `apps/web`        | Routing, rendering, server actions, i18n                |
| `packages/ui`     | Primitives, money formatting, brand components          |
| `packages/brand`  | Brand config + generated tokens (the only theme source) |
| `packages/db`     | Supabase clients, lazy env validation, domain types     |
| `packages/config` | Shared tsconfig presets                                 |

The web app consumes packages as TypeScript source (`transpilePackages`), so
there is no build step between editing a component and seeing it. That is a
deliberate trade: faster iteration, slightly slower cold builds.

## 4. Data model

25 tables in four groups. Full DDL: `supabase/migrations/20261026120000_init.sql`.

**Reference** — `wilayas`, `grade_levels`, `categories`, `delivery_providers`,
`order_status_transitions`. World-readable, never client-writable.

**Identity** — `profiles` (1:1 with `auth.users`), `addresses`.

**Catalogue** — `listings` (bilingual title/description, condition, kind,
price in millimes, wilaya, moderation status), `listing_photos` (max 5, ordered).

**Transactions** — `orders`, `order_items`, `payments`, `payment_events`,
`deliveries`, `delivery_events`, `refunds`, `payouts`, `seller_payout_accounts`,
`disputes`, `dispute_messages`.

**Programme & safety** — `partner_orgs`, `donation_requests`, `reports`,
`notifications`, `admin_actions`.

Why one listing per order line rather than a cart: first version sells one item
(often a unique second-hand item). A cart arrives when sellers with stock
(libraries, bookstores) do — `order_items` already supports it, so that change is
UI-only.

### Search

`listings.search_text` is a generated column normalising French accents and
Arabic variants (alef, taa marbuta, alef maqsura, diacritics) through
`app.fn_search_normalize`. Two indexes read it:

- GIN trigram on `search_text` — fuzzy "calculatrise" still finds it;
- GIN on `search_tsv` — ranked full-text.

The function is immutable and shared by both columns, so the two can never drift.

## 5. Money

**Unit.** Integer millimes, `bigint`, everywhere: database, TypeScript, API.
1 TND = 1000 millimes. No floats, ever. `packages/ui/src/lib/money.ts` is the only
place that formats or parses.

**Order arithmetic.**

```
subtotal   = Σ (unit_price × quantity)
commission = Σ round(unit_price × quantity × rate_bp / 10_000)
total      = subtotal + delivery_fee + service_fee
seller_net = subtotal − commission
```

`commission_rate_bp` is snapshotted per line at checkout, so raising the platform
fee later never rewrites an old order. `orders_total_matches` enforces the sum in
the database.

**Immutability.** Once an order leaves `pending_payment`, `fn_orders_guard()`
rejects any change to the five amount columns. Corrections are `refunds` rows.

**Payouts are derived, not stored twice.** `seller_balance()` computes available,
held and paid-out from released orders and paid payouts. A `payouts` row is a
request, not a balance.

## 6. Order lifecycle

```
pending_payment ──▶ paid_held ──▶ awaiting_shipment ──▶ shipped ──▶ delivered
      │                 │                │                  │            │
      ├─▶ expired       ├─▶ refunded     ├─▶ cancelled      └─▶ disputed │
      └─▶ cancelled     └─▶ disputed     └─▶ disputed                    │
                                                                         ▼
                                          buyer_confirmed ──▶ released ◀──┘ (48 h sweep)
```

- The 48-hour window starts when the **courier** marks the parcel delivered, not
  when the buyer pays. That is what makes the promise defensible when delivery
  takes a week.
- `fn_release_due_orders()` runs every 10 minutes via pg_cron and moves
  `delivered → released` at the deadline. `for update skip locked` makes
  concurrent sweeps safe.
- A dispute freezes release. Only an admin resolves it, to a refund or a release.

Full transition list: `supabase/seed.sql` (`order_status_transitions`).

## 7. Security posture

- **RLS on all 25 tables.** Five tables have RLS enabled with no client policy at
  all (`payments`, `payment_events`, `delivery_events`, `refunds`,
  `admin_actions`): they are service-role only.
- **Definer functions for privileged transitions** (`confirm_order`,
  `open_dispute`, `seller_balance`), each re-checking the caller's role because a
  definer function bypasses RLS.
- **Guard triggers** stop privilege escalation on `profiles` (role, phone
  verification) and illegal listing ownership/price changes.
- **Views are `security_invoker`**, so a read model can never be a hole.
- **Service role key** exists only in server code, validated lazily so the build
  works without it.
- **Webhooks** verify signatures, store the raw payload, and dedupe on
  `(provider, event_id)`.
- **Personal data**: phone and full address are released to the counterparty
  only after payment; payout accounts store the last four digits, never the full
  RIB.

## 8. Localisation

Path-prefixed locales (`/fr/...`, `/ar/...`) with middleware redirect. Reasons
and trade-offs: [ADR 0002](./adr/0002-localisation.md).

Arabic is not a translation layer bolted on at the end: `dir="rtl"` is set on the
server-rendered `<html>`, spacing uses logical properties (`ms-*`, `me-*`,
`start/end`), and the Arabic face is loaded unconditionally so the first paint
has the right metrics.

### 404

Unmatched URLs are answered by `apps/web/src/app/global-not-found.tsx`, which
Next.js prerenders at build time (`experimental.globalNotFound`). It owns its own
`<html>` because the locale layout is not in scope, ships both languages, and a
blocking inline script stamps `lang`, `dir` and `data-locale` from the URL before
the body is parsed — Arabic therefore gets RTL and Plex on the first frame. A
`notFound()` boundary still exists at `[locale]/not-found.tsx` for static pages
that call it.

Two known Next.js 15.5 quirks, both cosmetic:

- an unknown legal slug logs `Error: Internal: NoFallbackError` once per request
  (the response is the correct static 404, and the server keeps serving);
- the `notFound()` path renders on the client, which is why no route relies on
  it for the "URL does not exist" case.

## 9. Failure modes we design for

| Failure                           | Defence                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| Two buyers pay for the last item  | Listing moves to `reserved` on order creation; the second order is refunded |
| Webhook delivered twice           | Unique `(provider, provider_event_id)`                                      |
| Buyer never confirms              | Cron releases at deadline                                                   |
| Buyer disputes after release      | Not allowed: `released` is final; support handles goodwill cases            |
| Courier marks delivered falsely   | Photos + tracking events; dispute path, courier performance KPI             |
| Seller never ships                | 72 h SLA, auto-cancel + refund, seller reliability score                    |
| Seller edits the price after sale | Guard trigger freezes price on `sold`/`donated`                             |
| Admin account compromised         | 2FA, `admin_actions` audit trail, no service-role key in the app            |
| Database restore needed           | Nightly dump + monthly restore drill (not free-tier PITR)                   |

## 10. Non-goals for v1

- Real-time chat. Disputes are threaded; everything else is notifications.
- Auctions, bundles of mixed sellers, or a shopping cart.
- Mobile apps. The web app is installable; native is a year-two question.
- True escrow. See [ADR 0001](./adr/0001-payments-and-escrow.md) — the licence
  question decides this, not the code.
- Multi-country. One country, two languages, 24 governorates.

## 11. Public read path

The marketing surface is not a separate content system. It reads the same
database the product will write to:

| Need          | Source                                                |
| ------------- | ----------------------------------------------------- |
| Listing cards | `public.public_listings` (approved/sold/donated view) |
| Hero counters | `public.platform_stats()` — active, sold, wilayas     |
| Photo URLs    | Storage public URL built from `cover_path`            |

`packages/db/src/catalog.ts` owns those queries; `apps/web/src/lib/home.ts`
localises the row into a view model. The page streams both behind `<Suspense>`
so the shell renders before Postgres answers.

Three states are mandatory:

- `ok` — rows exist and render.
- `empty` — the query succeeded with zero rows; say so and invite a first
  listing.
- `unavailable` — no Supabase env or a query failure; say the catalogue is being
  prepared. Never substitute demo data.

`platform_stats()` is `security definer` and returns only aggregates, so an
anonymous visitor can render the counters without a row-level policy on
`listings` or `orders`.

## 12. Legal surface

Legal content is code, not CMS content, until the wording stabilises:

- `apps/web/src/content/legal.ts` — typed bilingual corpus, one document per
  slug: `terms`, `privacy`, `cookies`, `security`, `notice`.
- `app/[locale]/legal/page.tsx` — hub that indexes the documents.
- `app/[locale]/legal/[slug]/page.tsx` — one static page per document, with its
  own metadata and canonical URL.
- `messages/{fr,ar}.json` — UI labels only (`Legal` namespace); no legal prose.

Why split: each document has a different review cadence and owner. A single
`/legal` page made every cookie tweak a change to the terms URL, and deep links
(`#privacy`) are not citable in a contract. The split costs one extra route and
buys stable URLs.

The corpus is a pre-launch draft. The banner is rendered from the `Legal`
namespace on every page, and `docs/ip-protection.md` tracks the outstanding
Tunisian counsel review. Do not remove it before that review is signed off.
