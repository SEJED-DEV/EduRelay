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
  
  @file     EduRelay — Developer Roadmap.md
  @summary  Part of the EduRelay platform.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# EduRelay — Developer Roadmap

Oct 26, 2026 · @SaD

## Project overview & stack decisions

EduRelay is a **zero-inventory C2C marketplace** for second-hand school supplies and exam-prep materials in Tunisia. The platform core needs:

- A **listing & browse** surface (items + bundles, filtered by grade/category)
- A **checkout & payment** flow with escrow-style hold (48-hour buyer confirmation window)
- A **donation flow** (items routed to Red Crescent partner org)
- A **delivery integration** with First Delivery (backups: Aramex TN, Best Delivery, Navex, Adex)
- An **admin dashboard** for listing moderation and partner management

### Recommended stack (asset-light, fast to ship)

| Layer         | Choice                                         | Rationale                                                              |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Frontend      | Next.js 14 (App Router) + Tailwind CSS         | SSR for SEO on listing pages; Tailwind matches design tokens           |
| Backend / API | Next.js API routes or lightweight Node/Express | Keeps infra simple in pilot phase                                      |
| Database      | PostgreSQL via Supabase                        | Row-level security for user data; free tier covers pilot scale         |
| Auth          | Supabase Auth (magic link + phone OTP)         | No password friction; phone OTP well-suited to Tunisian users          |
| File storage  | Supabase Storage                               | Listing photos; 1 GB free tier                                         |
| Payments      | Konnect or Paymee (Tunisian gateways)          | Local gateway required for TND transactions; escrow logic built on top |
| Delivery API  | First Delivery REST API                        | Webhook for status updates; quote endpoint at checkout                 |
| Hosting       | Vercel (frontend) + Supabase (backend)         | Both free tiers with clear upgrade paths                               |
| Analytics     | PostHog (self-hosted or cloud)                 | Session replay + funnel analysis                                       |

### Monorepo structure (suggested)

```
edu-relay/
  apps/
    web/          ← Next.js app
  packages/
    ui/           ← shared components + design system tokens
    db/           ← Supabase types + migrations
    config/       ← ESLint, Tailwind, TS config
```

### Brand assets already done ✓

- `EduRelay_logo.svg` — full lockup (icon + wordmark + tagline)
- `EduRelay_icon.svg` — icon-only mark (app icon, favicon)
- Design tokens: primary `#1D9E75` (Relay Teal), accent `#EF9F27` (Relay Amber)

Both SVGs use CSS variables (`--brand`, `--brand-dark`, `--accent`, `--text-main`). Register these in your `tailwind.config.js` as `colors.brand` and `colors.accent` so every component stays consistent without hardcoded hex strings.

## Phase 1 — Prep (Days 1–2)

### Goal

Everything decided and scaffolded in 2 days, before a single line of product code is written.

### Tasks

Finalize data model: categories (books, bags, calculators, uniforms, exam-prep), grade levels (1–13 + Bac), item condition tiers. Define listing schema: single item vs. bundle fields, photo count requirements, price floor/ceiling. Set up monorepo with Turborepo — `apps/web`, `packages/ui`, `packages/db`, `packages/config`. Initialize Supabase project with `dev` and `prod` environments, RLS enabled from day one. Wire CI/CD: GitHub Actions to Vercel — preview on every PR, production on `main` merge. Register with Konnect or Paymee immediately (approval takes 1–2 weeks). Contact First Delivery for API credentials and sandbox access. Draft Red Crescent MOU covering donation routing and volume expectations. Configure domain, DNS, Vercel project, Sentry (free tier), and PostHog.

### Key decisions to lock before Week 3

Payment gateway: Konnect vs. Paymee — recommend Konnect (better API docs), Paymee as fallback. Auth: phone OTP vs. email magic link — phone OTP primary, Tunisian users are more reliably on mobile. Listing model: single items + bundles, but UI should nudge bundles (higher basket value). Commission: 10% flat for family sellers; 12–15% for bulk library or bookstore listings.

### Deliverables

Supabase schema with all tables and RLS policies committed. `.env.example` documenting every required variable. CI pipeline green on a hello-world Vercel deploy. Payment gateway account approved or application submitted.

## Phase 2 — Build (Weeks 3–8)

### Goal

Ship a working marketplace — listings, search, checkout, and donation flow — ready for real users in Greater Tunis.

### Feature breakdown by sprint

**Sprint 1 (Weeks 3–4) — Core listing engine**

Auth: Supabase phone OTP flow, user profile (name, wilaya, school info). Listing creation: multi-photo upload (Supabase Storage), category + grade selector, condition picker (new / good / fair), price input with TND formatting, bundle toggle. Listing browse: grid view, filter sidebar (category, grade, condition, price range), search by keyword. Listing detail page: photo carousel, seller info, condition description, price, CTA buttons (Buy / Make Offer / Donate this item).

**Sprint 2 (Weeks 5–6) — Checkout & escrow**

Cart / instant buy flow. Delivery quote integration: call First Delivery API at checkout to show live delivery cost. Payment: Konnect or Paymee integration — hold funds in escrow on purchase. Buyer confirmation window: 48-hour timer after delivery confirmed; auto-release to seller on expiry. Seller dashboard: active listings, pending orders, earnings, payout request.

**Sprint 3 (Weeks 7–8) — Donation flow, trust layer, and polish**

Donation flow: seller can mark item as a donation; routed to Red Crescent queue (manual export for pilot, webhook later). Trust features: required photos enforced on upload, condition rating displayed prominently, report button on listings. Notifications: SMS (Twilio or local gateway) for order events (purchase, delivery, confirmation, payout). Admin panel: listing moderation queue, user flagging, donation export, basic metrics (active listings, GMV, donation count). Launch readiness: mobile-responsive QA pass, Lighthouse score > 80, error budget review in Sentry.

### Database schema (core tables)

```sql
users          — id, phone, name, wilaya, created_at
listings       — id, seller_id, title, category, grade, condition,
                 price, is_bundle, is_donation, status, photos[]
orders         — id, listing_id, buyer_id, delivery_quote_id,
                 payment_ref, status, confirmed_at, released_at
deliveries     — id, order_id, provider, tracking_ref, status
donations      — id, listing_id, routed_to (Red Crescent), status
```

### Key integrations

| Integration      | Endpoint                       | Notes                                                                           |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| First Delivery   | `/quotes` + `/orders`          | Quote at checkout; order on purchase confirm                                    |
| Konnect          | `/payments/initiate` + webhook | Store `payment_ref`; release escrow after 48h                                   |
| Supabase Storage | SDK upload                     | 5 photos max per listing; resize to 1200px on client                            |
| PostHog          | `posthog.capture()`            | Track: listing\_created, purchase\_started, purchase\_completed, donation\_made |

### Definition of done for pilot readiness

A family can list a bundle, a buyer can find and purchase it, delivery is booked automatically, funds are held and released after 48h, and a donation can be submitted and appears in the admin export — all on mobile, in French and Arabic.

## Phase 3 — Pilot launch (Month 3)

### Goal

500 registered families and 1,000 active listings in Greater Tunis (Tunis, Ariana, Ben Arous, Manouba).

### Launch week checklist

Production deploy with zero-downtime migration. Seed 10–15 listings from team/friends before public launch (avoid cold-start empty state). Enable PostHog session recordings on key flows (listing creation, checkout). Set up Sentry alerts for error rate > 1% on any API route. Enable Supabase's built-in backups and point-in-time recovery. Smoke test: full purchase flow, donation flow, and delivery quote end-to-end on production.

### Metrics to track from Day 1

| Metric                       | Target (Month 3 end)     | Where to read it                                    |
| ---------------------------- | ------------------------ | --------------------------------------------------- |
| Registered users             | 500                      | Supabase `users` table                              |
| Active listings              | 1,000                    | Supabase `listings` where status = active           |
| Completed purchases          | — (learn from real data) | `orders` where status = released                    |
| Donation submissions         | 200 (year one target)    | `donations` table                                   |
| Avg. buyer saving vs. retail | 50–60%                   | Manual survey + listing price vs. official kit cost |
| Listing creation time (UX)   | < 3 min from tap to live | PostHog funnel                                      |

### Trust & safety on launch

Every listing requires a minimum of 2 photos (enforced at submit). Condition rating is mandatory. Payment is held in escrow — never sent to seller until buyer confirms or 48h expires. Report button on every listing and user profile. Admin can unpublish a listing in one click from the moderation queue.

### Post-launch survey (Week 2 of pilot)

Survey 30+ parents via WhatsApp or in-app prompt. Key questions: Did you feel safe transacting with a stranger? Was the price fair? Was delivery reliable? Would you recommend EduRelay to another family? This feeds directly into the Month 4–6 improvement cycle.

## Phase 4–5 — Improve & Grow (Months 4–12)

### Phase 4: Improve (Months 4–6)

Analyze PostHog funnels — find where users drop off in listing creation and checkout. Ship fixes prioritized by drop-off impact. Formalize the Red Crescent partnership (MOU signed, recurring donation export scheduled). Integrate libraries and bookstores: add a `seller_type` field (family / library / bookstore) to the `users` table; apply 12–15% commission tier automatically. Add featured listings: a `featured_until` timestamp on `listings`, a simple Stripe or Konnect subscription for sellers to boost visibility. Run the 30-family survey, publish findings internally. Adjust pricing and UX based on real usage data.

### Phase 5: Grow (Months 7–12)

Expand to Sfax, Sousse, and Nabeul: confirm First Delivery coverage in those wilayas before committing to the launch date. Target: 5,000 users by Month 12. Add bilingual UI: Arabic (RTL) and French — use `next-i18next` with RTL Tailwind config (`dir='rtl'` on `<html>`). Add impact dashboard (public-facing): items saved from waste, families helped, total buyer savings — feeds SDG 12 reporting and NGO partnership conversations. Performance hardening: move listing images to a CDN (Cloudflare R2 or Bunny.net), add Redis caching for search results (Upstash free tier). Optional: mobile app (React Native + Expo sharing the `packages/ui` design tokens) if web mobile UX proves insufficient.

### Scalability notes

The zero-inventory model means server costs scale only with transaction volume, not stock. Supabase free tier handles \~500 concurrent users; upgrade to Pro ($25/mo) before the regional expansion. First Delivery's per-delivery pricing means zero fixed delivery cost — the margin only appears when a sale closes, keeping the burn rate predictable.

### Year 2 horizon

All 24 Tunisian regions. Explore same model in Algeria or Morocco (same school-year rhythm, same supply cost pressure). Impact-data access for NGOs and sponsors as a revenue line (anonymized aggregate data: items per wilaya, grade distribution, savings rate).

## Brand assets & design system

### Files (already delivered)

`EduRelay_logo.svg` — full lockup: icon mark + "EduRelay" wordmark + tagline "School Supplies · Passed Forward". Use on landing page hero, email headers, pitch decks.

`EduRelay_icon.svg` — icon mark only (320×320 viewBox). Use as app icon, browser favicon (convert to `.ico` or `.png` with Squoosh), and any square-format context.

### Design tokens

```js
// tailwind.config.js — add under theme.extend.colors
colors: {
  brand: {
    DEFAULT: '#1D9E75',  // Relay Teal — primary buttons, links, icon bg
    dark:    '#085041',  // Deep Teal  — hover states, headings
    light:   '#E1F5EE',  // Mist Teal  — page bg, card fills, badges
  },
  accent: {
    DEFAULT: '#EF9F27',  // Relay Amber — CTAs, price tags, relay arrow
    dark:    '#633806',  // Deep Amber  — amber text on light bg
  },
  muted:   '#888780',   // Stone       — subtitles, meta info
  surface: '#2C2C2A',   // Slate       — body text
}
```

### Dark mode in the SVGs

Both SVGs support dark mode automatically via `@media (prefers-color-scheme: dark)`. To force dark mode on an SVG embed, add `data-theme="dark"` to the `<svg>` element. To force light, add `data-theme="light"`.

### Favicon setup

1. Open `EduRelay_icon.svg` in a browser, screenshot at 512×512, export as PNG
2. Use [Squoosh](https://squoosh.app) or `sharp` CLI to generate: `favicon-32.png`, `favicon-16.png`, `apple-touch-icon-180.png`
3. In Next.js App Router, place in `app/` as `icon.png` (auto-detected) or configure in `app/layout.tsx` metadata

### Component conventions

All interactive components use `brand.DEFAULT` as the primary action color. Destructive actions use Tailwind's `red-500`. Success states use `green-600`. The amber accent is reserved for marketplace-specific highlights (prices, savings badges, the relay arrow motif) — do not use it for generic UI affordances.
