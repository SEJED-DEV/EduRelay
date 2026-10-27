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
 * @file     apps/web/src/components/site-header.tsx
 * @summary  Sticky header: brand, navigation, locale switcher.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Site header.
 *
 * The wordmark here is HTML text, not the SVG lockup: navigation chrome should
 * survive text zoom, be selectable, and read as a link to screen readers. The
 * SVG lockup is reserved for the hero and footer (see docs/brand.md).
 */

import { brand } from "@edurelay/brand";
import { BrandIcon, buttonStyles, Wordmark } from "@edurelay/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

const NAV_ITEMS = [
  { key: "browse", href: "/#annonces" },
  { key: "howItWorks", href: "/#comment" },
  { key: "donate", href: "/#don" },
] as const;

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-canvas/70 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-on-brand"
      >
        {brand.name}
      </a>

      <div className="relative mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href="/"
          aria-label={brand.name}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <BrandIcon size={30} decorative />
          <Wordmark size="sm" />
        </Link>

        <nav aria-label="EduRelay" className="ms-10 hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative text-small text-muted transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand/70 after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 rtl:after:origin-right"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <LocaleSwitcher locale={locale} />
          <Link
            href="/login"
            className="rounded-full px-2.5 py-1.5 text-small text-muted transition-colors duration-200 hover:text-ink"
          >
            {t("login")}
          </Link>
          <Link
            href="/#vendre"
            className={buttonStyles({ size: "sm", className: "hidden sm:inline-flex" })}
          >
            {t("publish")}
          </Link>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
        />
      </div>
    </header>
  );
}
