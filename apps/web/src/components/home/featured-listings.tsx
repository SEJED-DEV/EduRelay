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
 * @file     apps/web/src/components/home/featured-listings.tsx
 * @summary  Streamed listing grid with honest empty and unavailable states.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Featured listings section body.
 *
 * Suspended independently of the hero so the page paints immediately while the
 * catalogue query runs. No demo rows exist anywhere in this component: three
 * states, three honest UI outcomes.
 */

import { buttonStyles } from "@edurelay/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { loadFeaturedListings } from "@/lib/home";
import { ArrowEnd, Sparkle } from "../icons";
import { ListingCard } from "../listing-card";

export async function FeaturedListings({ locale }: { locale: string }) {
  const [{ listings, state }, t] = await Promise.all([
    loadFeaturedListings(locale),
    getTranslations({ locale }),
  ]);

  if (state === "ok") {
    return (
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, index) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            locale={locale}
            index={index}
            feature={index === 0}
          />
        ))}
      </div>
    );
  }

  const unavailable = state === "unavailable";

  return (
    <div className="animate-fade-in surface-card mt-12 flex flex-col items-center rounded-[1.6rem] border-dashed px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full border border-brand/25 bg-brand/10 text-brand">
        <Sparkle className="size-5" />
      </span>
      <h3 className="mt-5 font-serif text-h3 leading-heading text-ink">
        {t(unavailable ? "Listings.unavailableTitle" : "Listings.emptyTitle")}
      </h3>
      <p className="mx-auto mt-2 max-w-[46ch] text-small leading-body text-muted">
        {t(unavailable ? "Listings.unavailableBody" : "Listings.emptyBody")}
      </p>
      <Link href="/#vendre" className={buttonStyles({ size: "md", className: "mt-7" })}>
        {t("Listings.emptyCta")}
        <ArrowEnd className="size-4 rtl:-scale-x-100" />
      </Link>
    </div>
  );
}
