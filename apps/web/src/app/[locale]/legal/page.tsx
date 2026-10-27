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
 * @file     apps/web/src/app/[locale]/legal/page.tsx
 * @summary  Legal hub linking to one page per document.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Legal hub.
 *
 * Each document lives on its own route (`/fr/legal/privacy`, `/ar/legal/terms`,
 * …) so it can be versioned, linked and reviewed independently. This page only
 * indexes them. All wording comes from `content/legal.ts`; the UI labels come
 * from the `Legal` namespace so French and Arabic stay in lockstep.
 */

import { brand } from "@edurelay/brand";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { ArrowEnd, Document } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLegalCorpus, LEGAL_SLUGS } from "@/content/legal";
import { Link } from "@/i18n/navigation";
import { alternates, openGraphLocale } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternates(locale, "/legal"),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("subtitle"),
      url: `${brand.siteUrl}/${locale}/legal`,
      locale: openGraphLocale(locale),
    },
  };
}

export default async function LegalHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Legal" });
  const corpus = getLegalCorpus(locale);

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main" className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="animate-fade-up max-w-[64ch]">
          <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-caps text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 font-serif text-h1 leading-heading tracking-heading text-ink">
            {t("title")}
          </h1>
          <p className="mt-5 text-body leading-body text-muted">{t("subtitle")}</p>
        </div>

        <p className="animate-fade-up mt-9 flex max-w-[76ch] items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.07] p-4 text-small leading-body text-accent-dark">
          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
          {t("draft")}
        </p>

        <section className="mt-16" aria-labelledby="legal-hub-title">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="legal-hub-title"
              className="font-serif text-h2 leading-heading tracking-heading text-ink"
            >
              {t("hubTitle")}
            </h2>
            <p className="max-w-[52ch] text-small leading-body text-muted">{t("hubIntro")}</p>
          </div>

          <ul className="mt-9 grid gap-5 md:grid-cols-2">
            {LEGAL_SLUGS.map((slug, index) => {
              const doc = corpus[slug];

              return (
                <li
                  key={slug}
                  className="animate-fade-up stagger-item"
                  style={{ "--stagger": index } as CSSProperties}
                >
                  <Link
                    href={`/legal/${slug}`}
                    className="card-lift surface-card group flex h-full flex-col rounded-[1.4rem] p-6 sm:p-7"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className="flex size-10 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand transition-colors duration-300 group-hover:border-brand/50 group-hover:bg-brand/20"
                      >
                        <Document className="size-5" />
                      </span>
                      <span className="font-mono text-micro tabular-nums text-muted/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <h3 className="mt-6 font-serif text-h3 leading-heading tracking-heading text-ink">
                      {doc.shortTitle}
                    </h3>
                    <p className="mt-2 text-small leading-body text-muted">{doc.description}</p>

                    <span className="mt-auto flex items-center gap-2 pt-6 text-small font-medium text-brand">
                      {t("read")}
                      <ArrowEnd className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="surface-card edge-light mt-16 overflow-hidden rounded-[2rem] p-7 sm:p-10">
          <h2 className="font-serif text-h3 leading-heading tracking-heading text-ink">
            {t("contactTitle")}
          </h2>
          <p className="mt-3 max-w-[58ch] text-body leading-body text-muted">
            {t("contactBody", { email: brand.contacts.supportEmail })}
          </p>
          <p className="mt-5 font-mono text-micro uppercase tracking-caps text-muted/70">
            {t("updated", { date: corpus.terms.updated })}
          </p>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
