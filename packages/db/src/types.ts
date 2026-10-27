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
 * @file     packages/db/src/types.ts
 * @summary  Hand-maintained database types until `supabase gen types` runs.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Domain types shared by app code.
 *
 * These unions MUST match the Postgres enums in
 * `supabase/migrations/20261026120000_init.sql`. When you add a value to an
 * enum, add it here in the same commit — there is a comment in both places
 * pointing at this file.
 *
 * Database row types are generated, not hand-written:
 *   pnpm supabase gen types typescript --local > packages/db/src/database.types.ts
 *
 * Money is ALWAYS integer millimes (1 TND = 1000 millimes). See docs/architecture.md.
 */

/** Integer millimes. The branded alias exists to catch `price: 12.5` mistakes. */
export type Millimes = number & { readonly __millimes: unique symbol };

/** Helper for fixtures and tests; never used on real input. */
export const asMillimes = (value: number): Millimes => value as Millimes;

export type AppRole = "buyer" | "seller" | "admin";
export type SellerType = "family" | "library" | "bookstore" | "school" | "ngo";
export type ListingKind = "single" | "bundle";
export type ItemCondition = "new" | "like_new" | "good" | "fair" | "for_parts";

export type ListingStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "reserved"
  | "sold"
  | "donated"
  | "withdrawn"
  | "removed_by_admin";

export type OrderStatus =
  | "pending_payment"
  | "paid_held"
  | "awaiting_shipment"
  | "shipped"
  | "delivered"
  | "buyer_confirmed"
  | "released"
  | "disputed"
  | "refunded"
  | "cancelled"
  | "expired";

export type PaymentMethod = "online" | "cod";
export type PaymentProvider = "konnect" | "paymee" | "manual_cod";
export type PaymentStatus =
  | "initiated"
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type DeliveryStatus =
  | "pending"
  | "quoted"
  | "booked"
  | "pickup_scheduled"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

export type DonationStatus =
  | "offered"
  | "accepted"
  | "matched"
  | "scheduled"
  | "delivered"
  | "closed"
  | "rejected";

export type DisputeStatus =
  | "open"
  | "awaiting_seller"
  | "awaiting_buyer"
  | "resolved_buyer"
  | "resolved_seller"
  | "escalated"
  | "closed";

export type PayoutStatus =
  | "requested"
  | "approved"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled";

/** Shape returned by the `public_listings` read model, used by browse grids. */
export interface PublicListing {
  id: string;
  title_fr: string;
  title_ar: string | null;
  description_fr: string;
  description_ar: string | null;
  condition: ItemCondition;
  kind: ListingKind;
  price_millimes: Millimes;
  original_price_millimes: Millimes | null;
  currency: string;
  is_donation: boolean;
  status: ListingStatus;
  featured_until: string | null;
  published_at: string | null;
  view_count: number;
  created_at: string;
  seller_id: string;
  seller_name: string;
  seller_type: SellerType | null;
  seller_avatar_path: string | null;
  wilaya_code: string;
  wilaya_name_fr: string;
  wilaya_name_ar: string;
  category_slug: string;
  category_name_fr: string;
  category_name_ar: string;
  grade_slug: string | null;
  grade_name_fr: string | null;
  grade_name_ar: string | null;
  cover_path: string | null;
  cover_blurhash: string | null;
  cover_width: number | null;
  cover_height: number | null;
}

/**
 * Aggregate counters exposed by `public.platform_stats()`.
 * Deliberately anonymous: counts only, never a user-identifying row.
 */
export interface PlatformStats {
  active_listings: number;
  sold_items: number;
  covered_wilayas: number;
}

/** Minimal order projection used by the buyer/seller dashboards. */
export interface OrderSummary {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total_millimes: Millimes;
  placed_at: string;
  confirm_deadline_at: string | null;
  released_at: string | null;
}
