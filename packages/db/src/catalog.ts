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
 * @file     packages/db/src/catalog.ts
 * @summary  Public catalogue queries: listings, platform stats, storage URLs.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Public catalogue queries.
 *
 * These functions take a Supabase client instead of creating one. That keeps
 * the package framework-agnostic (the web app injects a cookie-scoped SSR
 * client) and makes every query trivially mockable in tests.
 *
 * RULES
 *   - The UI never invents a listing, price or statistic. If a query returns
 *     nothing, the caller renders an empty state.
 *   - Only `public_listings` and the aggregate `platform_stats()` RPC are read
 *     here. Both are safe for anon: the view inherits listings RLS and the RPC
 *     returns counts only.
 *   - Money stays integer millimes end to end. No floats, no division here.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ItemCondition, ListingKind, Millimes, PlatformStats, PublicListing } from "./types";

/** Columns the browse grid needs. Explicit so a schema change is a compile error. */
const LISTING_COLUMNS = [
  "id",
  "title_fr",
  "title_ar",
  "description_fr",
  "description_ar",
  "condition",
  "kind",
  "price_millimes",
  "original_price_millimes",
  "currency",
  "is_donation",
  "status",
  "featured_until",
  "published_at",
  "view_count",
  "created_at",
  "seller_id",
  "seller_name",
  "seller_type",
  "seller_avatar_path",
  "wilaya_code",
  "wilaya_name_fr",
  "wilaya_name_ar",
  "category_slug",
  "category_name_fr",
  "category_name_ar",
  "grade_slug",
  "grade_name_fr",
  "grade_name_ar",
  "cover_path",
  "cover_blurhash",
  "cover_width",
  "cover_height",
].join(", ");

export interface FetchListingsOptions {
  /** Maximum rows; the grid shows six, the browse page will page properly later. */
  limit?: number;
  categorySlug?: string;
}

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNullableString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

const asInt = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
};

const asNullableInt = (value: unknown): number | null =>
  value === null || value === undefined ? null : asInt(value);

const asBoolean = (value: unknown): boolean => value === true || value === "true";

/**
 * Defensive row mapper.
 *
 * PostgREST is untyped here until `supabase gen types` runs, so the boundary is
 * narrowed once, in one place. Unknown enum values fall back to the safest
 * card rendering rather than throwing at render time.
 */
function toPublicListing(row: Record<string, unknown>): PublicListing {
  const condition = asString(row.condition, "good") as ItemCondition;
  const kind = asString(row.kind, "single") as ListingKind;

  return {
    id: asString(row.id),
    title_fr: asString(row.title_fr),
    title_ar: asNullableString(row.title_ar),
    description_fr: asString(row.description_fr),
    description_ar: asNullableString(row.description_ar),
    condition,
    kind,
    price_millimes: asInt(row.price_millimes) as Millimes,
    original_price_millimes: asNullableInt(row.original_price_millimes) as Millimes | null,
    currency: asString(row.currency, "TND"),
    is_donation: asBoolean(row.is_donation),
    status: asString(row.status, "active") as PublicListing["status"],
    featured_until: asNullableString(row.featured_until),
    published_at: asNullableString(row.published_at),
    view_count: asInt(row.view_count),
    created_at: asString(row.created_at),
    seller_id: asString(row.seller_id),
    seller_name: asString(row.seller_name),
    seller_type: asNullableString(row.seller_type) as PublicListing["seller_type"],
    seller_avatar_path: asNullableString(row.seller_avatar_path),
    wilaya_code: asString(row.wilaya_code),
    wilaya_name_fr: asString(row.wilaya_name_fr),
    wilaya_name_ar: asString(row.wilaya_name_ar),
    category_slug: asString(row.category_slug),
    category_name_fr: asString(row.category_name_fr),
    category_name_ar: asString(row.category_name_ar),
    grade_slug: asNullableString(row.grade_slug),
    grade_name_fr: asNullableString(row.grade_name_fr),
    grade_name_ar: asNullableString(row.grade_name_ar),
    cover_path: asNullableString(row.cover_path),
    cover_blurhash: asNullableString(row.cover_blurhash),
    cover_width: asNullableInt(row.cover_width),
    cover_height: asNullableInt(row.cover_height),
  };
}

/**
 * Newest active listings, featured first.
 *
 * `public_listings` already filters deleted rows; the explicit `status` filter
 * documents intent and keeps the query correct if the view is ever widened.
 */
export async function fetchPublicListings(
  supabase: SupabaseClient,
  { limit = 6, categorySlug }: FetchListingsOptions = {},
): Promise<PublicListing[]> {
  let query = supabase.from("public_listings").select(LISTING_COLUMNS).eq("status", "active");

  if (categorySlug) {
    query = query.eq("category_slug", categorySlug);
  }

  const { data, error } = await query
    .order("featured_until", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(Math.min(Math.max(limit, 1), 48));

  if (error) {
    throw new Error(`Could not load listings: ${error.message}`);
  }

  if (!Array.isArray(data)) return [];
  return data.map((row) => toPublicListing(row as unknown as Record<string, unknown>));
}

/** Aggregate counters for the home page. Never contains user-level rows. */
export async function fetchPlatformStats(supabase: SupabaseClient): Promise<PlatformStats> {
  const { data, error } = await supabase.rpc("platform_stats");

  if (error) {
    throw new Error(`Could not load platform statistics: ${error.message}`);
  }

  const row = (Array.isArray(data) ? data[0] : data) as unknown as
    | Record<string, unknown>
    | undefined;
  if (!row) {
    return { active_listings: 0, sold_items: 0, covered_wilayas: 0 };
  }

  return {
    active_listings: asInt(row.active_listings),
    sold_items: asInt(row.sold_items),
    covered_wilayas: asInt(row.covered_wilayas),
  };
}

/** Public URL for a listing photo. Returns null when the listing has no photo. */
export function listingPhotoUrl(supabase: SupabaseClient, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl || null;
}
