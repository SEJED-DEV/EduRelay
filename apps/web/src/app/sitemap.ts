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
 * @file     apps/web/src/app/sitemap.ts
 * @summary  Crawl map: public routes per locale with hreflang alternates.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Route manifest for crawlers.
 *
 * Generated from the same constants the pages use, so a new legal document or a
 * re-enabled section appears here automatically. `lastModified` is deliberately
 * omitted: the legal corpus carries its own review date, and a build timestamp
 * would tell search engines every page changed on every deploy.
 *
 * `/design` is excluded — it is an internal reference and is `noindex`.
 */

import { defaultLocale, locales } from "@edurelay/brand";
import type { MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/content/legal";
import { siteUrl } from "@/lib/seo";

const routes = ["", "/legal", ...LEGAL_SLUGS.map((slug) => `/legal/${slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: route === "" ? ("daily" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/legal" ? 0.5 : 0.4,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((code) => [code, `${siteUrl}/${code}${route}`]),
          ["x-default", `${siteUrl}/${defaultLocale}${route}`],
        ]),
      },
    })),
  );
}
