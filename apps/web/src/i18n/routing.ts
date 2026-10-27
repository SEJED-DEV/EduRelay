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
 * @file     apps/web/src/i18n/routing.ts
 * @summary  Locale list and prefix strategy.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Locale routing.
 *
 * Every page lives under a locale prefix (`/fr/...`, `/ar/...`) because listing
 * pages must be indexable per language; a cookie or Accept-Language-only
 * strategy would collapse both languages onto one URL and hurt SEO.
 *
 * The locale list, default and direction all come from the brand config, so
 * adding a third language is a config change plus a messages file.
 */

import { brand, defaultLocale, isLocale, locales } from "@edurelay/brand";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    name: "EDURELAY_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
});

export { brand, defaultLocale, isLocale, locales };

/** Locale used by the "switch language" control. */
export function otherLocale(current: string): string {
  return locales.find((locale) => locale !== current) ?? defaultLocale;
}
