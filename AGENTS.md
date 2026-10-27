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
  
  @file     AGENTS.md
  @summary  Non-negotiable rules for anyone, human or AI, changing this repo.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Agent and contributor rules

These rules are not suggestions. If a change breaks one of them, the change is
wrong even if it looks better. Read this before editing, then run the checks in
§9.

## 1. The live product contains no invented data

Every listing, price, photo, seller name, wilaya, condition, sold count and
platform statistic on the public site comes from Postgres.

- Data access goes through `@edurelay/db` (`fetchPublicListings`,
  `fetchPlatformStats`, …) and the server-only loaders in
  `apps/web/src/lib/home.ts`.
- Do **not** add demo arrays, fixture objects, placeholder prices, sample
  sellers, hardcoded counters or “example” cards — not even behind a comment.
- A missing database is a normal state. Render the empty/unavailable UI
  (`state: "empty" | "unavailable"`) and an em dash for unknown counters.
- UI copy may be hardcoded only when it is not product data (labels, headings,
  legal prose, empty-state explanations).

## 2. Brand values come from one file

`packages/brand/brand.config.json` is the only source for the name, wordmark,
tagline, colours, typography, motion tokens, locale list, currency, contacts and
legal entity. After editing it, run `pnpm theme`.

- Never write a hex colour, font family, company name or contact address in a
  component.
- Use the generated Tailwind tokens (`text-brand`, `bg-brand-dark`, …) and the
  typed `brand` export.
- Import `brand` from `@edurelay/brand`; never import `brand.config.json`
  directly. The generator emits `generated/brand.ts` as a public subset, because
  every client import is serialised into the HTML payload.
- Public contact is `brand.contacts.supportEmail` and
  `brand.contacts.securityEmail`. Nothing else.

## 3. The founder is not a public contact channel

Sejed TRABELSSI owns the code and appears in source headers. That is the only
place his name, portfolio, social handles or mobile number may appear.

- Never render a founder link, phone number, Instagram/Discord/Facebook/Dev.to
  handle, portfolio link or “built by” block in any page, footer, JSON-LD,
  metadata, sitemap or email template.
- `SiteFooter` and the home JSON-LD are the current guards. Keep them that way.
- If a design calls for a “contact” block, it points to
  `hello@edurelay.tn` (or `security@edurelay.tn` for vulnerabilities).

## 4. Every file is documented and carries the banner

- Every text file starts with the EduRelay confidential banner. `pnpm headers`
  adds it; `pnpm headers:check` fails CI when it is missing or hand-edited.
- JSON gets a top-level `"//"` banner. Only the banner value may be rewritten;
  do not reformat the rest of the file by hand.
- Add a short `@file` and `@summary` to the banner. For new modules, also add a
  block comment explaining _why_ the file exists, not just what it does.
- Do not add banners to `.nvmrc` or `next-env.d.ts`.

## 5. Legal content is its own source of truth

- All legal prose lives in `apps/web/src/content/legal.ts`, one typed document
  per locale and slug (`terms`, `privacy`, `cookies`, `security`, `notice`).
- Each document has its own page: `/[locale]/legal/<slug>`. The hub is
  `/[locale]/legal` and only indexes the documents.
- Never paste legal sentences into JSX or into `messages/*.json`. UI labels go
  in the `Legal` namespace; prose goes in the corpus.
- French and Arabic are equally authoritative and must stay in parity. In case
  of conflict, the French version prevails — say so in the text, as the corpus
  already does.
- Do not invent facts (company registration, address, provider names, fees).
  If a fact is unknown, write what is true today and record the gap in
  `docs/ip-protection.md` or the relevant ADR.
- The pre-launch draft banner stays until a Tunisian lawyer has reviewed the
  text. Removing it is a product decision, not a copy edit.

## 6. Two languages, one behaviour

- Every user-facing string exists in both `apps/web/src/messages/fr.json` and
  `ar.json`. No key may exist in only one file.
- Arabic is RTL from the server: use logical utilities (`ms-*`, `me-*`,
  `start-*`, `end-*`) and flip directional icons with `rtl:-scale-x-100`.
- Do not apply Latin letter-spacing to Arabic; `globals.css` already resets it.
- Dates, numbers and currency use `Intl` with `fr-TN` or `ar-TN`.

## 7. Money and data integrity

- Money is an integer number of millimes (`1 TND = 1000`) from database to
  render. No floats, no `parseFloat`, no arithmetic in the client.
- Format only through `@edurelay/ui` (`Price`, `money.ts`).
- Never write to `orders`, `payments` or balances from a component. State
  transitions go through the definer functions or server actions.

## 8. Assets and motion

- `EduRelay_icon.svg` / `edu-relay-icon.svg` is the icon only: favicon, app
  icon, compact headers, avatars.
- `EduRelay_logo.svg` / `edu-relay-logo.svg` is the full lockup: hero, footer,
  share cards, presentations. Never stretch it, recolour it or place it in a
  square.
- Copy brand SVGs verbatim. They carry C2PA provenance metadata. Never run them
  through an optimiser or minifier. If the XML is malformed, fix only the
  invalid comment and re-validate; do not restructure the file.
- Every asynchronous section gets a skeleton whose geometry matches the final
  card. Never show a spinner where a skeleton fits.
- Motion uses the tokens from the brand config. Every animation must collapse
  under `prefers-reduced-motion` (the global reset handles this — do not disable
  it locally).
- Animate entrances with `animate-fade-up` / `animate-fade-in` and
  `stagger-item` (`--stagger: index`); use `card-lift` for hoverable cards.

## 9. Checks before you claim done

```bash
pnpm theme          # only after editing brand.config.json
pnpm headers        # add/refresh file banners
pnpm headers:check  # must pass
pnpm lint           # Biome; exit code 0
pnpm typecheck      # all packages
pnpm build          # only with the dev server stopped
```

Then start `pnpm dev` and open `/fr`, `/ar`, `/fr/legal`,
`/fr/legal/terms`, `/ar/legal/privacy`, `/api/health` and
`/brand/edu-relay-logo.svg`.

## 10. Git and secrets

- Never commit `.env*`, keys, tokens or generated `.next`/`.turbo` output.
- Run `gitleaks git --config .gitleaks.toml --redact` before pushing.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
- Signed commits and signed tags are required before the repository is pushed;
  see `CONTRIBUTING.md` §4.

## 11. When in doubt

Read `docs/architecture.md` for the system, `docs/ip-protection.md` for the
ownership rules, and the ADRs before changing a decision. If a requirement
conflicts with these rules, stop and ask — do not silently pick one.
