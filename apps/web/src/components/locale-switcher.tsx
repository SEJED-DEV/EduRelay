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
 * @file     apps/web/src/components/locale-switcher.tsx
 * @summary  FR/AR switch that keeps the current page.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Locale switcher.
 *
 * Client component because it needs the current pathname to keep the visitor on
 * the same page when they change language. next-intl's Link handles the prefix
 * swap; the cookie set by the middleware remembers the choice next visit.
 */

"use client";

import { brand } from "@edurelay/brand";
import { Globe } from "@/components/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { otherLocale } from "@/i18n/routing";

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const label = brand.locale.labels[target as "fr" | "ar"] ?? target.toUpperCase();

  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      aria-label={`${brand.locale.labels[locale as "fr" | "ar"] ?? locale} → ${label}`}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line/80 bg-surface/40 px-3 text-small font-medium text-muted backdrop-blur-md transition-colors duration-200 hover:border-brand/40 hover:bg-surface/70 hover:text-ink"
    >
      <Globe className="size-4" />
      <span>{label}</span>
    </Link>
  );
}
