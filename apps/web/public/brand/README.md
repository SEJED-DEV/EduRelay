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
  
  @file     apps/web/public/brand/README.md
  @summary  Where the two brand SVGs live and how to regenerate icons.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Brand assets

Two files, two jobs. Never swap them.

| File                 | ViewBox   | Use                                                         |
| -------------------- | --------- | ----------------------------------------------------------- |
| `edu-relay-icon.svg` | 320 × 320 | Favicon, app icon, Apple touch icon, compact header, avatar |
| `edu-relay-logo.svg` | 680 × 340 | Hero, footer, OG image, deck cover, anything with room      |

The originals live at the repository root (`EduRelay_icon.svg`,
`EduRelay_logo.svg`). These copies are byte-identical.

## Rules

- **Do not optimise, minify, prettify or re-export.** Both files carry embedded
  C2PA provenance metadata; stripping it destroys the authorship evidence.
- Do not edit the `viewBox`, the colours, or the internal `<style>` block.
- Both SVGs support dark mode through `svg[data-theme="dark"]` and
  `prefers-color-scheme: dark`, driven by CSS variables:
  `--brand`, `--brand-dark`, `--brand-light`, `--accent`, `--text-main`,
  `--text-sub`. The app sets these from `packages/brand/generated/tokens.css`.
- Minimum sizes: icon 24 px, lockup 140 px wide. Below 140 px the tagline becomes
  illegible — use the icon.
- Clear space: at least 25 % of the icon's width on every side.

## Adding a size or format

Do not redraw. Export from the original vector source at the required size, keep
the metadata, and document the new file here.

Needed before launch:

- `favicon.ico` (16/32/48) — generated from the icon, metadata preserved where the
  format allows;
- PNG fallbacks for email clients that do not render SVG (2× only);
- a 1200 × 630 OG image composed from the lockup, not a stretched icon.

## Why these are in `public/`

Next.js serves `public/` from the root, so `/brand/edu-relay-logo.svg` is stable,
cacheable and usable in metadata, emails and the README. Importing the SVG as a
component would change its URL on every build and lose the metadata.
