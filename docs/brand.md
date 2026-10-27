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
  
  @file     docs/brand.md
  @summary  Palette, typography and rules for using the icon vs the full lockup.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Brand and design system

Everything visual comes from **one file**: `packages/brand/brand.config.json`.
Nothing here is meant to be edited in the CSS — that file is generated.

```bash
pnpm theme    # brand.config.json -> packages/brand/generated/{tokens.css,tokens.ts,brand.ts}
pnpm dev      # tokens regenerate before Next starts
```

## 1. Why one source

A price page, an invoice, an email header and a favicon all have to agree. When
the palette lives in five places, they stop agreeing. The generator emits:

- `tokens.css` — a Tailwind v4 `@theme` block (`--color-*`, `--text-*`,
  `--leading-*`, `--tracking-*`, `--font-*`);
- `tokens.ts` — typed constants for anything that needs a value in JavaScript
  (charts, generated SVGs, the design page, email templates);
- `brand.ts` — the runtime identity object. It is a public subset: the ownership
  block and personal contact details stay in `brand.config.json` and never enter
  a client bundle.

If you find yourself writing `#1D9E75` outside the brand config, stop. Import
`brand` from `@edurelay/brand` instead of reading `brand.config.json` directly.

## 2. Palette

| Token         | Light     | Dark      | Use                                                        |
| ------------- | --------- | --------- | ---------------------------------------------------------- |
| `brand`       | `#1D9E75` | `#5DCAA5` | Primary actions, links, the "Edu" in the wordmark, focus   |
| `brand-dark`  | `#085041` | `#9FE1CB` | Hover/pressed, text on light brand tints                   |
| `brand-light` | `#E1F5EE` | `#04342C` | Section tints, badges, quiet backgrounds                   |
| `accent`      | `#EF9F27` | `#FAC775` | Donation, urgency, the "hand-off" highlight, savings badge |
| `accent-dark` | `#633806` | `#F7DFC0` | Amber text on light, hover                                 |
| `ink`         | `#2C2C2A` | `#E8E6DF` | Body text, headings                                        |
| `muted`       | `#888780` | `#A3A199` | Secondary text, metadata, placeholders                     |
| `canvas`      | `#FBFAF7` | `#12120F` | Page background (warm off-white, not pure white)           |
| `surface`     | `#FFFFFF` | `#1B1B18` | Cards, header, footer                                      |
| `line`        | `#E7E4DA` | `#2E2E29` | Borders and dividers                                       |
| `danger`      | `#DC2626` | `#F87171` | Errors, destructive actions, disputes                      |
| `success`     | `#16A34A` | `#4ADE80` | Confirmed, delivered, paid                                 |

**Ratio.** Teal does the work, amber is a spice, warm neutrals hold it together.
Roughly 70 % neutral, 20 % teal, 10 % amber. If a screen is more than a third
teal, it is wrong.

**Contrast.** `brand` on white is 3.5:1 — fine for large text and UI borders,
**not** for body copy. Use `brand-dark` (9.2:1) for small text on white. Amber is
never text on white: it fails. Amber text goes on `accent-dark` backgrounds or
inside a dark badge.

**Dark mode.** The SVGs read `svg[data-theme="dark"]` and
`prefers-color-scheme: dark` and swap through the `--brand`, `--brand-dark`,
`--brand-light`, `--accent`, `--text-main`, `--text-sub` variables. Do not
re-export them to make them dark — they already are.

## 3. Typography

**Pairing.** Plus Jakarta Sans for Latin, IBM Plex Sans Arabic for Arabic.

- Plus Jakarta Sans: geometric-humanist, warm, wide enough for a marketplace
  headline without shouting. It carries the "passed forward" tone better than
  Inter, and it holds at 13 px in tables.
- IBM Plex Sans Arabic: designed as a UI face, not a display face. Its counters
  stay open at small sizes and it pairs with Plex's Latin counterpart, so an
  Arabic page does not look like a different product.
- JetBrains Mono is declared for order numbers and prices in tables but **not
  loaded**: system monospace is good enough until a screen needs it, and every
  extra webfont costs a request at 3G.

Both faces are self-hosted through `next/font/google`, which subsets them at
build time, generates a `size-adjust` fallback from the font metrics, and
eliminates the layout shift a CDN font would cause.

**Scale** — fluid `clamp()`, so no breakpoint jumps:

| Token     | Size       |
| --------- | ---------- |
| `display` | 44 → 72 px |
| `h1`      | 34 → 52 px |
| `h2`      | 28 → 40 px |
| `h3`      | 22 → 28 px |
| `h4`      | 18 → 21 px |
| `body`    | 16 → 17 px |
| `small`   | 14 px      |
| `micro`   | 12 px      |

**Leading.** `display` 1.02, `heading` 1.12, `body` 1.65. Tighten as size grows;
never set body below 1.5.

**Tracking.** `display` −0.035em, `heading` −0.02em, caps labels +0.14em. Arabic
never gets negative tracking — it breaks the joins. The global stylesheet resets
tracking for `[lang="ar"]`.

**Measure.** 68ch for reading, 46ch for dense panels. Arabic runs ~10 % shorter
per character; the same `ch` limits stay readable.

## 4. Icon vs lockup

The two SVGs are different tools. Using the wrong one is the most common brand
mistake.

| Use                                 | Asset                  |
| ----------------------------------- | ---------------------- |
| Favicon, app icon, Apple touch icon | `edu-relay-icon.svg`   |
| Compact header, avatar, watermark   | `edu-relay-icon.svg`   |
| Hero, footer, OG image, deck cover  | `edu-relay-logo.svg`   |
| Inside a square app tile            | icon, with clear space |

Rules:

- Icon only: at least 24 px, clear space ≥ 25 % of its width, never with text
  baked in.
- Full lockup: at least 140 px wide. The tagline disappears below that — use the
  icon instead.
- Never stretch, rotate, recolour, outline, add a drop shadow, crop the tagline,
  or place the lockup inside another shape.
- On photography, use the mono/white version, not the coloured one.
- The SVGs keep their embedded C2PA provenance metadata. **Do not optimise,
  minify or re-export them.** That metadata is authorship evidence.

## 5. Layout and rhythm

- Container: 1180 px, 20 px gutters on mobile, 32 px from `sm`.
- Vertical rhythm: sections at 64–96 px, cards at 24 px, inline at 8/12/16.
- Radius: 10 px cards, 8 px inputs, full for pills and avatars.
- Borders: 1 px `line`. Shadows are almost never used; warmth comes from
  `canvas`, not from a grey blur.
- One primary action per screen. Secondary actions are outlined, destructive
  actions are text-only until the confirmation step.

## 6. Motion

Tokens live in `brand.config.json` → `motion` and are emitted as CSS variables
(`--duration-fast|base|slow`, `--ease-out|in-out`).

- `fast` 140 ms — hover, focus, colour changes.
- `base` 220 ms — small panels, dropdowns, skeleton fades.
- `slow` 480 ms — section entrances and the hero.
- `ease-out` is the default; `ease-in-out` is reserved for looping ambience
  (the floating delivery note, the skeleton shimmer).
- Stagger entrances by 70 ms per item with `stagger-item` and
  `--stagger: index`; cap a cascade at six items before resetting to zero.
- Animate opacity and transform only; never animate height on a list.
- Respect `prefers-reduced-motion`: the global reset collapses every duration to
  0.01 ms, so the final state is already the design.
- Nothing bounces. This is a school-supplies marketplace, not a game.

Skeletons mirror the real card's geometry: image block, title line, meta line,
price. A spinner is not a substitute. The shimmer is a single absolutely
positioned gradient in `globals.css`; it never animates layout.

## 7. Voice

French and Arabic, both plain and specific.

- Say the number: "retenu 48 h", not "paiement sécurisé".
- No exclamation marks in product copy. No "Oops".
- Arabic is written, not translated word-for-word. If a French sentence needs a
  subordinate clause, rewrite it shorter before translating.
- Never promise a refund date the courier controls.

## 8. Adding or changing a token

1. Edit `packages/brand/brand.config.json` (`colors`, `darkColors`,
   `typography.scale`, …).
2. `pnpm theme`.
3. `pnpm dev` and open `/fr/design` — every colour and type step renders there.
4. If the change touches the file banners, `pnpm headers`.
5. Commit the config **and** the generated files together; CI regenerates and
   fails on drift.

## 9. What not to do

- A second accent colour "just for promotions".
- Gradient buttons or glassmorphism.
- A serif display face for a marketplace that has to feel practical.
- Pure black text on pure white; the palette is warm on purpose.
- Arabic with letter-spacing, italic, or a Latin font.
- Re-exported or hand-edited brand SVGs.
