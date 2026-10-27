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
 * @file     apps/web/src/app/[locale]/legal/[slug]/page.tsx
 * @summary  Dedicated page for one legal document, generated from the corpus.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * One legal document.
 *
 * The route is dynamic on the slug but fully static at build time: every
 * (locale, slug) pair is generated from `content/legal.ts`. Each document gets
 * its own URL, title, description and canonical, which is why the hub and the
 * footer can link to `/legal/privacy` instead of a fragment.
 *
 * The corpus is the single source of truth. If a sentence needs changing, edit
 * `content/legal.ts` — never the JSX below.
 */

import { brand, defaultLocale, isLocale } from "@edurelay/brand";
import { buttonStyles } from "@edurelay/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowEnd, ShieldCheck } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { LegalRichText } from "@/components/legal-rich-text";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getLegalCorpus,
  getLegalDocument,
  isLegalSlug,
  LEGAL_SLUGS,
  type LegalSlug,
} from "@/content/legal";
import { Link } from "@/i18n/navigation";
import { alternates, languageTag, openGraphLocale } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

/**
 * The corpus is the complete list of documents, so an unknown slug is not a
 * page at all. `dynamicParams = false` turns that into a routing-level 404, which
 * Next.js answers with the prerendered `global-not-found.tsx` document instead
 * of an empty client-rendered error shell.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLegalSlug(slug)) {
    return {};
  }

  const doc = getLegalDocument(isLocale(locale) ? locale : defaultLocale, slug);

  return {
    title: doc.title,
    description: doc.description,
    alternates: alternates(locale, `/legal/${slug}`),
    openGraph: {
      type: "article",
      title: doc.title,
      description: doc.description,
      url: `${brand.siteUrl}/${locale}/legal/${slug}`,
      locale: openGraphLocale(locale),
    },
  };
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isLegalSlug(slug)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Legal" });
  const corpus = getLegalCorpus(locale);
  const doc = corpus[slug];
  const related = LEGAL_SLUGS.filter((item) => item !== slug).slice(0, 3);

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main" className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:py-16">
        <nav
          aria-label={t("breadcrumbLabel")}
          className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-micro uppercase tracking-caps text-muted"
        >
          <Link href="/" className="transition-colors hover:text-brand">
            {t("breadcrumbHome")}
          </Link>
          <span aria-hidden="true" className="text-muted/40">
            /
          </span>
          <Link href="/legal" className="transition-colors hover:text-brand">
            {t("breadcrumbLegal")}
          </Link>
          <span aria-hidden="true" className="text-muted/40">
            /
          </span>
          <span aria-current="page" className="max-w-[42ch] truncate text-ink/60">
            {doc.shortTitle}
          </span>
        </nav>

        <div className="animate-fade-up mt-8 max-w-[72ch]">
          <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-caps text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 font-serif text-h1 leading-heading tracking-heading text-ink">
            {doc.title}
          </h1>
          <p className="mt-4 text-body leading-body text-muted">{doc.description}</p>
          <p className="mt-4 font-mono text-micro uppercase tracking-caps text-muted/70">
            {t("updated", { date: doc.updated })}
          </p>
        </div>

        <p className="animate-fade-up mt-8 flex max-w-[78ch] items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.07] p-4 text-small leading-body text-accent-dark">
          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
          {t("draft")}
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={t("onThisPage")}>
            <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-caps text-ink/60">
              {t("onThisPage")}
            </h2>
            <nav className="mt-4">
              <ol className="space-y-2.5 border-s border-line ps-4">
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-small leading-snug text-muted transition-colors duration-200 hover:text-brand"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="space-y-10">
              {doc.intro.map((paragraph) => (
                <p key={paragraph} className="measure text-body leading-body text-ink/75">
                  <LegalRichText text={paragraph} />
                </p>
              ))}

              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-serif text-h3 leading-heading tracking-heading text-ink">
                    {section.title}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="measure mt-3 text-body leading-body text-ink/75">
                      <LegalRichText text={paragraph} />
                    </p>
                  ))}

                  {section.bullets?.length ? (
                    <ul className="mt-4 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-small leading-body text-ink/75">
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/70"
                          />
                          <span>
                            <LegalRichText text={bullet} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.table ? (
                    <div className="surface-card mt-5 overflow-x-auto rounded-2xl">
                      <table className="w-full min-w-[640px] border-collapse text-start text-small">
                        <thead className="bg-elevated text-brand-dark">
                          <tr>
                            {section.table.headers.map((header) => (
                              <th
                                key={header}
                                scope="col"
                                className="border-b border-line px-4 py-3 text-start font-medium"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr
                              key={row.join("|")}
                              className="border-b border-line/70 last:border-0 odd:bg-surface/30 even:bg-canvas/30"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`${row[0]}-${section.table?.headers[cellIndex] ?? cell}`}
                                  className="px-4 py-3 align-top leading-body text-ink/75"
                                >
                                  <LegalRichText text={cell} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="surface-card edge-light mt-14 rounded-2xl p-6 sm:p-8">
              <span className="flex size-10 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="mt-5 font-serif text-h4 text-ink">{t("contactTitle")}</h2>
              <p className="mt-2 max-w-[54ch] text-small leading-body text-muted">
                {t("contactBody", { email: brand.contacts.supportEmail })}
              </p>
              <a
                href={`mailto:${brand.contacts.supportEmail}`}
                className={buttonStyles({ size: "md", className: "mt-6" })}
              >
                {brand.contacts.supportEmail}
              </a>
            </div>

            <nav className="mt-10 border-t border-line/70 pt-8" aria-label={t("relatedTitle")}>
              <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-caps text-ink/60">
                {t("relatedTitle")}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((item: LegalSlug) => (
                  <li key={item}>
                    <Link
                      href={`/legal/${item}`}
                      className="card-lift surface-card flex h-full flex-col justify-between rounded-xl p-4"
                    >
                      <span className="text-small font-medium text-ink">
                        {corpus[item].shortTitle}
                      </span>
                      <ArrowEnd className="mt-4 size-4 text-brand rtl:-scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </article>
        </div>
      </main>

      <SiteFooter locale={locale} />

      <JsonLd
        data={graph([
          {
            "@type": "WebPage",
            "@id": `${brand.siteUrl}/${locale}/legal/${slug}#webpage`,
            url: `${brand.siteUrl}/${locale}/legal/${slug}`,
            name: doc.title,
            description: doc.description,
            inLanguage: languageTag(locale),
            isPartOf: { "@id": `${brand.siteUrl}/#website` },
            about: { "@id": `${brand.siteUrl}/#organization` },
          },
          breadcrumbSchema([
            { name: t("breadcrumbHome"), path: `/${locale}` },
            { name: t("breadcrumbLegal"), path: `/${locale}/legal` },
            { name: doc.shortTitle, path: `/${locale}/legal/${slug}` },
          ]),
        ])}
      />
    </>
  );
}
