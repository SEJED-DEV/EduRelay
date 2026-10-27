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
 * @file     apps/web/src/lib/home.ts
 * @summary  Home-page data loaders: listings and platform statistics.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Home-page data loaders.
 *
 * The page is a Server Component and every figure on it comes from Postgres.
 * This module localises the columns the database actually stores and maps the
 * result to a view model the card component can render without knowing about
 * Supabase.
 *
 * A missing database is a normal state, not a crash: `state: "unavailable"`
 * lets the UI say "catalogue coming soon" instead of inventing demo listings.
 */

import "server-only";

import {
  fetchPlatformStats,
  fetchPublicListings,
  type ItemCondition,
  type ListingKind,
  listingPhotoUrl,
  type PlatformStats,
} from "@edurelay/db";
import { getServerSupabase } from "./supabase";

export interface HomeListing {
  id: string;
  title: string;
  grade: string | null;
  seller: string;
  wilaya: string;
  category: string;
  condition: ItemCondition;
  kind: ListingKind;
  millimes: number;
  originalMillimes: number | null;
  isDonation: boolean;
  isFeatured: boolean;
  photoUrl: string | null;
  blurhash: string | null;
  width: number | null;
  height: number | null;
}

export type DataState = "ok" | "empty" | "unavailable";

export interface ListingsResult {
  listings: HomeListing[];
  state: DataState;
}

export interface StatsResult {
  stats: PlatformStats | null;
  state: DataState;
}

const isArabic = (locale: string) => locale === "ar";

export async function loadFeaturedListings(locale: string, limit = 6): Promise<ListingsResult> {
  const supabase = await getServerSupabase();
  if (!supabase) return { listings: [], state: "unavailable" };

  try {
    const rows = await fetchPublicListings(supabase, { limit });

    const listings = rows.map<HomeListing>((row) => {
      const wilaya = isArabic(locale) ? row.wilaya_name_ar : row.wilaya_name_fr;
      const grade = isArabic(locale) ? row.grade_name_ar : row.grade_name_fr;
      const category = isArabic(locale) ? row.category_name_ar : row.category_name_fr;

      return {
        id: row.id,
        title: (isArabic(locale) ? row.title_ar : row.title_fr) ?? row.title_fr,
        grade,
        seller: row.seller_name,
        wilaya,
        category,
        condition: row.condition,
        kind: row.kind,
        millimes: row.price_millimes,
        originalMillimes: row.original_price_millimes,
        isDonation: row.is_donation,
        isFeatured: row.featured_until
          ? new Date(row.featured_until).getTime() > Date.now()
          : false,
        photoUrl: listingPhotoUrl(supabase, row.cover_path),
        blurhash: row.cover_blurhash,
        width: row.cover_width,
        height: row.cover_height,
      };
    });

    return {
      listings,
      state: listings.length > 0 ? "ok" : "empty",
    };
  } catch (error) {
    console.error("[edurelay] Failed to load featured listings.", error);
    return { listings: [], state: "unavailable" };
  }
}

export async function loadPlatformStats(): Promise<StatsResult> {
  const supabase = await getServerSupabase();
  if (!supabase) return { stats: null, state: "unavailable" };

  try {
    const stats = await fetchPlatformStats(supabase);
    return { stats, state: "ok" };
  } catch (error) {
    console.error("[edurelay] Failed to load platform statistics.", error);
    return { stats: null, state: "unavailable" };
  }
}
