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
  
  @file     packages/brand/README.md
  @summary  How to retheme the product by editing one file.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# @edurelay/brand

The single source of truth for everything visual and legal about EduRelay.

```
brand.config.json   ← edit this, nothing else
scripts/generate.mjs
generated/
  tokens.css        ← Tailwind v4 @theme block (do not edit)
  tokens.ts         ← typed constants (do not edit)
  brand.ts          ← public runtime identity, no ownership data (do not edit)
src/index.ts        ← typed accessors used by the app
```

## What lives in the config

| Key                 | Controls                                                        |
| ------------------- | --------------------------------------------------------------- |
| `name`, `nameParts` | Wordmark text and which part is teal                            |
| `taglines`          | Hero, meta description, footer                                  |
| `siteUrl`           | Canonical URLs, OG metadata, sitemap                            |
| `contacts`          | Support/security email, phone, WhatsApp                         |
| `owner`             | Portfolio, Instagram, Discord, Dev Community, Facebook, phone   |
| `colors`            | Light palette → `--color-*`                                     |
| `darkColors`        | Dark palette, applied under `prefers-color-scheme: dark`        |
| `typography`        | Font families, fluid scale, leading, tracking, measure          |
| `locale`            | Default locale, supported locales, labels, direction            |
| `currency`          | Code, symbol, minor units (1000 millimes per TND)               |
| `legal`             | Entity name, jurisdiction, licence line, confidentiality notice |

`owner` and the personal numbers in `contacts` exist only so the header
generator and the repository notices can read them. `generated/brand.ts` omits
them; the app never imports the raw config.

## Change a colour

```bash
# 1. edit brand.config.json -> colors.brand
pnpm theme          # 2. regenerate tokens
pnpm dev            # 3. open /fr/design and check contrast
pnpm headers        # 4. refresh the banner text if the legal notice changed
```

Commit the config and the generated files together. CI regenerates and fails if
they drift.

## Why generated files are committed

So a fresh clone builds without running a generator, and so a CSS diff is
reviewable in the pull request. The alternative — generating on install — hides
the change and breaks any tool that reads the tokens before the first build.

## Rules

- No hard-coded hex values anywhere else in the repo.
- The header banner is rendered from this config by `scripts/header.mjs`; do not
  hand-edit banners.
- The brand SVGs live in `apps/web/public/brand/` and are copied verbatim,
  metadata intact. See `docs/brand.md`.
