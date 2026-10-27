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
 * @file     apps/web/src/app/[locale]/(home)/page.tsx
 * @summary  Marketing home page — brand, trust signals, live catalogue.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Marketing home page.
 *
 * Server-rendered and fully localised (fr/ar). Three jobs, in order:
 *   1. say what EduRelay is in one sentence;
 *   2. answer "can I trust this?" (escrow window, tracked delivery, donations);
 *   3. show what the product looks like with REAL listings from Postgres.
 *
 * The visual language is dark cinema: a green-black canvas lit by two ambient
 * washes, an oversized serif headline, frosted panels and hairline rules. The
 * numbered section markers are aria-hidden decoration, not content.
 *
 * Nothing on this page is a fixture. Listings and counters stream from
 * `public_listings` / `platform_stats()` behind Suspense boundaries, so the
 * shell paints immediately and each data section gets its own skeleton state.
 * Prices are integer millimes, exactly as stored.
 */

import { brand } from "@edurelay/brand";
import { Badge, BrandSignature, buttonStyles } from "@edurelay/ui";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import { Faq } from "@/components/home/faq";
import { FeaturedListings } from "@/components/home/featured-listings";
import { ImpactStats } from "@/components/home/impact-stats";
import { ArrowEnd, Check, Heart, ShieldCheck, Truck } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ListingsGridSkeleton, StatsSkeleton } from "@/components/skeletons";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const tagline = locale === "ar" ? brand.tagline.ar : brand.tagline.fr;

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="grain relative isolate overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="animate-drift absolute -start-48 -top-64 size-[44rem] rounded-full bg-brand/20 blur-[150px]" />
            <div className="animate-drift absolute -end-48 top-4 size-[34rem] rounded-full bg-accent/10 blur-[140px] [animation-delay:-9s]" />
            <div
              className="absolute inset-x-0 top-0 h-[30rem] opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
                backgroundSize: "88px 88px",
                maskImage: "radial-gradient(72% 64% at 50% 0%, black, transparent)",
                WebkitMaskImage: "radial-gradient(72% 64% at 50% 0%, black, transparent)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
          </div>

          <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16 lg:pb-28 lg:pt-24">
            <div className="animate-fade-up">
              <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-caps text-brand">
                <span className="relative flex size-2 items-center justify-center">
                  <span className="animate-pulse-soft absolute inline-flex size-2 rounded-full bg-brand/45" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                </span>
                {t("Hero.eyebrow")}
                <span
                  aria-hidden="true"
                  className="hidden h-px w-16 bg-gradient-to-r from-brand/60 to-transparent sm:block"
                />
              </p>

              <h1 className="text-gradient display-glow mt-6 font-serif text-display leading-display tracking-display">
                {t("Hero.title")}
              </h1>

              <p className="mt-6 max-w-[46ch] text-body leading-body text-muted">
                {t("Hero.subtitle")}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/#annonces" className={buttonStyles({ size: "lg" })}>
                  {t("Hero.primary")}
                  <ArrowEnd className="size-4 rtl:-scale-x-100" />
                </Link>
                <Link
                  href="/#vendre"
                  className={buttonStyles({ size: "lg", variant: "secondary" })}
                >
                  {t("Hero.secondary")}
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line/70 pt-6 text-small text-muted">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-brand" />
                  {t("Hero.trustEscrow")}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Truck className="size-4 text-brand" />
                  {t("Hero.trustDelivery")}
                </li>
                <li className="inline-flex items-center gap-2">
                  <Heart className="size-4 text-brand" />
                  {t("Hero.trustDonation")}
                </li>
              </ul>
            </div>

            {/* Brand panel. The signature is composed from tokens + the signed
                icon, so it neither flips with the visitor's OS nor ships an
                English tagline on the French and Arabic pages. */}
            <div className="animate-fade-up relative [animation-delay:120ms]">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-[3rem] bg-brand/10 blur-3xl"
              />

              <div className="edge-light glass relative overflow-hidden rounded-[2rem] p-2">
                <div className="rounded-[1.6rem] bg-elevated p-6 sm:p-8">
                  <BrandSignature size="lg" tagline={tagline} className="max-w-full" />
                  <p className="mt-5 font-mono text-[0.66rem] uppercase leading-relaxed tracking-caps text-muted">
                    {t("Hero.panelCaption")}
                  </p>

                  <Suspense fallback={<StatsSkeleton />}>
                    <ImpactStats locale={locale} />
                  </Suspense>
                </div>
              </div>

              <div className="animate-float glass absolute -bottom-5 end-4 flex items-center gap-2 rounded-full px-4 py-2.5">
                <Truck className="size-4 text-brand" />
                <span className="text-micro text-muted">{t("Hero.panelNote")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="comment" className="relative border-y border-line/60 bg-surface/25">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-24">
            <p aria-hidden="true" className="font-mono text-micro tracking-caps text-brand/70">
              02
            </p>
            <h2 className="mt-4 max-w-[26ch] font-serif text-h1 leading-heading tracking-heading text-ink">
              {t("HowItWorks.title")}
            </h2>

            <ol className="mt-14 border-t border-line/70">
              {[1, 2, 3].map((step, index) => (
                <li
                  key={step}
                  className="group animate-fade-up stagger-item grid gap-3 border-b border-line/70 py-8 md:grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] md:items-start md:gap-8"
                  style={{ "--stagger": index } as CSSProperties}
                >
                  <span className="font-mono text-h3 leading-none tabular-nums text-brand/35 transition-colors duration-300 group-hover:text-brand">
                    {String(step).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-serif text-h2 leading-heading tracking-heading text-ink">
                      {t(`HowItWorks.step${step}Title`)}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-body leading-body text-muted">
                      {t(`HowItWorks.step${step}Body`)}
                    </p>
                  </div>

                  <ArrowEnd
                    aria-hidden="true"
                    className="hidden size-5 text-muted/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand md:block rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <section id="annonces" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:py-24">
          <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
            <div>
              <p aria-hidden="true" className="font-mono text-micro tracking-caps text-brand/70">
                03
              </p>
              <h2 className="mt-4 font-serif text-h1 leading-heading tracking-heading text-ink">
                {t("Listings.title")}
              </h2>
              <p className="mt-3 max-w-[52ch] text-body text-muted">{t("Listings.subtitle")}</p>
            </div>

            <Link
              href="/#annonces"
              className="group inline-flex items-center gap-2 rounded-full border border-line/80 bg-surface/40 px-4 py-2 text-small text-muted backdrop-blur-md transition-colors duration-200 hover:border-brand/45 hover:text-ink"
            >
              {t("Listings.viewAll")}
              <ArrowEnd className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>

          <Suspense fallback={<ListingsGridSkeleton />}>
            <FeaturedListings locale={locale} />
          </Suspense>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <Faq locale={locale} />

        {/* ── Donation ─────────────────────────────────────────────────── */}
        <section id="don" className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="grain animate-fade-up relative overflow-hidden rounded-[2.5rem] border border-brand/20 bg-gradient-to-br from-brand-light via-surface to-canvas px-7 py-14 sm:px-12 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-24 -top-28 size-80 rounded-full bg-accent/20 blur-[110px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 start-1/3 size-72 rounded-full bg-brand/20 blur-[120px]"
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] lg:items-end">
              <div>
                <Badge tone="accent" caps>
                  <Heart className="size-3.5" />
                  {t("Nav.donate")}
                </Badge>

                <h2 className="mt-6 max-w-[22ch] font-serif text-h1 leading-heading tracking-heading text-ink">
                  {t("Donation.title")}
                </h2>

                <p className="mt-4 max-w-[56ch] text-body leading-body text-muted">
                  {t("Donation.body")}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Link href="/#don" className={buttonStyles({ variant: "accent", size: "lg" })}>
                  {t("Donation.cta")}
                  <ArrowEnd className="size-4 rtl:-scale-x-100" />
                </Link>
                <span className="text-micro text-muted lg:text-end">{t("Donation.note")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Seller call to action ────────────────────────────────────── */}
        <section id="vendre" className="mx-auto mt-20 max-w-[1180px] px-5 sm:px-8 lg:mt-24">
          <div className="surface-card edge-light animate-fade-up relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <p aria-hidden="true" className="font-mono text-micro tracking-caps text-brand/70">
              05
            </p>

            <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="font-serif text-h2 leading-heading tracking-heading text-ink">
                  {t("Sell.title")}
                </h2>
                <p className="mt-3 max-w-[56ch] text-body leading-body text-muted">
                  {t("Sell.body")}
                </p>

                <ul className="mt-6 grid gap-3 text-small text-muted sm:grid-cols-3">
                  {[1, 2, 3].map((point) => (
                    <li key={point} className="inline-flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {t(`Sell.point${point}`)}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/#annonces" className={buttonStyles({ size: "lg" })}>
                {t("Sell.cta")}
                <ArrowEnd className="size-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
