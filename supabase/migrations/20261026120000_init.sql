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
 * @file     supabase/migrations/20261026120000_init.sql
 * @summary  Core schema: enums, tables, indexes, state machine, triggers.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

-- =============================================================================
--  EduRelay — core schema
--  Money is stored as integer MILLIMES (1 TND = 1000 millimes) everywhere.
--  See docs/architecture.md for the reasoning and docs/ops.md for the flows.
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create schema if not exists app;
comment on schema app is 'Internal helpers for EduRelay. Not exposed through the API.';

-- -----------------------------------------------------------------------------
-- Search normalisation
-- -----------------------------------------------------------------------------
-- One function used by both the generated search text and the tsvector, so the
-- two can never drift. Immutable (required for generated columns): it only uses
-- lower/translate/regexp_replace with constant arguments.
--
-- Folds Latin accents, Arabic alef variants (أ إ آ ٱ), taa marbuta (ة -> ه) and
-- alef maqsura (ى -> ي), and strips Arabic diacritics. This is deliberately
-- lossy: buyers type "calculatrice" and "الة حاسبة" without diacritics.
create or replace function app.fn_search_normalize(input text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select btrim(
    regexp_replace(
      translate(
        translate(
          lower(coalesce(input, '')),
          'àâäáãåéèêëíìîïóòôöõúùûüçñÿ',
          'aaaaaaeeeeiiiioooooouuuucny'
        ),
        'أإآٱةى',
        'ااااهي'
      ),
      '[' || U&'\064B-\0652' || ']',
      '',
      'g'
    )
  );
$$;

-- -----------------------------------------------------------------------------
-- Authorisation helper
-- SECURITY DEFINER so a policy on `profiles` can call it without recursing into
-- its own RLS. Returns false for anonymous and service-role callers (a service
-- role is already privileged and does not need this check).
-- -----------------------------------------------------------------------------
create or replace function app.current_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
      and p.deleted_at is null
  );
$$;

-- -----------------------------------------------------------------------------
-- Enumerations
-- KEEP IN SYNC with packages/db/src/types.ts.
-- -----------------------------------------------------------------------------
create type public.app_role as enum ('buyer', 'seller', 'admin');
create type public.seller_type as enum ('family', 'library', 'bookstore', 'school', 'ngo');
create type public.listing_kind as enum ('single', 'bundle');
create type public.item_condition as enum ('new', 'like_new', 'good', 'fair', 'for_parts');

create type public.listing_status as enum (
  'draft', 'pending_review', 'active', 'reserved', 'sold', 'donated', 'withdrawn', 'removed_by_admin'
);

create type public.order_status as enum (
  'pending_payment', 'paid_held', 'awaiting_shipment', 'shipped', 'delivered',
  'buyer_confirmed', 'released', 'disputed', 'refunded', 'cancelled', 'expired'
);

create type public.payment_method as enum ('online', 'cod');
create type public.payment_provider as enum ('konnect', 'paymee', 'manual_cod');
create type public.payment_status as enum (
  'initiated', 'pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded', 'partially_refunded'
);

create type public.delivery_status as enum (
  'pending', 'quoted', 'booked', 'pickup_scheduled', 'in_transit',
  'out_for_delivery', 'delivered', 'failed', 'returned'
);

create type public.donation_status as enum (
  'offered', 'accepted', 'matched', 'scheduled', 'delivered', 'closed', 'rejected'
);

create type public.dispute_status as enum (
  'open', 'awaiting_seller', 'awaiting_buyer', 'resolved_buyer', 'resolved_seller', 'escalated', 'closed'
);

create type public.payout_status as enum ('requested', 'approved', 'processing', 'paid', 'failed', 'cancelled');

create type public.notification_channel as enum ('sms', 'email', 'push');

-- -----------------------------------------------------------------------------
-- Reference data
-- -----------------------------------------------------------------------------
create table public.wilayas (
  id smallint primary key,
  code text not null unique,
  name_fr text not null,
  name_ar text not null,
  is_covered boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.grade_levels (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name_fr text not null,
  name_ar text not null,
  cycle text not null check (cycle in ('primary', 'middle', 'secondary', 'bac')),
  sort_order smallint not null default 0
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_fr text not null,
  name_ar text not null,
  parent_id uuid references public.categories (id) on delete restrict,
  sort_order smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.delivery_providers (
  id smallint generated always as identity primary key,
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  supports_api boolean not null default false,
  supports_cod boolean not null default false,
  coverage_wilayas smallint[] not null default '{}',
  created_at timestamptz not null default now()
);

-- The order state machine as data, not as application code. A missing row means
-- the transition is illegal; the trigger below enforces it for every writer,
-- including the service role.
create table public.order_status_transitions (
  from_status public.order_status not null,
  to_status public.order_status not null,
  primary key (from_status, to_status)
);

-- -----------------------------------------------------------------------------
-- Identity
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'buyer',
  seller_type public.seller_type,
  display_name text not null check (char_length(display_name) between 2 and 60),
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  phone_verified_at timestamptz,
  wilaya_id smallint references public.wilayas (id),
  school_name text,
  avatar_path text,
  locale text not null default 'fr' check (locale in ('fr', 'ar')),
  bio text check (bio is null or char_length(bio) <= 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index profiles_wilaya_idx on public.profiles (wilaya_id) where deleted_at is null;

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Domicile',
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  wilaya_id smallint not null references public.wilayas (id),
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index addresses_owner_idx on public.addresses (owner_id) where deleted_at is null;
create unique index addresses_one_default_idx
  on public.addresses (owner_id)
  where is_default and deleted_at is null;

-- -----------------------------------------------------------------------------
-- Listings
-- -----------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete restrict,
  title_fr text not null check (char_length(title_fr) between 3 and 120),
  title_ar text check (title_ar is null or char_length(title_ar) between 3 and 120),
  description_fr text not null check (char_length(description_fr) between 10 and 4000),
  description_ar text check (description_ar is null or char_length(description_ar) <= 4000),
  category_id uuid not null references public.categories (id) on delete restrict,
  grade_level_id smallint references public.grade_levels (id) on delete set null,
  condition public.item_condition not null,
  kind public.listing_kind not null default 'single',
  price_millimes bigint not null check (price_millimes >= 0),
  original_price_millimes bigint check (
    original_price_millimes is null or original_price_millimes >= price_millimes
  ),
  currency char(3) not null default 'TND',
  is_donation boolean not null default false,
  wilaya_id smallint not null references public.wilayas (id),
  status public.listing_status not null default 'draft',
  featured_until timestamptz,
  published_at timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  moderation_note text,
  moderated_by uuid references public.profiles (id) on delete set null,
  -- Generated once, indexed twice (trigram for fuzzy, tsvector for ranked).
  search_text text generated always as (
    app.fn_search_normalize(
      coalesce(title_fr, '') || ' ' || coalesce(title_ar, '') || ' ' ||
      coalesce(description_fr, '') || ' ' || coalesce(description_ar, '')
    )
  ) stored,
  search_tsv tsvector generated always as (
    to_tsvector(
      'simple',
      app.fn_search_normalize(
        coalesce(title_fr, '') || ' ' || coalesce(title_ar, '') || ' ' ||
        coalesce(description_fr, '') || ' ' || coalesce(description_ar, '')
      )
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index listings_browse_idx
  on public.listings (wilaya_id, category_id, grade_level_id, price_millimes)
  where status = 'active' and deleted_at is null;

create index listings_seller_idx on public.listings (seller_id, status) where deleted_at is null;
create index listings_featured_idx on public.listings (featured_until) where featured_until is not null;
create index listings_search_tsv_idx on public.listings using gin (search_tsv);
create index listings_search_trgm_idx on public.listings using gin (search_text extensions.gin_trgm_ops);

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  position smallint not null default 0 check (position between 0 and 4),
  width integer,
  height integer,
  blurhash text,
  created_at timestamptz not null default now(),
  unique (listing_id, position)
);

create index listing_photos_listing_idx on public.listing_photos (listing_id, position);

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
create sequence public.order_number_seq;

create or replace function app.fn_next_order_number()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'ER' || to_char(now(), 'YYMM') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
$$;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default app.fn_next_order_number(),
  buyer_id uuid not null references public.profiles (id) on delete restrict,
  seller_id uuid not null references public.profiles (id) on delete restrict,
  status public.order_status not null default 'pending_payment',
  payment_method public.payment_method not null default 'online',
  currency char(3) not null default 'TND',
  subtotal_millimes bigint not null check (subtotal_millimes >= 0),
  delivery_fee_millimes bigint not null default 0 check (delivery_fee_millimes >= 0),
  service_fee_millimes bigint not null default 0 check (service_fee_millimes >= 0),
  commission_millimes bigint not null default 0 check (commission_millimes >= 0),
  total_millimes bigint not null check (total_millimes >= 0),
  shipping_address_id uuid references public.addresses (id) on delete set null,
  delivery_quote_ref text,
  placed_at timestamptz not null default now(),
  paid_at timestamptz,
  delivered_at timestamptz,
  confirm_deadline_at timestamptz,
  released_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_matches check (
    total_millimes = subtotal_millimes + delivery_fee_millimes + service_fee_millimes
  ),
  constraint orders_buyer_is_not_seller check (buyer_id <> seller_id)
);

create index orders_buyer_idx on public.orders (buyer_id, placed_at desc);
create index orders_seller_idx on public.orders (seller_id, placed_at desc);
create index orders_due_release_idx on public.orders (confirm_deadline_at) where status = 'delivered';

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete restrict,
  title_snapshot text not null,
  unit_price_millimes bigint not null check (unit_price_millimes >= 0),
  quantity smallint not null default 1 check (quantity > 0),
  -- Basis points: 1000 = 10 %. Snapshot the rate so a later pricing change
  -- never rewrites the history of an old order.
  commission_rate_bp smallint not null check (commission_rate_bp between 0 and 5000),
  commission_millimes bigint not null check (commission_millimes >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_listing_idx on public.order_items (listing_id);

-- -----------------------------------------------------------------------------
-- Payments (service-role only: no client ever reads these rows)
-- -----------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider public.payment_provider not null,
  provider_ref text,
  amount_millimes bigint not null check (amount_millimes >= 0),
  status public.payment_status not null default 'initiated',
  failure_reason text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref)
);

create index payments_order_idx on public.payments (order_id);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null,
  -- Idempotency key from the gateway. Webhooks are retried, so this unique
  -- constraint is what stops a duplicate capture from double-crediting an order.
  provider_event_id text not null,
  payment_id uuid references public.payments (id) on delete set null,
  event_type text not null,
  payload jsonb not null,
  signature_verified boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

-- -----------------------------------------------------------------------------
-- Delivery
-- -----------------------------------------------------------------------------
create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider_id smallint not null references public.delivery_providers (id),
  tracking_ref text,
  status public.delivery_status not null default 'pending',
  quote_ref text,
  quoted_fee_millimes bigint check (quoted_fee_millimes >= 0),
  -- COD: cash the courier collects from the buyer and owes back to EduRelay.
  cod_amount_millimes bigint not null default 0 check (cod_amount_millimes >= 0),
  cod_remitted_at timestamptz,
  pickup_at timestamptz,
  delivered_at timestamptz,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index deliveries_tracking_idx
  on public.deliveries (provider_id, tracking_ref)
  where tracking_ref is not null;
create index deliveries_order_idx on public.deliveries (order_id);
create index deliveries_open_idx on public.deliveries (status) where status not in ('delivered', 'returned');

create table public.delivery_events (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries (id) on delete cascade,
  provider_event_id text,
  status public.delivery_status not null,
  payload jsonb not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);

create unique index delivery_events_idempotency_idx
  on public.delivery_events (delivery_id, provider_event_id)
  where provider_event_id is not null;

-- -----------------------------------------------------------------------------
-- Donations
-- -----------------------------------------------------------------------------
create table public.partner_orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('ngo', 'school', 'municipality')),
  contact_email text,
  contact_phone text,
  wilaya_id smallint references public.wilayas (id),
  mou_signed_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.donation_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.listings (id) on delete cascade,
  donor_id uuid not null references public.profiles (id) on delete restrict,
  status public.donation_status not null default 'offered',
  partner_org_id uuid references public.partner_orgs (id) on delete set null,
  -- When shipping is paid through the platform, the donation rides on an order
  -- so the courier and payment ledgers stay single-sourced.
  order_id uuid references public.orders (id) on delete set null,
  shipping_paid_by text not null default 'platform'
    check (shipping_paid_by in ('platform', 'donor', 'partner')),
  scheduled_for timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index donation_requests_status_idx on public.donation_requests (status, created_at);
create index donation_requests_org_idx on public.donation_requests (partner_org_id);

-- -----------------------------------------------------------------------------
-- Disputes, refunds, payouts
-- -----------------------------------------------------------------------------
create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  opened_by uuid not null references public.profiles (id) on delete restrict,
  status public.dispute_status not null default 'open',
  reason_code text not null check (reason_code in (
    'not_received', 'not_as_described', 'damaged', 'wrong_item', 'other'
  )),
  description text not null check (char_length(description) between 10 and 2000),
  resolution text,
  assigned_admin uuid references public.profiles (id) on delete set null,
  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique (order_id)
);

create table public.dispute_messages (
  id uuid primary key default gen_random_uuid(),
  dispute_id uuid not null references public.disputes (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  body text not null check (char_length(body) between 1 and 2000),
  attachments text[] not null default '{}',
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index dispute_messages_dispute_idx on public.dispute_messages (dispute_id, created_at);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  payment_id uuid references public.payments (id) on delete set null,
  amount_millimes bigint not null check (amount_millimes > 0),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'succeeded', 'failed')),
  provider_ref text,
  created_by uuid references public.profiles (id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.seller_payout_accounts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  method text not null check (method in ('bank_transfer', 'd17', 'cash_pickup')),
  holder_name text not null,
  bank_name text,
  -- Store only the last 4 digits in clear. The full RIB/IBAN belongs in an
  -- encrypted vault, not in a queryable column.
  account_last4 text check (account_last4 is null or account_last4 ~ '^[0-9]{4}$'),
  is_verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (seller_id, method)
);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete restrict,
  order_id uuid references public.orders (id) on delete set null,
  amount_millimes bigint not null check (amount_millimes > 0),
  status public.payout_status not null default 'requested',
  requested_at timestamptz not null default now(),
  approved_by uuid references public.profiles (id) on delete set null,
  paid_at timestamptz,
  transfer_ref text,
  failure_reason text
);

create index payouts_seller_idx on public.payouts (seller_id, requested_at desc);
create index payouts_open_idx on public.payouts (status) where status in ('requested', 'approved', 'processing');

-- -----------------------------------------------------------------------------
-- Trust & safety, notifications, audit
-- -----------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete cascade,
  reported_user_id uuid references public.profiles (id) on delete cascade,
  reason text not null check (reason in (
    'prohibited_item', 'counterfeit', 'misleading', 'harassment', 'spam', 'other'
  )),
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'actioned', 'dismissed')),
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reports_has_target check (listing_id is not null or reported_user_id is not null)
);

create index reports_open_idx on public.reports (status, created_at) where status in ('open', 'reviewing');

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel public.notification_channel not null,
  template text not null,
  payload jsonb not null default '{}',
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped')),
  provider_ref text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_queue_idx on public.notifications (status) where status = 'queued';

create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index admin_actions_entity_idx on public.admin_actions (entity_type, entity_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Shared trigger: updated_at
-- -----------------------------------------------------------------------------
create or replace function app.fn_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  target text;
begin
  foreach target in array array[
    'profiles', 'addresses', 'listings', 'orders', 'payments', 'deliveries',
    'donation_requests', 'disputes'
  ]
  loop
    execute format('drop trigger if exists trg_%1$s_touch on public.%1$s', target);
    execute format(
      'create trigger trg_%1$s_touch before update on public.%1$s
       for each row execute function app.fn_touch_updated_at()',
      target
    );
  end loop;
end;
$$;

-- -----------------------------------------------------------------------------
-- Order state machine + side effects
-- -----------------------------------------------------------------------------
create or replace function app.fn_orders_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status <> old.status then
    if old.status in ('released', 'refunded', 'cancelled', 'expired') then
      raise exception 'order % is final and cannot move from %', new.id, old.status
        using errcode = '23514';
    end if;

    if not exists (
      select 1
      from public.order_status_transitions t
      where t.from_status = old.status and t.to_status = new.status
    ) then
      raise exception 'illegal order transition % -> %', old.status, new.status
        using errcode = '23514';
    end if;

    if new.status = 'paid_held' and new.paid_at is null then
      new.paid_at := now();
    end if;

    -- The 48h buyer-protection window starts when the courier marks the parcel
    -- delivered, never at purchase time.
    if new.status = 'delivered' and new.delivered_at is null then
      new.delivered_at := now();
      new.confirm_deadline_at := now() + interval '48 hours';
    end if;

    if new.status = 'released' and new.released_at is null then
      new.released_at := now();
    end if;

    if new.status = 'cancelled' and new.cancelled_at is null then
      new.cancelled_at := now();
    end if;
  end if;

  -- Amounts are frozen once money has moved; refunds are rows in `refunds`,
  -- not edits to the order.
  if old.status <> 'pending_payment' and (
    new.subtotal_millimes <> old.subtotal_millimes
    or new.delivery_fee_millimes <> old.delivery_fee_millimes
    or new.service_fee_millimes <> old.service_fee_millimes
    or new.commission_millimes <> old.commission_millimes
    or new.total_millimes <> old.total_millimes
  ) then
    raise exception 'order % amounts are immutable after payment', new.id
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger trg_orders_guard
before update on public.orders
for each row execute function app.fn_orders_guard();

-- -----------------------------------------------------------------------------
-- Listing guard: sellers cannot self-publish or reprice a sold listing
-- -----------------------------------------------------------------------------
create or replace function app.fn_listings_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_admin boolean := app.current_is_admin();
begin
  if tg_op = 'UPDATE' then
    -- auth.uid() is null for the service role and for migrations: allow.
    if new.seller_id <> old.seller_id and auth.uid() is not null and not is_admin then
      raise exception 'listing ownership is immutable' using errcode = '23514';
    end if;

    if new.status is distinct from old.status and auth.uid() is not null and not is_admin then
      if not (
        (old.status = 'draft' and new.status in ('pending_review', 'withdrawn'))
        or (old.status = 'pending_review' and new.status in ('draft', 'withdrawn'))
        or (old.status = 'active' and new.status in ('withdrawn', 'reserved'))
        or (old.status = 'reserved' and new.status in ('active', 'sold'))
      ) then
        raise exception 'seller cannot move listing from % to %', old.status, new.status
          using errcode = '23514';
      end if;
    end if;

    if new.status = 'active' and old.published_at is null then
      new.published_at := now();
    end if;

    if old.status in ('sold', 'donated') and new.price_millimes <> old.price_millimes then
      raise exception 'price of a closed listing is immutable' using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_listings_guard
before insert or update on public.listings
for each row execute function app.fn_listings_guard();

-- -----------------------------------------------------------------------------
-- Delivery -> order propagation
-- A courier "delivered" event is authoritative for the 48h window.
-- -----------------------------------------------------------------------------
create or replace function app.fn_delivery_delivered()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'delivered' and old.status <> 'delivered' then
    new.delivered_at := coalesce(new.delivered_at, now());

    update public.orders o
    set status = 'delivered'
    where o.id = new.order_id
      and o.status in ('paid_held', 'awaiting_shipment', 'shipped');
  end if;

  if new.status = 'returned' and old.status <> 'returned' then
    update public.orders o
    set status = 'disputed'
    where o.id = new.order_id
      and o.status in ('shipped', 'delivered');
  end if;

  return new;
end;
$$;

create trigger trg_deliveries_propagate
before update on public.deliveries
for each row execute function app.fn_delivery_delivered();

-- -----------------------------------------------------------------------------
-- 48h release sweep (called by pg_cron every 10 minutes)
-- -----------------------------------------------------------------------------
create or replace function app.fn_release_due_orders(batch_size integer default 100)
returns table (released_order_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with due as (
    select o.id
    from public.orders o
    where o.status = 'delivered'
      and o.confirm_deadline_at is not null
      and o.confirm_deadline_at <= now()
    order by o.confirm_deadline_at
    limit batch_size
    for update skip locked
  ),
  updated as (
    update public.orders o
    set status = 'released'
    from due
    where o.id = due.id
    returning o.id
  )
  select updated.id from updated;
end;
$$;
