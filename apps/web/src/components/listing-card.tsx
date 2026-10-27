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
 * @file     apps/web/src/components/listing-card.tsx
 * @summary  Database-backed listing card for the home grid.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Listing card.
 *
 * Every value rendered here originates in Postgres (title, price, condition,
 * seller, wilaya, grade, photo). The component only localises and formats it.
 * When a listing has no photo the token-drawn cover is used as a placeholder,
 * never as fake content.
 *
 * The entrance is staggered by index and lifts on hover; both effects are
 * disabled by the global reduced-motion reset.
 */

import { Badge, cn, Price } from "@edurelay/ui";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { HomeListing } from "@/lib/home";
import { Heart, Sparkle } from "./icons";
import { ListingCover } from "./listing-cover";

interface ListingCardProps {
  listing: HomeListing;
  locale: string;
  index?: number;
  /** The lead card in a grid: full width and horizontal from `lg` up. */
  feature?: boolean;
}

export async function ListingCard({
  listing,
  locale,
  index = 0,
  feature = false,
}: ListingCardProps) {
  const t = await getTranslations({ locale });
  const intlLocale = locale === "ar" ? "ar-TN" : "fr-TN";
  const titleId = `listing-${listing.id}-title`;
  const coverVariant = (index % 3) as 0 | 1 | 2;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group card-lift animate-fade-up stagger-item relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line/90 bg-surface/50 backdrop-blur-sm",
        feature &&
          "sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
      )}
      style={{ "--stagger": index } as CSSProperties}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          feature ? "aspect-[16/10] lg:aspect-auto lg:min-h-[21rem]" : "aspect-[4/3]",
        )}
      >
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={listing.title}
            fill
            sizes={feature ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 p-4">
            <ListingCover variant={coverVariant} />
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/75 via-canvas/5 to-transparent"
        />

        <Badge
          tone="neutral"
          className="absolute start-3 top-3 z-10 border-line/70 bg-canvas/70 text-ink/80"
        >
          {t(`Listings.${listing.kind}`)}
        </Badge>

        {listing.grade ? (
          <span className="absolute end-3 top-3 z-10 rounded-full border border-brand/25 bg-canvas/70 px-2.5 py-1 font-mono text-micro text-brand backdrop-blur-md">
            {listing.grade}
          </span>
        ) : null}

        {listing.isFeatured ? (
          <Badge tone="accent" className="absolute bottom-3 start-3 z-10">
            <Sparkle className="size-3" />
            {t("Listings.featured")}
          </Badge>
        ) : null}

        {listing.isDonation ? (
          <span className="absolute bottom-3 end-3 z-10 inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/15 px-2.5 py-1 text-micro font-medium text-brand-dark backdrop-blur-md">
            <Heart className="size-3" />
            {t("Listings.donation")}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5",
          feature && "justify-center gap-4 p-6 lg:p-10",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand" caps>
            {t(`Conditions.${listing.condition}`)}
          </Badge>
          <span className="font-mono text-micro uppercase tracking-caps text-muted/70">
            {listing.category}
          </span>
        </div>

        <h3
          id={titleId}
          className={cn(
            "text-ink",
            feature
              ? "font-serif text-h2 leading-heading tracking-heading"
              : "text-h4 font-semibold leading-snug",
          )}
        >
          {listing.title}
        </h3>

        <p className="text-micro text-muted">
          {listing.seller} · {listing.wilaya}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line/70 pt-4">
          {listing.isDonation ? (
            <span className="inline-flex items-center gap-1.5 font-serif text-h4 text-brand-dark">
              <Heart className="size-4 text-brand" />
              {t("Listings.free")}
            </span>
          ) : (
            <Price
              millimes={listing.millimes}
              originalMillimes={listing.originalMillimes ?? undefined}
              locale={intlLocale}
              size={feature ? "md" : "sm"}
            />
          )}
        </div>
      </div>
    </article>
  );
}
