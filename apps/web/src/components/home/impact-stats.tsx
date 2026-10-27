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
 * @file     apps/web/src/components/home/impact-stats.tsx
 * @summary  Live platform counters in the hero panel, read from Postgres.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Live platform counters.
 *
 * These three numbers used to be marketing copy. They are now aggregates from
 * `public.platform_stats()`: active listings, items sold, covered wilayas. When
 * the database is unavailable the value renders as an em dash — never a made-up
 * number.
 */

import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { loadPlatformStats } from "@/lib/home";

const STAT_KEYS = [
  { key: "active_listings", label: "Stats.listingsLabel" },
  { key: "sold_items", label: "Stats.soldLabel" },
  { key: "covered_wilayas", label: "Stats.wilayasLabel" },
] as const;

export async function ImpactStats({ locale }: { locale: string }) {
  const [{ stats }, t] = await Promise.all([loadPlatformStats(), getTranslations({ locale })]);
  const numberFormat = new Intl.NumberFormat(locale === "ar" ? "ar-TN" : "fr-TN");

  return (
    <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line/70 pt-5">
      {STAT_KEYS.map((stat, index) => {
        const value = stats ? stats[stat.key] : null;

        return (
          <div
            key={stat.key}
            className="animate-fade-up stagger-item min-w-0"
            style={{ "--stagger": index } as CSSProperties}
          >
            <dt className="sr-only">{t(stat.label)}</dt>
            <dd>
              <span className="block truncate font-mono text-h4 font-medium tabular-nums text-brand">
                {value === null ? "—" : numberFormat.format(value)}
              </span>
              <span className="mt-1 block text-[0.66rem] leading-snug text-muted">
                {t(stat.label)}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
