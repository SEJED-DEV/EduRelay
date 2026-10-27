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
 * @file     supabase/migrations/20261026120100_rls.sql
 * @summary  Row-level security policies for every exposed table.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

-- =============================================================================
--  EduRelay — Row Level Security
--
--  Principles:
--   1. Reference data is world-readable, never writable from a client.
--   2. A user sees their own rows; admins see everything.
--   3. Payments, webhook ledgers and audit rows are service-role only: no
--      client policy exists for them, so even a stolen anon key reads nothing.
--   4. Money-moving state changes go through SECURITY DEFINER functions below,
--      not through client UPDATEs. That is what makes the state machine hold.
-- =============================================================================

alter table public.wilayas enable row level security;
alter table public.categories enable row level security;
alter table public.grade_levels enable row level security;
alter table public.delivery_providers enable row level security;
alter table public.order_status_transitions enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.deliveries enable row level security;
alter table public.delivery_events enable row level security;
alter table public.partner_orgs enable row level security;
alter table public.donation_requests enable row level security;
alter table public.disputes enable row level security;
alter table public.dispute_messages enable row level security;
alter table public.refunds enable row level security;
alter table public.seller_payout_accounts enable row level security;
alter table public.payouts enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_actions enable row level security;

-- -----------------------------------------------------------------------------
-- Reference data
-- -----------------------------------------------------------------------------
create policy "reference: wilayas readable" on public.wilayas
  for select to anon, authenticated using (true);

create policy "reference: categories readable" on public.categories
  for select to anon, authenticated using (is_active);

create policy "reference: grades readable" on public.grade_levels
  for select to anon, authenticated using (true);

create policy "reference: couriers readable" on public.delivery_providers
  for select to anon, authenticated using (is_active);

create policy "reference: transitions readable" on public.order_status_transitions
  for select to anon, authenticated using (true);

create policy "reference: partner orgs readable" on public.partner_orgs
  for select to authenticated using (is_active);

grant select on public.wilayas, public.categories, public.grade_levels,
  public.delivery_providers, public.order_status_transitions
  to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Profiles
-- -----------------------------------------------------------------------------
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles: admin all" on public.profiles
  for all to authenticated
  using (app.current_is_admin())
  with check (app.current_is_admin());

-- Privilege escalation guard: role, verification and moderation fields are
-- server-managed. RLS alone cannot compare OLD and NEW.
create or replace function app.fn_profiles_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not app.current_is_admin() then
    if new.role is distinct from old.role then
      raise exception 'role is managed by EduRelay' using errcode = '42501';
    end if;
    if new.phone_verified_at is distinct from old.phone_verified_at then
      raise exception 'phone verification is managed by EduRelay' using errcode = '42501';
    end if;
    if new.seller_type is distinct from old.seller_type
       and old.seller_type is not null then
      raise exception 'seller type is managed by EduRelay' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_profiles_guard
before update on public.profiles
for each row execute function app.fn_profiles_guard();

-- -----------------------------------------------------------------------------
-- Addresses — strictly private
-- -----------------------------------------------------------------------------
create policy "addresses: owner all" on public.addresses
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "addresses: admin read" on public.addresses
  for select to authenticated using (app.current_is_admin());

-- -----------------------------------------------------------------------------
-- Listings
-- -----------------------------------------------------------------------------
create policy "listings: public read active" on public.listings
  for select to anon, authenticated
  using (status = 'active' and deleted_at is null);

create policy "listings: seller read own" on public.listings
  for select to authenticated using (seller_id = (select auth.uid()));

create policy "listings: admin read" on public.listings
  for select to authenticated using (app.current_is_admin());

create policy "listings: seller insert" on public.listings
  for insert to authenticated
  with check (
    seller_id = (select auth.uid())
    and status in ('draft', 'pending_review')
    and deleted_at is null
  );

create policy "listings: seller update own" on public.listings
  for update to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()));

create policy "listings: admin write" on public.listings
  for all to authenticated
  using (app.current_is_admin())
  with check (app.current_is_admin());

create policy "listing photos: follow listing visibility" on public.listing_photos
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_photos.listing_id
    )
  );

create policy "listing photos: seller writes own" on public.listing_photos
  for all to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_photos.listing_id and l.seller_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_photos.listing_id and l.seller_id = (select auth.uid())
    )
  );

-- -----------------------------------------------------------------------------
-- Orders — participants read, nobody writes directly
-- -----------------------------------------------------------------------------
create policy "orders: participant read" on public.orders
  for select to authenticated
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or app.current_is_admin()
  );

create policy "orders: buyer creates pending order" on public.orders
  for insert to authenticated
  with check (
    buyer_id = (select auth.uid())
    and status = 'pending_payment'
    and payment_method in ('online', 'cod')
  );

-- No UPDATE/DELETE policy: status changes happen through the RPCs below or
-- through the service role (payment and courier webhooks).

create policy "order items: follow order visibility" on public.order_items
  for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_items.order_id));

-- -----------------------------------------------------------------------------
-- Payments — service role only (RLS on, zero policies on purpose)
-- -----------------------------------------------------------------------------
comment on table public.payments is
  'Service-role only. RLS is enabled with no client policy: raw gateway rows are never exposed.';
comment on table public.payment_events is
  'Service-role only. Unique (provider, provider_event_id) makes webhook replays idempotent.';

-- -----------------------------------------------------------------------------
-- Delivery
-- -----------------------------------------------------------------------------
create policy "deliveries: follow order visibility" on public.deliveries
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = deliveries.order_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    )
  );

create policy "delivery events: follow delivery visibility" on public.delivery_events
  for select to authenticated
  using (
    exists (
      select 1 from public.deliveries d
      join public.orders o on o.id = d.order_id
      where d.id = delivery_events.delivery_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    )
  );

-- -----------------------------------------------------------------------------
-- Donations
-- -----------------------------------------------------------------------------
create policy "donations: donor read own" on public.donation_requests
  for select to authenticated using (donor_id = (select auth.uid()));

create policy "donations: donor creates" on public.donation_requests
  for insert to authenticated
  with check (donor_id = (select auth.uid()) and status = 'offered');

create policy "donations: admin all" on public.donation_requests
  for all to authenticated
  using (app.current_is_admin())
  with check (app.current_is_admin());

-- -----------------------------------------------------------------------------
-- Disputes
-- -----------------------------------------------------------------------------
create policy "disputes: participants read" on public.disputes
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = disputes.order_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    )
    or app.current_is_admin()
  );

create policy "disputes: admin write" on public.disputes
  for update to authenticated
  using (app.current_is_admin())
  with check (app.current_is_admin());

create policy "dispute messages: participants read" on public.dispute_messages
  for select to authenticated
  using (
    (not is_internal and exists (
      select 1 from public.disputes d
      join public.orders o on o.id = d.order_id
      where d.id = dispute_messages.dispute_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    ))
    or app.current_is_admin()
  );

create policy "dispute messages: participants write" on public.dispute_messages
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (is_internal = false or app.current_is_admin())
    and exists (
      select 1 from public.disputes d
      join public.orders o on o.id = d.order_id
      where d.id = dispute_messages.dispute_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    )
  );

-- -----------------------------------------------------------------------------
-- Refunds, payouts
-- -----------------------------------------------------------------------------
create policy "refunds: participants read" on public.refunds
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = refunds.order_id
        and (o.buyer_id = (select auth.uid()) or o.seller_id = (select auth.uid()))
    )
    or app.current_is_admin()
  );

create policy "payout accounts: seller own" on public.seller_payout_accounts
  for all to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()) and is_verified = false);

create policy "payout accounts: admin read" on public.seller_payout_accounts
  for select to authenticated using (app.current_is_admin());

create policy "payouts: seller read own" on public.payouts
  for select to authenticated using (seller_id = (select auth.uid()) or app.current_is_admin());

-- -----------------------------------------------------------------------------
-- Trust & safety, notifications, audit
-- -----------------------------------------------------------------------------
create policy "reports: reporter creates" on public.reports
  for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'open');

create policy "reports: reporter reads own" on public.reports
  for select to authenticated using (reporter_id = (select auth.uid()));

create policy "reports: admin all" on public.reports
  for all to authenticated
  using (app.current_is_admin())
  with check (app.current_is_admin());

create policy "notifications: read own" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));

create policy "admin actions: admin read" on public.admin_actions
  for select to authenticated using (app.current_is_admin());

-- =============================================================================
--  Money-moving RPCs
--  SECURITY DEFINER so they can update orders, with explicit participant checks.
-- =============================================================================

create or replace function public.confirm_order(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
  v_uid uuid := (select auth.uid());
begin
  select * into v_order from public.orders where id = p_order_id for update;

  if not found then
    raise exception 'order not found' using errcode = 'P0002';
  end if;

  if v_uid is null or v_order.buyer_id <> v_uid then
    raise exception 'only the buyer can confirm this order' using errcode = '42501';
  end if;

  if v_order.status <> 'delivered' then
    raise exception 'order % is % and cannot be confirmed yet', v_order.order_number, v_order.status
      using errcode = '23514';
  end if;

  update public.orders set status = 'buyer_confirmed' where id = p_order_id;
  update public.orders set status = 'released' where id = p_order_id;

  select * into v_order from public.orders where id = p_order_id;
  return v_order;
end;
$$;

create or replace function public.open_dispute(
  p_order_id uuid,
  p_reason_code text,
  p_description text
)
returns public.disputes
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders;
  v_dispute public.disputes;
  v_uid uuid := (select auth.uid());
begin
  select * into v_order from public.orders where id = p_order_id for update;

  if not found then
    raise exception 'order not found' using errcode = 'P0002';
  end if;

  if v_uid is null or (v_order.buyer_id <> v_uid and v_order.seller_id <> v_uid) then
    raise exception 'not a participant in this order' using errcode = '42501';
  end if;

  if v_order.status not in ('paid_held', 'awaiting_shipment', 'shipped', 'delivered', 'buyer_confirmed') then
    raise exception 'order % cannot be disputed in status %', v_order.order_number, v_order.status
      using errcode = '23514';
  end if;

  insert into public.disputes (order_id, opened_by, reason_code, description)
  values (p_order_id, v_uid, p_reason_code, p_description)
  returning * into v_dispute;

  update public.orders set status = 'disputed' where id = p_order_id;

  return v_dispute;
end;
$$;

revoke all on function public.confirm_order(uuid) from public, anon;
revoke all on function public.open_dispute(uuid, text, text) from public, anon;
grant execute on function public.confirm_order(uuid) to authenticated;
grant execute on function public.open_dispute(uuid, text, text) to authenticated;
