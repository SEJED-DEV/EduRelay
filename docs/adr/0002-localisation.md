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
  
  @file     docs/adr/0002-localisation.md
  @summary  ADR: path-prefixed locales with Arabic RTL from day one.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# ADR 0002 — Path-prefixed locales, Arabic RTL from day one

- **Status:** accepted
- **Date:** 2026-10-26
- **Deciders:** owner (product + engineering)

## Context

The original roadmap put French in phase 1 and Arabic in phase 5. That is the
most expensive sequencing mistake available to a Tunisian product:

- Every layout is retested, every spacing utility revisited, every icon mirrored.
- Every string added in French for four months is a string that has to be
  rewritten, not translated, because Arabic phrasing is shorter and the layout
  was tuned to French.
- The Arabic face, the `dir` attribute and the mirrored shadows are structural,
  not a skin.
- SEO in Arabic starts from zero on launch day, in the exact month that matters.

At the same time, a locale decision has real SEO and caching consequences, so it
should not be left to a middleware default.

## Decision

1. **Two locales from the first commit:** `fr` (default) and `ar`.
2. **Path prefix for both:** `/fr/...` and `/ar/...`. No unprefixed default.
3. **`dir` and `lang` are set on the server-rendered `<html>`** in
   `apps/web/src/app/[locale]/layout.tsx`, so the first byte is already correct.
4. **Middleware** (`apps/web/src/middleware.ts`) redirects `/` and unknown paths
   based on `Accept-Language`, with `fr` as the fallback.
5. **`next-intl`** with a typed `routing` config; messages live in
   `apps/web/src/messages/{fr,ar}.json` and are loaded per request.
6. **Arabic typography is a first-class face** (IBM Plex Sans Arabic), loaded
   unconditionally, with a metrics-matched fallback. Tracking is reset and
   italics are disabled for `[lang="ar"]`.
7. **Spacing uses logical properties** (`ms-*`, `me-*`, `start/end`, `text-start`)
   rather than `left/right`.

## Why path prefixes instead of the alternatives

| Option                              | Trade-off                                                               | Verdict  |
| ----------------------------------- | ----------------------------------------------------------------------- | -------- |
| Path prefix (`/fr`, `/ar`)          | Shareable URLs, per-language indexing, trivial caching, one domain      | chosen   |
| Subdomain (`fr.` / `ar.`)           | Cleaner separation, but two DNS entries, harder local dev, cookie scope | rejected |
| Query parameter (`?lang=ar`)        | Bad for SEO, bad for caching, leaks into every link                     | rejected |
| Cookie-only, same URL               | One URL cannot be indexed in two languages properly                     | rejected |
| Unprefixed default + prefixed other | Saves a redirect for French users, but splits canonicals                | rejected |

The cost of the prefix is one redirect for a French visitor landing on `/`. The
benefit is that every listing has a stable, crawlable French and Arabic URL from
day one.

## Consequences

**Good**

- RTL bugs are caught in week one, when they cost minutes, not weeks.
- Arabic content is written, not translated under deadline pressure.
- `hreflang` and canonical URLs are trivial (see the layout metadata).
- Language switching preserves the current page (`Link` from `@/i18n/navigation`).

**Bad / accepted**

- Two copies of every string. Enforced by review: a PR that touches `fr.json`
  without `ar.json` is rejected.
- Slightly longer URLs.
- Arabic copywriting is real work; a machine translation is not acceptable for
  legal or transactional copy.
- Middleware runs on every request — it is cheap, but it must stay free of
  per-user logic.

## Rules that follow from this

1. Never hard-code a user-facing string in a component.
2. Never use physical margins/padding for anything that must mirror.
3. Numbers, prices and dates go through `Intl` with `ar-TN` / `fr-TN`, never
   string concatenation.
4. Icons that imply direction (arrows, chevrons) flip in RTL; icons that do not
   (camera, shield) do not.
5. The Arabic page is not a "translated" page: it is the product in Arabic, with
   its own line lengths and its own hierarchy.
