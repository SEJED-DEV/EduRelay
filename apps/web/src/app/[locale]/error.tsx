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
 * @file     apps/web/src/app/[locale]/error.tsx
 * @summary  Localised 500 boundary: retry, reference digest, support route.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Localised error boundary.
 *
 * Caught here: any render/runtime error inside the locale tree (a failed data
 * read, a component throwing during render). Next.js logs it and hands us the
 * digest, which we show so a support message can be matched to the server log —
 * the message itself stays generic, because stack traces are not user copy.
 *
 * The boundary sits *inside* the locale layout, so `lang`, `dir` and the
 * next-intl provider are intact; `reset()` re-renders the segment without a full
 * reload. `error.tsx` is the one place in the app that must be a Client
 * Component, hence the explicit "use client".
 */

"use client";

import { brand } from "@edurelay/brand";
import { buttonStyles } from "@edurelay/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations("Error");
  const reference = error.digest ?? null;
  const subject = encodeURIComponent(`[${brand.name}] ${reference ?? t("title")}`);

  return (
    <main
      id="main"
      className="relative mx-auto flex min-h-dvh max-w-[880px] flex-col items-start justify-center overflow-hidden px-6 py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 top-1/3 size-[26rem] rounded-full bg-danger/10 blur-[130px]"
      />

      <div className="relative">
        <p aria-hidden="true" className="font-mono text-micro uppercase tracking-caps text-danger">
          — {t("code")}
        </p>
        <p className="text-gradient display-glow mt-3 font-serif text-display leading-display tracking-display">
          {t("code")}
        </p>
        <h1 className="mt-4 font-serif text-h2 leading-heading tracking-heading text-ink">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[46ch] text-body leading-body text-muted">{t("body")}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button type="button" onClick={reset} className={buttonStyles({ size: "lg" })}>
            {t("retry")}
          </button>
          <Link href="/" className={buttonStyles({ size: "lg", variant: "secondary" })}>
            {t("home")}
          </Link>
        </div>

        <div className="mt-8 border-t border-line/70 pt-6 text-small text-muted">
          {reference ? (
            <p className="font-mono text-micro uppercase tracking-caps">
              {t("reference")} · <code className="text-ink/70">{reference}</code>
            </p>
          ) : null}
          <a
            href={`mailto:${brand.contacts.supportEmail}?subject=${subject}`}
            className="mt-3 inline-flex items-center gap-2 text-brand transition-colors hover:text-brand-dark"
          >
            {t("contact")} · {brand.contacts.supportEmail}
          </a>
        </div>
      </div>
    </main>
  );
}
