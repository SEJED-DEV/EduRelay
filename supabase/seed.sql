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
 * @file     supabase/seed.sql
 * @summary  Reference data: wilayas, categories, grades, couriers, fee rules.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

-- =============================================================================
--  EduRelay — reference data
--
--  Safe to run repeatedly: every insert is idempotent (on conflict do nothing /
--  do update). Never put real people, real addresses or real phone numbers in
--  this file — demo accounts belong in supabase/tests/, not here.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 24 governorates. `is_covered` is the launch footprint: Grand Tunis first,
-- then Sousse, Sfax and the coastal corridor (see docs/roadmap.md, phase 3).
-- -----------------------------------------------------------------------------
insert into public.wilayas (id, code, name_fr, name_ar, is_covered) values
  (11, 'TN-11', 'Tunis',        'تونس',        true),
  (12, 'TN-12', 'Ariana',       'أريانة',       true),
  (13, 'TN-13', 'Ben Arous',    'بن عروس',      true),
  (14, 'TN-14', 'Manouba',      'منوبة',        true),
  (21, 'TN-21', 'Nabeul',       'نابل',         false),
  (22, 'TN-22', 'Zaghouan',     'زغوان',        false),
  (23, 'TN-23', 'Bizerte',      'بنزرت',        false),
  (31, 'TN-31', 'Béja',         'باجة',         false),
  (32, 'TN-32', 'Jendouba',     'جندوبة',       false),
  (33, 'TN-33', 'Le Kef',       'الكاف',        false),
  (34, 'TN-34', 'Siliana',      'سليانة',       false),
  (41, 'TN-41', 'Kairouan',     'القيروان',     false),
  (42, 'TN-42', 'Kasserine',    'القصرين',      false),
  (43, 'TN-43', 'Sidi Bouzid',  'سيدي بوزيد',   false),
  (51, 'TN-51', 'Sousse',       'سوسة',         true),
  (52, 'TN-52', 'Monastir',     'المنستير',     false),
  (53, 'TN-53', 'Mahdia',       'المهدية',      false),
  (61, 'TN-61', 'Sfax',         'صفاقس',        true),
  (71, 'TN-71', 'Gafsa',        'قفصة',         false),
  (72, 'TN-72', 'Tozeur',       'توزر',         false),
  (73, 'TN-73', 'Kébili',       'قبلي',         false),
  (81, 'TN-81', 'Gabès',        'قابس',         false),
  (82, 'TN-82', 'Médenine',     'مدنين',        false),
  (83, 'TN-83', 'Tataouine',    'تطاوين',       false)
on conflict (id) do update
  set name_fr = excluded.name_fr,
      name_ar = excluded.name_ar,
      is_covered = excluded.is_covered;

-- -----------------------------------------------------------------------------
-- School levels. Slugs are stable API surface: the browse URL uses them.
-- -----------------------------------------------------------------------------
insert into public.grade_levels (slug, name_fr, name_ar, cycle, sort_order) values
  ('primaire-1', '1ère année primaire', 'السنة الأولى ابتدائي', 'primary', 1),
  ('primaire-2', '2ème année primaire', 'السنة الثانية ابتدائي', 'primary', 2),
  ('primaire-3', '3ème année primaire', 'السنة الثالثة ابتدائي', 'primary', 3),
  ('primaire-4', '4ème année primaire', 'السنة الرابعة ابتدائي', 'primary', 4),
  ('primaire-5', '5ème année primaire', 'السنة الخامسة ابتدائي', 'primary', 5),
  ('primaire-6', '6ème année primaire', 'السنة السادسة ابتدائي', 'primary', 6),
  ('college-7',  '7ème année de base',  'السنة السابعة أساسي',  'middle', 7),
  ('college-8',  '8ème année de base',  'السنة الثامنة أساسي',  'middle', 8),
  ('college-9',  '9ème année de base',  'السنة التاسعة أساسي',  'middle', 9),
  ('lycee-1',    '1ère année secondaire', 'السنة الأولى ثانوي', 'secondary', 10),
  ('lycee-2',    '2ème année secondaire', 'السنة الثانية ثانوي', 'secondary', 11),
  ('lycee-3',    '3ème année secondaire', 'السنة الثالثة ثانوي', 'secondary', 12),
  ('lycee-4',    '4ème année secondaire (Bac)', 'السنة الرابعة ثانوي (باك)', 'bac', 13)
on conflict (slug) do update
  set name_fr = excluded.name_fr,
      name_ar = excluded.name_ar,
      cycle = excluded.cycle,
      sort_order = excluded.sort_order;

-- -----------------------------------------------------------------------------
-- Categories. Flat on purpose: two levels of taxonomy is all the search needs,
-- and a deep tree is a moderation burden nobody maintains in year one.
-- -----------------------------------------------------------------------------
insert into public.categories (slug, name_fr, name_ar, sort_order) values
  ('manuels-scolaires', 'Manuels scolaires',   'الكتب المدرسية',      1),
  ('cahiers',           'Cahiers et classeurs', 'الدفاتر والملفات',    2),
  ('trousses',          'Trousses et stylos',   'المقلمات والأقلام',   3),
  ('cartables',         'Cartables et sacs',    'المحافظ والحقائب',    4),
  ('calculatrices',     'Calculatrices',        'الآلات الحاسبة',      5),
  ('uniformes',         'Blouses et uniformes', 'المآزر والزي المدرسي', 6),
  ('dictionnaires',     'Dictionnaires',        'المعاجم',             7),
  ('arts',              'Arts plastiques',      'التربية التشكيلية',   8),
  ('sport',             'Éducation physique',   'التربية البدنية',     9),
  ('materiel-bureau',   'Matériel de bureau',   'الأدوات المكتبية',    10)
on conflict (slug) do update
  set name_fr = excluded.name_fr,
      name_ar = excluded.name_ar,
      sort_order = excluded.sort_order;

-- -----------------------------------------------------------------------------
-- Couriers. `supports_api` drives whether the adapter can book automatically;
-- `supports_cod` decides whether cash-on-delivery is offered at checkout.
-- -----------------------------------------------------------------------------
insert into public.delivery_providers
  (code, name, is_active, supports_api, supports_cod, coverage_wilayas)
values
  ('first_delivery', 'First Delivery', true, true, true, array[11,12,13,14,51,61]::smallint[]),
  ('aramex',         'Aramex Tunisie', true, false, false, array[11,12,13,14,21,51,52,61]::smallint[]),
  ('manual',         'Remise en main propre', true, false, true, array[]::smallint[])
on conflict (code) do update
  set name = excluded.name,
      is_active = excluded.is_active,
      supports_api = excluded.supports_api,
      supports_cod = excluded.supports_cod,
      coverage_wilayas = excluded.coverage_wilayas;

-- -----------------------------------------------------------------------------
-- Order state machine. A row here is permission to move; anything else is
-- rejected by app.fn_orders_guard().
--
--   pending_payment -> paid_held          payment captured / COD confirmed
--   paid_held       -> awaiting_shipment  seller notified, courier booking open
--   awaiting_shipment -> shipped          courier collected the parcel
--   shipped         -> delivered          courier delivered (starts 48 h)
--   delivered       -> buyer_confirmed    buyer pressed "tout est bon"
--   buyer_confirmed -> released           money owed to the seller
--   delivered       -> released           automatic release after 48 h
--   *               -> disputed           buyer or seller opens a case
--   disputed        -> delivered|refunded|cancelled
-- -----------------------------------------------------------------------------
insert into public.order_status_transitions (from_status, to_status) values
  ('pending_payment', 'paid_held'),
  ('pending_payment', 'cancelled'),
  ('pending_payment', 'expired'),
  ('paid_held', 'awaiting_shipment'),
  ('paid_held', 'disputed'),
  ('paid_held', 'refunded'),
  ('paid_held', 'cancelled'),
  ('awaiting_shipment', 'shipped'),
  ('awaiting_shipment', 'disputed'),
  ('awaiting_shipment', 'refunded'),
  ('awaiting_shipment', 'cancelled'),
  ('shipped', 'delivered'),
  ('shipped', 'disputed'),
  ('shipped', 'refunded'),
  ('delivered', 'buyer_confirmed'),
  ('delivered', 'released'),
  ('delivered', 'disputed'),
  ('delivered', 'refunded'),
  ('buyer_confirmed', 'released'),
  ('buyer_confirmed', 'disputed'),
  ('disputed', 'delivered'),
  ('disputed', 'refunded'),
  ('disputed', 'cancelled')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Demo catalogue for local development only.
-- Guarded by an explicit setting so it can never run against production:
--   supabase db reset          -> seeds reference data + demo listings
--   production                 -> no `edurelay.seed_demo` setting, nothing runs
-- -----------------------------------------------------------------------------
do $$
declare
  demo_seller uuid;
  demo_category uuid;
begin
  if current_setting('edurelay.seed_demo', true) is distinct from 'on' then
    return;
  end if;

  -- A synthetic seller profile. The auth user is created by supabase/tests/,
  -- not here, so this block is only useful in a database that has one.
  select id into demo_seller from public.profiles where display_name = 'Démo EduRelay' limit 1;
  if demo_seller is null then
    return;
  end if;

  select id into demo_category from public.categories where slug = 'manuels-scolaires';

  insert into public.listings (
    seller_id, title_fr, title_ar, description_fr, description_ar,
    category_id, condition, kind, price_millimes, original_price_millimes,
    wilaya_id, status, published_at
  )
  select
    demo_seller,
    'Lot de manuels 9ème année',
    'مجموعة كتب السنة التاسعة',
    'Six manuels en bon état, annotations au crayon effaçables. Aucune page déchirée.',
    'ستة كتب في حالة جيدة، ملاحظات بالقلم الرصاص قابلة للمحو. لا توجد صفحات ممزقة.',
    demo_category, 'good', 'bundle', 45000, 120000, 11, 'active', now()
  where not exists (
    select 1 from public.listings where title_fr = 'Lot de manuels 9ème année'
  );
end;
$$;
