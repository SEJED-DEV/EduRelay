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
  
  @file     packages/ui/README.md
  @summary  Design-system conventions, money helpers and RTL rules.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# @edurelay/ui

The design system: primitives, brand components, and the only money formatter in
the codebase.

```
src/components/   Button, Badge, Price, BrandIcon, BrandLockup, BrandSignature, Wordmark
src/lib/cn.ts     class-name joiner
src/lib/money.ts  formatMillimes, toMillimes, savingsPercent
src/index.ts      public surface
```

## Components

| Component        | Notes                                                                           |
| ---------------- | ------------------------------------------------------------------------------- |
| `Button`         | `primary` / `secondary` / `ghost` / `danger`; sizes `sm`/`md`/`lg`; `fullWidth` |
| `buttonStyles()` | Same classes for links that must look like buttons                              |
| `Badge`          | Status, condition, category pills; `tone` maps to the palette                   |
| `Price`          | Millimes in, localised TND out, optional struck-through original and savings    |
| `BrandIcon`      | Icon-only SVG, `currentColor`-friendly for compact headers                      |
| `BrandSignature` | Composed mark for the product UI: signed icon + token wordmark + localised line |
| `BrandLockup`    | Signed SVG lockup for share cards, print and the `/design` reference            |
| `Wordmark`       | Text-only "Edu" + "Relay" when the full lockup is too heavy                     |

## Money

```ts
import { formatMillimes, toMillimes, savingsPercent } from "@edurelay/ui";

formatMillimes(85000, "fr-TN"); // "85,000 DT"
toMillimes("12,500"); // 12500   (throws on bad input)
savingsPercent(85000, 210000); // 59
```

Rules:

- Input is always integer millimes (1 TND = 1000).
- Never do arithmetic on formatted strings.
- Never `Math.round` a price in a component; round at the boundary where the
  value is created, and store the rounded integer.
- Arabic uses `ar-TN`; the formatter handles the separator and direction.

## Conventions

- Every component is a server component unless it needs state or events.
- Props extend the native element props where it makes sense.
- Spacing and colour come from tokens (`bg-brand`, `text-muted`, `border-line`),
  never from hex values.
- RTL-safe by construction: logical properties (`ms-`, `me-`, `text-start`), no
  absolute `left`/`right` positioning for anything that mirrors.
- `className` is always last, so a consumer can override a default.
- No animation library here. Transitions are CSS, 120–180 ms, and they respect
  `prefers-reduced-motion`.

## Adding a component

1. One file per component in `src/components/`.
2. Export it from `src/index.ts`.
3. Use it once on `/fr/design` so the states are visible, and add it to the
   design page's component section.
4. Add the path to `SUMMARIES` in `scripts/add-headers.mjs`, then `pnpm headers`.
