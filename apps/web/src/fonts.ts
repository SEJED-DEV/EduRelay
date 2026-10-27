/**
 * ==============================================================================
 * EduRelay — School Supplies · Passed Forward
 * Copyright (c) 2026 EduRelay. All rights reserved.
 *
 * PRIVATE REPOSITORY — CONFIDENTIAL.
 * This file is part of a private, proprietary codebase. Access is granted by
 * prior written permission from the owner only. If you are reading this without
 * that permission you must stop now and delete every copy: you may not view,
 * copy, modify, distribute or disclose this file.
 * Unauthorised access or use may give rise to civil and/or criminal liability
 * under applicable law, including Tunisian intellectual-property law (Law No.
 * 94-36) and the law on electronic exchanges (Law No. 2000-83).
 *
 * Code owned by EduRelay · Made by Sejed TRABELSSI
 *   Portfolio      https://sejed.dev
 *   Instagram      https://instagram.com/sejed.dev
 *   Discord        https://discord.gg/sejed.dev
 *   Dev Community  https://dev.to/sejed.dev
 *   Facebook       https://facebook.com/TSSEJED
 *   Mobile         +216 94 155 000
 *
 * @file     apps/web/src/fonts.ts
 * @summary  Shared next/font definitions for every document with an <html>.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Shared next/font definitions.
 *
 * The self-hosted faces are declared once so every document that owns an
 * `<html>` element can apply the same CSS variables: the locale layout for
 * normal pages, and `global-not-found.tsx` for the prerendered 404, which is
 * rendered outside the locale tree and therefore cannot inherit them.
 */

import { Fraunces, Geist_Mono, Manrope, Tajawal } from "next/font/google";

/** Latin UI face: geometric, warm, modern; legible at 13px and crisp at display. */
const latin = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-latin-loaded",
  display: "swap",
  preload: true,
});

/**
 * Editorial display face: high-contrast variable serif reserved for the hero,
 * section titles and pull quotes. `font-synthesis-weight: none` in globals.css
 * keeps it from faking a bold.
 */
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif-loaded",
  display: "swap",
  preload: true,
});

/** Arabic face: modern geometric, wide counters, clean at small sizes. */
const arabic = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-arabic-loaded",
  display: "swap",
  preload: false,
});

/** Monospace ledgers: eyebrow labels, indices and the live counters. */
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-loaded",
  display: "swap",
  preload: false,
});

/** Space-separated variable classes for the `<html>` element. */
export const fontVariables = [latin.variable, serif.variable, arabic.variable, mono.variable].join(
  " ",
);
