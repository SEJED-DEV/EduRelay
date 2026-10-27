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
 * @file     apps/web/src/app/[locale]/not-found.tsx
 * @summary  Localised 404 boundary for in-tree notFound() calls.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Localised 404.
 *
 * This is the boundary for `notFound()` thrown from pages that Next.js renders
 * on the server (the legal document route, for example). It is a Server
 * Component so it can resolve its copy from the request locale, and it lives
 * under [locale] to inherit the locale layout's `lang`, `dir` and fonts.
 *
 * Unmatched URLs never reach this file — they have no route at all — so the
 * static document in `app/global-not-found.tsx` handles them.
 */

import { buttonStyles } from "@edurelay/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-[880px] flex-col items-start justify-center overflow-hidden px-6 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 top-1/3 size-[26rem] rounded-full bg-brand/10 blur-[130px]"
      />

      <div className="relative">
        <p aria-hidden="true" className="font-mono text-micro uppercase tracking-caps text-brand">
          — 404
        </p>
        <p className="text-gradient display-glow mt-3 font-serif text-display leading-display tracking-display">
          404
        </p>
        <h1 className="mt-4 font-serif text-h2 leading-heading tracking-heading text-ink">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[46ch] text-body leading-body text-muted">{t("body")}</p>
        <Link href="/" className={buttonStyles({ size: "lg", className: "mt-9" })}>
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
