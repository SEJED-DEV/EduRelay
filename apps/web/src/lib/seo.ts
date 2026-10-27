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
 * @file     apps/web/src/lib/seo.ts
 * @summary  Canonical URL, locale and hreflang helpers.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * SEO primitives.
 *
 * One place for the two things every page must agree on: the absolute URL and
 * the hreflang set. Getting `x-default` wrong on a bilingual marketplace sends
 * Arabic searchers to the French page, so the mapping lives here instead of
 * being retyped in each route.
 *
 * `alternates()` takes the *unprefixed* route (`""`, `/legal`, `/legal/terms`)
 * and returns the shape Next.js expects under `metadata.alternates`.
 */

import { brand, defaultLocale, locales } from "@edurelay/brand";

/** Canonical origin, from the brand config — never a hardcoded host. */
export const siteUrl = brand.siteUrl;

/** Absolute URL for a locale-prefixed path. */
export function absoluteUrl(path: string): string {
  return new URL(path, brand.siteUrl).toString();
}

/** Open Graph locale codes (`fr_TN`), not the bare app locale (`fr`). */
export function openGraphLocale(locale: string): string {
  return locale === "ar" ? "ar_TN" : "fr_TN";
}

/** The other locale, as Open Graph expects it. */
export function openGraphAlternateLocale(locale: string): string[] {
  return [openGraphLocale(locale === "ar" ? "fr" : "ar")];
}

/** BCP 47 tag used for `inLanguage` in structured data and `<html lang>`. */
export function languageTag(locale: string): string {
  return locale === "ar" ? "ar-TN" : "fr-TN";
}

export interface Alternates {
  canonical: string;
  languages: Record<string, string>;
}

/**
 * Canonical + hreflang for a route.
 *
 * - `path` is the route *without* a locale prefix and starts with `/`
 *   (use `""` for the home page).
 * - `x-default` points at French, the default locale and the contract language
 *   of the legal corpus.
 */
export function alternates(locale: string, path: string): Alternates {
  const suffix = path === "/" ? "" : path;

  return {
    canonical: `/${locale}${suffix}`,
    languages: Object.fromEntries([
      ...locales.map((code) => [code, `/${code}${suffix}`]),
      ["x-default", `/${defaultLocale}${suffix}`],
    ]),
  };
}
