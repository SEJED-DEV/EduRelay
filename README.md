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
  
  @file     README.md
  @summary  Project entry point: what EduRelay is, how to run it, where to look.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# EduRelay

**School supplies, passed forward.** A Tunisian marketplace for second-hand
school books, uniforms and gear — buy, sell, or donate, with money held for 48
hours after delivery so neither side has to trust a stranger.

- Production: https://edurelay.tn
- Local: http://localhost:3000 (redirects to `/fr`)
- Languages: French (`/fr`) and Arabic (`/ar`, RTL)
- Currency: Tunisian dinar, stored as integer **millimes** (1 TND = 1000)

This is a **private, proprietary repository**. Read [LICENSE.md](./LICENSE.md)
and [NOTICE.md](./NOTICE.md) before touching a single file. Every file carries an
ownership banner; `pnpm headers:check` enforces it.

## Quickstart

```bash
# Node 22 (see .nvmrc), pnpm 10
corepack enable
pnpm install
pnpm theme          # generate design tokens from packages/brand/brand.config.json
pnpm dev            # http://localhost:3000
```

`pnpm dev` already regenerates the tokens, so `pnpm theme` is only needed after
editing the brand config.

Database (optional for the UI, required for anything real):

```bash
supabase start
supabase db reset
cp .env.example apps/web/.env.local   # then fill in the local URL + anon key
```

## What exists today

| Area            | State                                                                |
| --------------- | -------------------------------------------------------------------- |
| Marketing site  | Done — home, design system reference, legal hub, 404, fr/ar RTL      |
| Design system   | Done — tokens generated from one file, button/badge/price/lockup     |
| Database schema | Done — 25 tables, state machine, RLS, read models, cron jobs         |
| Auth + listings | Next — schema is ready, UI and server actions are the next milestone |
| Payments        | Next — provider adapter pending (Konnect/Paymee TBD, see ADR 0001)   |
| Courier         | Next — adapter interface + webhook ledger designed                   |

Honest status beats a pretty roadmap: the storefront is real, the transactional
flows are schema-complete but not yet wired to a UI.

## Repository layout

```
apps/web                 Next.js 15 App Router app (fr/ar, RTL from day one)
packages/brand           THE single source of truth: colours, fonts, contacts
packages/ui              Design system: primitives + millime money helpers
packages/db              Supabase clients, validated env, domain types
packages/config          Shared tsconfig presets
supabase                 Migrations, RLS, seed data, local stack config
scripts                  Header generator/applier, release hashing
docs                     Roadmap, architecture, ops runbooks, ADRs, IP defence
```

## The one file that rebrands everything

`packages/brand/brand.config.json` holds the company name, tagline, palette,
typography, locale, currency, contacts and legal notice.

```bash
pnpm theme   # regenerates packages/brand/generated/{tokens.css,tokens.ts,brand.ts}
pnpm headers # refreshes the banner in every file
```

`generated/brand.ts` is the runtime subset: it drops the ownership block and
personal contact details so they can never reach a client bundle.

Change a colour there and it reaches Tailwind, the UI package and the file
banners in one step. Details: [docs/brand.md](./docs/brand.md).

## Scripts

| Command              | What it does                                           |
| -------------------- | ------------------------------------------------------ |
| `pnpm dev`           | Generate tokens, then run every app in watch mode      |
| `pnpm build`         | Production build (tokens must be generated first)      |
| `pnpm typecheck`     | `tsc --noEmit` across the workspace                    |
| `pnpm lint`          | Biome check (lint + format)                            |
| `pnpm format`        | Biome format, writing changes                          |
| `pnpm theme`         | Regenerate design tokens from the brand config         |
| `pnpm headers`       | Apply/refresh the ownership banner everywhere          |
| `pnpm headers:check` | Fail if a file is missing its banner (CI gate)         |
| `pnpm release:hash`  | SHA-256 manifest of a release, for authorship evidence |

## Read next

- [docs/architecture.md](./docs/architecture.md) — how the pieces fit, money rules, security posture
- [docs/roadmap.md](./docs/roadmap.md) — phases, gates and the school-calendar constraint
- [docs/ops.md](./docs/ops.md) — courier handoff, disputes, refunds, payouts, incidents
- [docs/brand.md](./docs/brand.md) — palette, type scale, icon vs lockup rules
- [docs/ownership.md](./docs/ownership.md) — provenance, signed commits, takedown playbook
- [docs/ip-protection.md](./docs/ip-protection.md) — the IP checklist and its current state
- [supabase/README.md](./supabase/README.md) — migrations, RLS testing, backups

## Contact

EduRelay · Tunis, Tunisia · hello@edurelay.tn · +216 94 155 000
Built and owned by **Sejed TRABELSSI** — https://sejed.dev
