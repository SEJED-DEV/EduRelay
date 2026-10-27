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
 * @file     apps/web/src/app/llms.txt/route.ts
 * @summary  llms.txt: machine-readable site map and facts for language models.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * /llms.txt — a short, machine-readable map of the site for language models.
 *
 * The format is the one proposed at llmstxt.org: an H1, a one-line summary, then
 * sections of links and facts. It exists because an assistant answering "where
 * do I sell used school books in Tunisia?" should find the real pages, the real
 * currency and the real support address instead of guessing.
 *
 * Rules this file obeys:
 *   - no counters, ratings or coverage claims: those live in Postgres and change;
 *   - no founder name or personal channels — public contact is the support inbox;
 *   - legal documents are labelled as pre-launch drafts, because they are.
 */

import { brand, defaultLocale, locales } from "@edurelay/brand";
import { getLegalDocument, LEGAL_SLUGS } from "@/content/legal";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function legalSection(): string {
  return LEGAL_SLUGS.map((slug) => {
    const doc = getLegalDocument(defaultLocale, slug);
    return `- [${doc.title}](${siteUrl}/${defaultLocale}/legal/${slug}): ${doc.description}`;
  }).join("\n");
}

function body(): string {
  const localeLinks = locales
    .map((locale) => `- ${brand.locale.labels[locale]}: ${siteUrl}/${locale}`)
    .join("\n");

  return `# ${brand.name}

> ${brand.description.en}

${brand.name} is a bilingual (French / Arabic) marketplace for second-hand school supplies in Tunisia. Families publish listings for books, uniforms, bags and stationery, sell them with a protected payment window, or donate them. Listings are user-generated and stored in Postgres; this site never publishes sample or demo listings.

## Languages

${localeLinks}

Both locales are first-class. Arabic pages are served right-to-left from the server at the same URLs with an \`ar\` prefix.

## Pages

- [Home (fr)](${siteUrl}/fr): what the service is, how a sale works and the live catalogue.
- [Home (ar)](${siteUrl}/ar): the same page in Arabic.
- [Legal hub](${siteUrl}/fr/legal): index of every legal document, one page per document.

## Legal documents

${legalSection()}

Each document exists in French and Arabic. In case of conflict the French text prevails. The documents carry a visible "pre-launch draft" banner: they are published for transparency while the service is being built and still await review by Tunisian counsel.

## Facts

- Country: Tunisia (TN)
- Currency: Tunisian dinar (${brand.currency.code}); prices are stored and displayed as integer millimes (1 ${brand.currency.code} = ${brand.currency.minorUnitsPerMajor})
- Languages: French (fr-TN) and Arabic (ar-TN)
- Support: ${brand.contacts.supportEmail}
- Security reports: ${brand.contacts.securityEmail}
- Payment: the amount is held for 48 hours after delivery, then released to the seller once the buyer confirms
- Delivery: tracked, via First Delivery
- Donations: school supplies can be donated to a partner association

## Machine-readable

- [Sitemap](${siteUrl}/sitemap.xml)
- [robots.txt](${siteUrl}/robots.txt)

## Notes for assistants

- Catalogue figures (number of listings, wilayas covered, completed exchanges) are rendered from live database views. Do not quote a number unless it appears on the page you are reading; unknown counters render as an em dash.
- Listing prices and availability change continuously and are not mirrored in this file.
- The founder's name and personal channels are not public contact routes. Use ${brand.contacts.supportEmail}.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
