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
 * @file     apps/web/src/app/[locale]/design/page.tsx
 * @summary  Internal design-system reference: palette, type scale, components.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Internal design-system reference.
 *
 * A single page that renders every token and primitive, so a palette or scale
 * change can be eyeballed immediately after `pnpm theme`. Not indexed, not
 * linked from the main navigation (only the footer).
 */

import { brand } from "@edurelay/brand";
import { Badge, Button, Price } from "@edurelay/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrandMarks } from "@/components/design/brand-marks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { alternates } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Design system",
    alternates: alternates(locale, "/design"),
    robots: { index: false, follow: false },
  };
}

const TYPE_STEPS = [
  { token: "display", className: "text-display leading-display tracking-display" },
  { token: "h1", className: "text-h1 leading-heading tracking-heading" },
  { token: "h2", className: "text-h2 leading-heading tracking-heading" },
  { token: "h3", className: "text-h3 leading-heading tracking-heading" },
  { token: "h4", className: "text-h4 leading-snug" },
  { token: "body", className: "text-body leading-body" },
  { token: "small", className: "text-small leading-body" },
  { token: "micro", className: "text-micro leading-snug" },
] as const;

export default async function DesignPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Design" });
  const intlLocale = locale === "ar" ? "ar-TN" : "fr-TN";
  // The shipped palette is the dark roster; the anchor (light) set stays in
  // the config for print and e-mail and is not what visitors see.
  const swatches = Object.entries(brand.darkColors);

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main" className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
        <p className="font-mono text-micro uppercase tracking-caps text-brand">— Design</p>
        <h1 className="mt-4 font-serif text-h1 leading-heading tracking-heading text-ink">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-[62ch] text-body leading-body text-muted">{t("subtitle")}</p>

        {/* Palette */}
        <section className="mt-14">
          <h2 className="font-serif text-h3 leading-heading text-ink">{t("palette")}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {swatches.map(([name, hex]) => (
              <div key={name} className="surface-card overflow-hidden rounded-2xl">
                <div className="h-16 w-full" style={{ backgroundColor: hex }} />
                <div className="px-3 py-2.5">
                  <p className="text-small font-medium text-ink">{name}</p>
                  <p className="font-mono text-micro uppercase tabular-nums text-muted">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Type scale */}
        <section className="mt-14">
          <h2 className="font-serif text-h3 leading-heading text-ink">{t("type")}</h2>
          <div className="surface-card mt-5 divide-y divide-line/70 rounded-2xl">
            {TYPE_STEPS.map((step) => (
              <div
                key={step.token}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-4"
              >
                <code className="w-16 shrink-0 font-mono text-micro text-muted">{step.token}</code>
                <p className={`text-ink ${step.className}`}>
                  {locale === "ar" ? "مستلزمات مدرسية تنتقل" : "Fournitures transmises"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="mt-14">
          <h2 className="font-serif text-h3 leading-heading text-ink">{t("components")}</h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="surface-card rounded-2xl p-6">
              <p className="font-mono text-micro uppercase tracking-caps text-muted">Button</p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <p className="font-mono text-micro uppercase tracking-caps text-muted">
                Badge & Price
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="brand" caps>
                  Bon état
                </Badge>
                <Badge tone="accent">En vedette</Badge>
                <Badge tone="success">Payé</Badge>
                <Badge tone="danger">Litige</Badge>
                <Badge tone="neutral">Meta</Badge>
              </div>
              <div className="mt-5">
                <Price millimes={85_000} originalMillimes={210_000} locale={intlLocale} />
              </div>
            </div>
          </div>
        </section>

        {/* Brand marks: signature, signed lockup and icon on every surface. */}
        <BrandMarks locale={locale} />

        <p className="mt-10 font-mono text-micro text-muted/70">{t("note")}</p>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
