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
 * @file     supabase/migrations/20261026120300_platform_stats.sql
 * @summary  Anonymous aggregate RPC for the home-page counters.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

-- =============================================================================
--  EduRelay — public platform statistics
--
--  The home page must never hardcode marketing numbers. These aggregates are the
--  only cross-user reads the public needs. SECURITY DEFINER is required because
--  released orders are hidden by RLS from anon, but the function returns counts
--  only: no buyer, seller or order row ever leaves the database.
-- =============================================================================

create or replace function public.platform_stats()
returns table (
  active_listings bigint,
  sold_items bigint,
  covered_wilayas bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      select count(*)
      from public.listings l
      where l.status = 'active'
        and l.deleted_at is null
    ),
    (
      select count(*)
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where o.status = 'released'
    ),
    (
      select count(*)
      from public.wilayas w
      where w.is_covered
    );
$$;

comment on function public.platform_stats() is
  'Anonymous aggregate counters for the public home page. Returns counts only.';

revoke all on function public.platform_stats() from public;
grant execute on function public.platform_stats() to anon, authenticated;
