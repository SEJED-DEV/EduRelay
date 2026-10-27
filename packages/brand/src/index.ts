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
 * @file     packages/brand/src/index.ts
 * @summary  Typed accessors for the brand config (locale, wordmark, URLs).
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Typed access to the single brand source of truth.
 *
 * Everything user-facing that carries the company identity — name, wordmark
 * parts, tagline, palette, locale list, currency, legal notice, social links —
 * comes from `brand.config.json`. Do not hardcode the company name, the phone
 * number or a hex colour anywhere else in the codebase.
 *
 * Only the public subset is generated into `generated/brand.ts`: the ownership
 * block and personal contact details never leave the source config.
 *
 * Regenerate the CSS/TS tokens and the runtime config after editing the file:
 *   pnpm theme
 */

import { brandConfig } from "../generated/brand";

export const brand = brandConfig;

export type Brand = typeof brand;
export type BrandColorName = keyof Brand["colors"];

/**
 * Supported locale codes.
 *
 * Derived from the `dir` map rather than the `locales` array because JSON
 * imports widen string-literal arrays to `string[]`; the `dir` keys survive as
 * literals ("fr" | "ar"), which is what we need for safe indexed lookups.
 */
export type Locale = keyof Brand["locale"]["dir"];

/** Locales supported by the product, in display order. */
export const locales = brand.locale.locales;

/** Locale used when none is present in the URL. */
export const defaultLocale = brand.locale.default as Locale;

/** Writing direction for a locale. Arabic is RTL, French is LTR. */
export function directionOf(locale: string): "ltr" | "rtl" {
  return isLocale(locale) && brand.locale.dir[locale] === "rtl" ? "rtl" : "ltr";
}

/** True when the locale is one we actually ship translations for. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * The wordmark split into styled parts, so the UI can reproduce the two-tone
 * "Edu" (teal) + "Relay" (ink) treatment from the SVG without hardcoding it.
 */
export function wordmarkParts(): Brand["nameParts"] {
  return brand.nameParts;
}

/** Canonical absolute URL for a path, used by metadata and share cards. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, brand.siteUrl).toString();
}

export { colors, cssVar, tokens } from "../generated/tokens";
