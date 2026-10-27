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
 * @file     apps/web/src/app/manifest.ts
 * @summary  PWA manifest: name, dark theme colour, signed icon.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Web app manifest.
 *
 * Installable on Android and desktop with the signed icon, and the theme colour
 * matches the dark canvas so the splash screen does not flash a light rectangle
 * before the page paints.
 */

import { brand, defaultLocale } from "@edurelay/brand";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} — ${brand.description.fr}`,
    short_name: brand.name,
    description: brand.description.fr,
    start_url: `/${defaultLocale}`,
    scope: "/",
    display: "standalone",
    background_color: brand.darkColors.canvas,
    theme_color: brand.darkColors.canvas,
    lang: defaultLocale,
    dir: brand.locale.dir[defaultLocale],
    categories: ["shopping", "education"],
    icons: [
      {
        src: "/brand/edu-relay-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
