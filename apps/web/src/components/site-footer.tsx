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
 * @file     apps/web/src/components/site-footer.tsx
 * @summary  Footer: brand signature, product/company/legal navigation, copyright.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Site footer.
 *
 * The footer is the canonical place for the full lockup (icon + wordmark +
 * tagline) and the EduRelay navigation columns.
 *
 * Personal founder channels (portfolio, social handles, mobile) are deliberately
 * NOT rendered anywhere in the product UI. They live only in the brand config
 * and the generated file headers, which are part of the private source tree,
 * never in HTML sent to a visitor. Public contact is the EduRelay support inbox.
 */

import { brand } from "@edurelay/brand";
import { BrandSignature } from "@edurelay/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const COLUMNS = [
  {
    title: "product",
    links: [
      { label: "browse", href: "/#annonces" },
      { label: "publish", href: "/#vendre" },
      { label: "donate", href: "/#don" },
      { label: "designSystem", href: "/design" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "about", href: "/#comment" },
      { label: "impact", href: "/#don" },
      { label: "contact", href: `mailto:${brand.contacts.supportEmail}` },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "terms", href: "/legal/terms" },
      { label: "privacy", href: "/legal/privacy" },
      { label: "cookies", href: "/legal/cookies" },
      { label: "security", href: "/legal/security" },
      { label: "legalNotice", href: "/legal/notice" },
    ],
  },
] as const;

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const year = new Date().getFullYear();
  const tagline = locale === "ar" ? brand.tagline.ar : brand.tagline.fr;

  return (
    <footer className="relative mt-28 border-t border-line/70 bg-canvas">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-brand/[0.05] to-transparent"
      />

      <div className="relative mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            {/* The composed signature: token-driven, so it reads on the dark
                canvas, and localised, so the tagline is never English-only. */}
            <div className="inline-flex rounded-2xl border border-line/60 bg-surface/40 p-4">
              <BrandSignature size="md" tagline={tagline} />
            </div>
            <p className="mt-5 max-w-[36ch] text-small leading-body text-muted">{t("tagline")}</p>
            <p className="mt-4 font-mono text-micro uppercase tracking-caps text-muted/70">
              {t("madeIn")}
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-caps text-ink/70">
                {t(column.title)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-small text-muted transition-colors duration-200 hover:text-brand-dark"
                    >
                      {link.label === "designSystem" ? t("designSystem") : t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line/70 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-micro text-muted">
            © {year} {brand.legal.entityName} — {t("rights")}
          </p>
          <p className="max-w-[54ch] text-micro text-muted/70">{t("privateRepo")}</p>
        </div>
      </div>
    </footer>
  );
}
