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
  
  @file     docs/roadmap.md
  @summary  Corrected delivery plan: phases, gates, metrics, launch timing.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Roadmap

This replaces the original `EduRelay — Developer Roadmap.md`. It keeps the good
instincts (start narrow, launch before the school year) and fixes what would have
broken in production: no cash on delivery, no dispute path, money stored as
floats, no logistics partner, and a locale decision that contradicted itself
between phase 1 and phase 5.

**Anchor date:** the Tunisian school year starts in **mid-September**. Everything
below is planned backwards from **September 2027** — the first realistic rentrée
this product can serve, given a start in late October 2026.

## 0. What changed, and why

| Original                             | Problem                                                                                         | Now                                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| "Escrow via Konnect"                 | Escrow is a licensed activity. Whether the provider supports split/held funds is **unverified** | Held-funds model documented, provider decision in ADR 0001, legal review required before launch |
| No cash on delivery                  | Most Tunisian buyers do not pay online for a 30 DT item                                         | COD is a first-class `payment_method`, with courier remittance tracking                         |
| No disputes, refunds or payouts      | The first "item never arrived" would have been handled by hand                                  | Tables, RPCs, admin flow, cron deadline                                                         |
| Money as `numeric`/float             | Rounding drift, reconciliation pain                                                             | Integer millimes everywhere, checked constraint                                                 |
| Phase 1 French-only, Phase 5 Arabic  | Retrofitting RTL rewrites every layout                                                          | `/fr` and `/ar` from the first commit                                                           |
| "Cart with listing_id"               | A cart of one unique second-hand item is not a cart                                             | One order per listing; `order_items` ready for multi-line later                                 |
| Search: "add Algolia later"          | Paid dependency before liquidity                                                                | Postgres trigram + tsvector, bilingual normalisation                                            |
| Next 14 / Tailwind v3 / Pages Router | Stale at build time                                                                             | Next 15 App Router, React 19, Tailwind v4                                                       |
| Supabase free tier + "PITR"          | Free tier has no PITR                                                                           | Nightly dump + restore drill until paid tier is justified                                       |
| Launch timing unspecified            | Shipping in October means waiting 11 months for demand                                          | Pilot in June, seed supply in August, launch at rentrée                                         |
| No GTM or liquidity plan             | A marketplace with no sellers is an empty page                                                  | Supply-first plan, per-wilaya seeding, donation hook                                            |

## 1. Principles

1. **Supply before demand.** An empty marketplace cannot be marketed. Recruit
   sellers — families, school associations, libraries — before spending on buyers.
2. **One wilaya deep, not 24 wide.** Grand Tunis first. Coverage claims that the
   courier cannot honour destroy trust faster than a missing feature.
3. **Trust is a product surface.** The 48 h window, the dispute trail and the
   refund policy are visible in the UI, not buried in terms.
4. **Free until sold.** No listing fee, no subscription. Commission on completed
   sales only. That is the whole pricing model.
5. **Boring infrastructure.** Postgres does search, cron and state; no queue, no
   microservice, no event bus until the numbers demand one.

## 2. Phases

Each phase has a **gate**: a measurable condition, not a feeling. Do not start
the next phase because the calendar says so.

### Phase 0 — Foundation · done (October 2026)

- Monorepo, brand config, generated tokens, design system primitives.
- Marketing site in French and Arabic, RTL from the first paint.
- Home page listings and hero counters read from Postgres
  (`public_listings`, `platform_stats()`) with skeleton, empty and unavailable
  states; no fixture rows anywhere.
- Legal corpus split into one page per document (`/legal/terms`,
  `/legal/privacy`, `/legal/cookies`, `/legal/security`, `/legal/notice`).
- Complete database schema: 25 tables, state machine, RLS, read models, cron.
- IP/licence files, ownership banners, release hashing.

**Gate:** `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm headers:check` all
green; site reachable on localhost in both locales.

### Phase 1 — Accounts and listings · Nov 2026 → Jan 2027

- Supabase Auth: email + phone OTP, profile creation, email verification.
- Publish flow: 2–5 photos with client-side compression, title, description,
  condition, category, grade, wilaya, price; draft → pending review → active.
- Browse: filters (wilaya, category, grade, condition, price), cursor pagination,
  bilingual search with typo tolerance.
- Listing page: photo gallery, seller card, safety notes, report button.
- Moderation queue (admin): approve, reject with reason, remove.
- Storage policies + image variants (thumbnail, card, full).

**Gate:** 100 real listings published in Grand Tunis by real people, of which 50
pass moderation without a manual fix; search finds a misspelled query; Lighthouse
mobile performance ≥ 90 on the listing page.

### Phase 2 — Orders, payments, delivery · Feb → Mar 2027

- Checkout: address, delivery quote, commission breakdown, COD or online.
- Payment adapter (one provider first — Konnect or Paymee, see ADR 0001),
  webhook handler with signature verification and idempotency.
- Courier adapter interface + First Delivery implementation + manual fallback.
- Order state machine wired to RPCs; seller and buyer order pages.
- Notifications: SMS on order events (provider decision pending), email receipts.
- Reservation semantics: listing reserved on order, released on cancellation.

**Gate:** 20 end-to-end orders with real money and real couriers, across online
and COD; zero reconciliation discrepancy; a refund executed successfully.

### Phase 3 — Trust, disputes, money out · Apr → May 2027

- Dispute opening within the 48 h window, threaded messages, evidence upload.
- Admin resolution: full/partial refund, release, cancel; audit every action.
- Refund execution through the provider + manual fallback for COD.
- Seller payouts: request, approve, pay, reconcile; payout account verification.
- 48 h auto-release cron live; expiry cron live.
- Legal review of terms, privacy, refund policy; payment provider contract signed.
- Fraud signals: duplicate accounts, mismatched phone, unusual refund patterns.

**Gate:** 10 simulated disputes resolved inside SLA; one payout cycle completed
with a real bank transfer; legal sign-off in writing.

### Phase 4 — Supply and partnerships · Jun → Jul 2027

- School associations and libraries onboarded as sellers (bulk upload).
- Croissant-Rouge tunisien donation flow: partner org, pickup, confirmation.
- "Liste scolaire" pages per grade — parents search by class, not by product.
- Seller acquisition: school gate flyers, parent Facebook groups, WhatsApp
  communities, librarian partnerships.
- Referral loop: buyer becomes seller after a successful purchase.

**Gate:** 1,000 active listings; 200 registered sellers; 5 partner organisations
with a signed MoU; donation flow tested end-to-end once.

### Phase 5 — Peak rehearsal · August 2027

- Load test the browse and search paths at 20× average traffic.
- Courier capacity confirmed for the first two weeks of September.
- Support rota, macros, refund authority limits.
- Trust and safety rota; escalation phone number that rings.
- Dry run: 50 orders in one day with the real courier.

**Gate:** 50 orders/day sustained for one day with no state-machine deadlock, no
duplicate charge and a p95 listing page under 1.5 s on 4G.

### Phase 6 — Public launch · September 2027

- Launch Grand Tunis (Tunis, Ariana, Ben Arous, Manouba).
- Donation campaign with the partner organisation.
- Paid acquisition only after organic sell-through is proven.

**Gate:** 300 completed orders in the first 30 days, dispute rate under 5 %,
delivery success above 90 %, NPS above 40.

### Phase 7 — Expand · October 2027 →

- Sousse, Sfax, then the coastal corridor — one wilaya at a time, each with a
  courier SLA signed first.
- Libraries and bookstores as repeat sellers; multi-line orders.
- Saved searches and restock alerts.
- Native app only if mobile web retention justifies it.

## 3. Metrics that decide everything

**Liquidity** (the only one that matters early)

- Listings per wilaya per week.
- Sell-through: listings sold ÷ listings published, 30-day window.
- Time to first sale (median days).
- Search → listing view → checkout conversion.

**Trust**

- Dispute rate per 100 orders; median resolution time.
- Delivery success rate per courier; lost/damaged rate.
- Refund rate; COD remittance delay.

**Money**

- GMV, net revenue (commission − payment fees − delivery subsidy).
- Contribution margin per order after courier and payment costs.
- Cash conversion: days between buyer payment and seller payout.

**Growth**

- Seller activation (published ≥ 1 listing within 7 days of signup).
- Buyer repeat rate within 60 days.
- CAC per completed order, per channel.

## 4. Costs to plan for (order of magnitude, verify before budgeting)

| Item                  | Notes                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| Payment provider fees | Typically a percentage + fixed fee per transaction; confirm with Konnect/Paymee |
| COD remittance        | Couriers charge a collection fee and hold cash 3–7 days                         |
| Delivery              | 7–12 DT per parcel in Grand Tunis, varies by weight/zone                        |
| SMS                   | Per-message cost, non-trivial at peak; email is nearly free                     |
| Hosting               | Vercel Pro + Supabase paid tier once traffic is real                            |
| Backup/PITR           | Paid tier only — budget for it before launch                                    |
| Support               | One person during peak, part-time otherwise                                     |

Do not subsidise delivery without a measured cap per order. It is the fastest way
to make a 10 % commission meaningless.

## 5. Risks

| Risk                                         | Likelihood | Mitigation                                                                  |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------- |
| Payment provider does not support held funds | Medium     | Manual payout ledger + delayed payout schedule; legal opinion before launch |
| Courier quality in peak week                 | High       | Two couriers + manual handover; SLA with penalty clause                     |
| Sellers list junk / counterfeits             | High       | Moderation queue, reports, seller reliability score                         |
| Buyers no-show on COD                        | Medium     | Phone confirmation before dispatch; block repeat offenders                  |
| Seasonality kills cash flow                  | Certain    | Plan runway for 10 quiet months, not 12 busy ones                           |
| Both sides disintermediate (deal offline)    | High       | Value in protection, delivery and donation receipt — not policing           |
| Free-tier limits hit at peak                 | Medium     | Paid tier before August; load test in phase 5                               |
| Legal/tax treatment of commission unclear    | Medium     | Accountant + lawyer in phase 3, invoice template ready                      |

## 6. Open questions — verify, do not assume

1. Does Konnect (or Paymee) legally support holding funds on behalf of a seller,
   and what is the KYC requirement for the platform and for sellers?
2. What are the exact per-transaction fees, and who bears the refund fee?
3. Can a courier remit COD to a company account with a per-order reconciliation
   file, or only a daily lump sum?
4. What invoice and TVA treatment applies to a commission on a sale between two
   individuals?
5. Which registration (INAPI) and legal form are needed before taking commission?
6. Does the partner NGO accept in-kind donations with platform-paid shipping, and
   what receipt can it issue?

Each of these can invalidate a phase gate. They are cheap to answer and expensive
to discover in September.

## 7. Definition of "launched"

Not "the site is up". Launched means: a parent in Ariana can find a 9th-grade
maths book, pay, receive it in three days, confirm, and the seller gets paid —
without anyone from the team touching the order.
