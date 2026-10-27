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
 * @file     apps/web/src/lib/structured-data.ts
 * @summary  Schema.org builders: Organization, WebSite, breadcrumbs, FAQ.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Structured data.
 *
 * Builders, not literals, so every page emits the same `@id`s and search engines
 * merge one Organization / WebSite entity instead of dozens of near-duplicates.
 * Only facts that exist in `brand.config.json` or in the visible copy are
 * emitted — no address, founding date, ratings or founder profile, because
 * inventing them would be a lie in machine-readable form.
 */

import { brand } from "@edurelay/brand";
import { languageTag, siteUrl } from "./seo";

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

/** Localised one-line description of the service. */
export function brandDescription(locale: string): string {
  return locale === "ar" ? brand.description.ar : brand.description.fr;
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: brand.name,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/edu-relay-logo.svg`,
    },
    description: brand.description.en,
    email: brand.contacts.supportEmail,
    // The marketplace is Tunisian; nothing narrower is claimed here because
    // live coverage is measured by `platform_stats()`, not by a static list.
    areaServed: {
      "@type": "Country",
      name: "Tunisie",
      identifier: "TN",
    },
    knowsLanguage: ["fr-TN", "ar-TN"],
    currenciesAccepted: brand.currency.code,
  };
}

export function websiteSchema(locale: string) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: brand.name,
    url: `${siteUrl}/${locale}`,
    inLanguage: languageTag(locale),
    description: brandDescription(locale),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

export interface Question {
  question: string;
  answer: string;
}

export function faqSchema(questions: Question[]) {
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Wrap any number of node builders into one `@graph` document. */
export function graph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
