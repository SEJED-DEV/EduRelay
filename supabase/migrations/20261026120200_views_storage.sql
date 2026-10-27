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
 * @file     supabase/migrations/20261026120200_views_storage.sql
 * @summary  Read models, storage buckets and scheduled release job.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

-- =============================================================================
--  EduRelay — read models, storage buckets, scheduled jobs
--
--  Read models are views with security_invoker = true, so RLS on the base
--  tables still applies: a view can never leak a draft listing or another
--  seller's address. Anything that needs the service role stays a function.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- public_listings: the browse/search read model
-- Aggregates the first photo and the seller's public profile so the browse page
-- is one query instead of an N+1.
-- -----------------------------------------------------------------------------
create view public.public_listings
with (security_invoker = true)
as
select
  l.id,
  l.title_fr,
  l.title_ar,
  l.description_fr,
  l.description_ar,
  l.condition,
  l.kind,
  l.price_millimes,
  l.original_price_millimes,
  l.currency,
  l.is_donation,
  l.status,
  l.featured_until,
  l.published_at,
  l.view_count,
  l.created_at,
  l.seller_id,
  p.display_name as seller_name,
  p.seller_type,
  p.avatar_path as seller_avatar_path,
  w.code as wilaya_code,
  w.name_fr as wilaya_name_fr,
  w.name_ar as wilaya_name_ar,
  c.slug as category_slug,
  c.name_fr as category_name_fr,
  c.name_ar as category_name_ar,
  g.slug as grade_slug,
  g.name_fr as grade_name_fr,
  g.name_ar as grade_name_ar,
  ph.storage_path as cover_path,
  ph.blurhash as cover_blurhash,
  ph.width as cover_width,
  ph.height as cover_height
from public.listings l
join public.profiles p on p.id = l.seller_id
join public.wilayas w on w.id = l.wilaya_id
join public.categories c on c.id = l.category_id
left join public.grade_levels g on g.id = l.grade_level_id
left join lateral (
  select lp.storage_path, lp.blurhash, lp.width, lp.height
  from public.listing_photos lp
  where lp.listing_id = l.id
  order by lp.position
  limit 1
) ph on true
where l.deleted_at is null;

comment on view public.public_listings is
  'Browse/search read model. Inherits listings RLS (security_invoker), so only active listings are visible to anon.';

-- -----------------------------------------------------------------------------
-- order_summary: what a participant is allowed to know about an order
-- -----------------------------------------------------------------------------
create view public.order_summary
with (security_invoker = true)
as
select
  o.id,
  o.order_number,
  o.status,
  o.payment_method,
  o.currency,
  o.subtotal_millimes,
  o.delivery_fee_millimes,
  o.service_fee_millimes,
  o.total_millimes,
  o.placed_at,
  o.paid_at,
  o.delivered_at,
  o.confirm_deadline_at,
  o.released_at,
  buyer.display_name as buyer_name,
  seller.display_name as seller_name,
  d.status as delivery_status,
  d.tracking_ref,
  dp.name as courier_name,
  dp.code as courier_code
from public.orders o
join public.profiles buyer on buyer.id = o.buyer_id
join public.profiles seller on seller.id = o.seller_id
left join public.deliveries d on d.order_id = o.id
left join public.delivery_providers dp on dp.id = d.provider_id;

comment on view public.order_summary is
  'Participant-facing order view. Inherits orders RLS, so a user only sees their own orders.';

-- -----------------------------------------------------------------------------
-- seller_balances: money owed to a seller, derived — never stored twice
-- SECURITY DEFINER because it aggregates across orders the caller may not read,
-- but it only ever returns the caller's own row.
-- -----------------------------------------------------------------------------
create or replace function public.seller_balance()
returns table (
  available_millimes bigint,
  held_millimes bigint,
  paid_out_millimes bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with released as (
    select coalesce(sum(o.subtotal_millimes - o.commission_millimes), 0)::bigint as amount
    from public.orders o
    where o.seller_id = (select auth.uid())
      and o.status = 'released'
  ),
  held as (
    select coalesce(sum(o.subtotal_millimes - o.commission_millimes), 0)::bigint as amount
    from public.orders o
    where o.seller_id = (select auth.uid())
      and o.status in ('paid_held', 'awaiting_shipment', 'shipped', 'delivered', 'buyer_confirmed', 'disputed')
  ),
  paid as (
    select coalesce(sum(p.amount_millimes), 0)::bigint as amount
    from public.payouts p
    where p.seller_id = (select auth.uid())
      and p.status = 'paid'
  )
  select
    greatest(released.amount - paid.amount, 0),
    held.amount,
    paid.amount
  from released, held, paid;
$$;

revoke all on function public.seller_balance() from public, anon;
grant execute on function public.seller_balance() to authenticated;

-- -----------------------------------------------------------------------------
-- Storage
-- Listing photos are public-read (a listing is public), avatars are public-read,
-- dispute attachments are private and served through signed URLs.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-photos', 'listing-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 1048576, array['image/jpeg', 'image/png', 'image/webp']),
  ('dispute-attachments', 'dispute-attachments', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- Public read for the two public buckets.
create policy "storage: public read listing photos"
on storage.objects for select to anon, authenticated
using (bucket_id = 'listing-photos');

create policy "storage: public read avatars"
on storage.objects for select to anon, authenticated
using (bucket_id = 'avatars');

-- Writes are owner-scoped: the first path segment must be the user's id.
create policy "storage: seller writes own listing photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage: seller deletes own listing photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage: user writes own avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "storage: user updates own avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Dispute evidence: only the two participants may read or upload.
create policy "storage: dispute participants read"
on storage.objects for select to authenticated
using (
  bucket_id = 'dispute-attachments'
  and exists (
    select 1
    from public.disputes d
    join public.orders o on o.id = d.order_id
    where d.id::text = (storage.foldername(name))[1]
      and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
  )
);

create policy "storage: dispute participants upload"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'dispute-attachments'
  and exists (
    select 1
    from public.disputes d
    join public.orders o on o.id = d.order_id
    where d.id::text = (storage.foldername(name))[1]
      and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
  )
);

-- -----------------------------------------------------------------------------
-- Scheduled jobs
-- 1. Release the escrow window for delivered orders (every 10 minutes).
-- 2. Expire unpaid orders after 24 h (every hour).
-- pg_cron exists on Supabase; guard so local/CI runs without it still migrate.
-- -----------------------------------------------------------------------------
create or replace function app.fn_expire_unpaid_orders()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  expired integer;
begin
  with stale as (
    select o.id
    from public.orders o
    where o.status = 'pending_payment'
      and o.placed_at < now() - interval '24 hours'
  ),
  updated as (
    update public.orders o
    set status = 'expired'
    from stale
    where o.id = stale.id
    returning o.id
  )
  select count(*) into expired from updated;

  return expired;
end;
$$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if exists (select 1 from cron.job where jobname = 'edurelay-release-orders') then
      perform cron.unschedule('edurelay-release-orders');
    end if;
    perform cron.schedule(
      'edurelay-release-orders',
      '*/10 * * * *',
      $cron$select app.fn_release_due_orders(100);$cron$
    );

    if exists (select 1 from cron.job where jobname = 'edurelay-expire-orders') then
      perform cron.unschedule('edurelay-expire-orders');
    end if;
    perform cron.schedule(
      'edurelay-expire-orders',
      '7 * * * *',
      $cron$select app.fn_expire_unpaid_orders();$cron$
    );
  else
    raise notice 'pg_cron not installed: release/expiry jobs must be scheduled by the runtime instead.';
  end if;
end;
$$;
