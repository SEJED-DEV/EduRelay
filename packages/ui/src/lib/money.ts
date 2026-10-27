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
 * @file     packages/ui/src/lib/money.ts
 * @summary  TND millime formatting and parsing helpers.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Money helpers for Tunisian dinar (TND).
 *
 * RULE: money is stored and transported as integer MILLIMES (1 TND = 1000
 * millimes) everywhere — database, API payloads, component props. Floating
 * point dinars are only ever produced at the very last step, for display.
 * This mirrors `currency.minorUnitsPerMajor` in the brand config and the
 * `*_millimes` columns in the database.
 */

import { brand } from "@edurelay/brand";

/** 1 dinar = 1000 millimes. */
export const MILLIMES_PER_DINAR = brand.currency.minorUnitsPerMajor;

export interface FormatMillimesOptions {
  /** BCP-47 locale, e.g. `fr-TN` or `ar-TN`. Defaults to `fr-TN`. */
  locale?: string;
  /** Show the currency symbol (DT). Defaults to true. */
  showSymbol?: boolean;
  /** Force a fixed number of decimals; otherwise trailing zeros are trimmed. */
  fractionDigits?: number;
}

/** Convert a human-entered dinar amount to integer millimes. */
export function toMillimes(dinars: number): number {
  return Math.round(dinars * MILLIMES_PER_DINAR);
}

/** Convert integer millimes back to a dinar number (display only). */
export function toDinars(millimes: number): number {
  return millimes / MILLIMES_PER_DINAR;
}

/**
 * Format integer millimes for display: `12500` -> `12,5 DT` (fr-TN).
 *
 * Uses Intl currency formatting so the separator, digit shaping and symbol
 * position follow the active locale. Falls back to a plain decimal string if
 * the runtime lacks the requested locale data.
 */
export function formatMillimes(
  millimes: number,
  { locale = "fr-TN", showSymbol = true, fractionDigits }: FormatMillimesOptions = {},
): string {
  const safe = Number.isFinite(millimes) ? millimes : 0;
  const fraction = fractionDigits ?? brand.currency.maxFractionDigits;

  try {
    return new Intl.NumberFormat(locale, {
      style: showSymbol ? "currency" : "decimal",
      currency: brand.currency.code,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: fraction,
    }).format(toDinars(safe));
  } catch {
    const amount = toDinars(safe).toFixed(2).replace(/\.00$/, "");
    return showSymbol ? `${amount} ${brand.currency.symbol}` : amount;
  }
}

/**
 * Percentage saved versus a reference (retail) price, rounded to a whole
 * number. Returns null when a discount is not meaningful, so callers can omit
 * the badge entirely.
 */
export function savingsPercent(originalMillimes: number, priceMillimes: number): number | null {
  if (originalMillimes <= 0 || priceMillimes < 0 || priceMillimes >= originalMillimes) return null;
  return Math.round((1 - priceMillimes / originalMillimes) * 100);
}
