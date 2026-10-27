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
 * @file     apps/web/src/app/[locale]/layout.tsx
 * @summary  Locale-aware root layout: fonts, dir/lang, metadata.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Locale-aware root layout.
 *
 * This is the only <html> in the app: the [locale] segment owns lang/dir so the
 * first byte of HTML already has the correct direction (no FOUC flip for Arabic).
 *
 * Fonts are loaded with next/font, which self-hosts them at build time and
 * auto-generates a size-adjust fallback face from the font metrics — that is the
 * CLS defence, and it also means no third-party request at runtime.
 */

import { brand, directionOf } from "@edurelay/brand";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { fontVariables } from "@/fonts";
import { toClientMessages } from "@/i18n/messages";
import { routing } from "@/i18n/routing";
import { alternates, openGraphAlternateLocale, openGraphLocale } from "@/lib/seo";
import { graph, organizationSchema, websiteSchema } from "@/lib/structured-data";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(brand.siteUrl),
    title: { default: t("title"), template: `%s · ${brand.name}` },
    description: t("description"),
    applicationName: brand.name,
    category: "shopping",
    alternates: alternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: t("title"),
      description: t("description"),
      locale: openGraphLocale(locale),
      alternateLocale: openGraphAlternateLocale(locale),
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    icons: { icon: "/brand/edu-relay-icon.svg", apple: "/brand/edu-relay-icon.svg" },
    // The product is Tunisian and sells in dinars; say so in the head as well as
    // in structured data, without pretending to a street address we do not publish.
    other: { "geo.region": "TN", "geo.placename": "Tunisie" },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The product is dark by design, so the browser chrome must match the canvas
  // rather than the visitor's OS preference.
  colorScheme: "dark",
  themeColor: brand.darkColors.canvas,
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for every page below this segment.
  setRequestLocale(locale);
  const messages = toClientMessages(await getMessages());

  return (
    <html lang={locale} dir={directionOf(locale)} data-theme="dark" className={fontVariables}>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        {/* One Organization + one WebSite per locale, with stable @ids so search
            engines merge them across pages instead of seeing duplicates. */}
        <JsonLd data={graph([organizationSchema(), websiteSchema(locale)])} />
      </body>
    </html>
  );
}
