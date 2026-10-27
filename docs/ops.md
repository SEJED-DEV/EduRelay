<!--
  ==============================================================================
  EduRelay — School Supplies · Passed Forward
  Copyright (c) 2026 EduRelay. All rights reserved.
  
  PRIVATE REPOSITORY — CONFIDENTIAL.
  This file is part of a private, proprietary codebase. Access is granted by
  prior written permission from the owner only. If you are reading this without
  that permission you must stop now and delete every copy: you may not view,
  copy, modify, distribute or disclose this file.
  Unauthorised access or use may give rise to civil and/or criminal liability
  under applicable law, including Tunisian intellectual-property law (Law No.
  94-36) and the law on electronic exchanges (Law No. 2000-83).
  
  Code owned by EduRelay · Made by Sejed TRABELSSI
    Portfolio      https://sejed.dev
    Instagram      https://instagram.com/sejed.dev
    Discord        https://discord.gg/sejed.dev
    Dev Community  https://dev.to/sejed.dev
    Facebook       https://facebook.com/TSSEJED
    Mobile         +216 94 155 000
  
  @file     docs/ops.md
  @summary  Operational runbooks: courier handoff, disputes, donations, payouts.
  @marker   EDURELAY-HEADER
  ==============================================================================
-->

# Operations runbook

Written for 3 a.m., by someone who did not build the feature. Each runbook has a
trigger, a decision tree, the exact SQL or dashboard action, and what to tell the
user.

**Golden rules**

1. Never edit amounts on an order. Refund, then re-order.
2. Never change a status by hand unless the runbook says so; the state machine
   will reject most attempts and that is intentional.
3. Every manual action gets an `admin_actions` row. If it is not logged, it did
   not happen.
4. When in doubt, freeze: pause payouts, not orders.

Useful queries live in `supabase/README.md`. Run them as the service role in the
SQL editor, never from the browser.

---

## 1. An order is stuck in `paid_held` / `awaiting_shipment`

**Trigger:** no courier booking 24 h after payment.

1. Check the seller's phone and last activity:
   `select id, display_name, phone, updated_at from profiles where id = '<seller>';`
2. Call the seller. Two outcomes:
   - **Ships today** → book the courier manually, keep the status.
   - **Cannot ship** → cancel and refund.
3. Cancel path:

   ```sql
   update public.orders set status = 'cancelled',
     cancel_reason = 'seller_unresponsive' where id = '<order>';
   insert into public.refunds (order_id, amount_millimes, reason, status)
   values ('<order>', <total>, 'seller_unresponsive', 'processing');
   ```

4. Refund at the provider, then mark the refund `succeeded` and the payment
   `refunded`.
5. Tell the buyer within the hour. Apologise once, state the refund window, do
   not promise a date you do not control.

---

## 2. Webhook arrived twice / order charged twice

**Trigger:** two `payment_events` rows, or a buyer reports a double debit.

1. `select * from payment_events where provider_event_id = '<id>';` — if one row,
   the duplicate was already dropped by the unique constraint. No action.
2. If two different event ids captured money, the second `payments` row is the
   problem:

   ```sql
   select id, amount_millimes, status, provider_ref, created_at
   from payments where order_id = '<order>' order by created_at;
   ```
3. Refund the duplicate **at the provider**, then mark it:

   ```sql
   update public.payments set status = 'refunded' where id = '<duplicate>';
   ```
4. Add a note to `admin_actions` with the provider reference. If this happens
   twice for the same provider, open a ticket and consider disabling that payment
   method until explained.

---

## 3. Buyer opens a dispute

**Trigger:** `disputes` row, order moves to `disputed`, release sweep skips it.

1. Acknowledge within 12 h, in the buyer's language.
2. Read the thread. Ask for one thing only: a photo, a tracking event, or a
   statement. Long lists of questions read as stalling.
3. Ask the seller for their version with the same 48 h deadline.
4. Decide:
   - **Item not as described / damaged** → refund (full or partial), seller keeps
     the item unless the courier can return it.
   - **Not received, tracking says delivered** → courier investigation first;
     refund if unresolved in 5 days.
   - **Buyer's remorse** → no refund; offer a relisting.
   - **Suspected fraud** → freeze both accounts' payouts, escalate.
5. Record the decision:

   ```sql
   update public.disputes set status = 'resolved_buyer',
     resolution = '<one paragraph>', resolved_at = now() where id = '<dispute>';
   update public.orders set status = 'refunded' where id = '<order>'; -- or 'released'
   ```
6. If refunded: create the `refunds` row, execute at the provider, mark
   `succeeded`. If released: the seller's next payout includes it.
7. Write the customer-facing summary as if a stranger will read it in six months.

**SLA:** first response 12 h, decision 5 business days, refund executed 2 business
days after decision.

---

## 4. Refund execution fails

1. Check the provider dashboard for the refund status. Most failures are
   "insufficient balance" or an expired card.
2. Retry once after 30 minutes. If it fails again:
   - **Online payment** → manual bank transfer, keep the provider reference in
     `refunds.provider_ref`.
   - **COD** → the buyer paid cash; refund by bank transfer or D17, and get a
     signed receipt.
3. Update `refunds.status = 'succeeded'`, `processed_at = now()`.
4. Never leave a refund in `processing` for more than 5 days without a note.

---

## 5. Payout cycle (weekly, Monday)

1. `select * from public.payouts where status = 'requested' order by requested_at;`
2. For each seller, check `select * from public.seller_balance();` under their
   identity, or recompute as service role. Never pay more than `available`.
3. Verify the payout account: holder name matches the profile, `is_verified`.
4. Transfer, then record:

   ```sql
   update public.payouts set status = 'paid', paid_at = now(), transfer_ref = '<ref>'
   where id = '<payout>';
   ```
5. Reconcile total paid against the bank statement. If they disagree, stop and
   reconcile before the next cycle.
6. A seller with an open dispute or a fraud flag gets no payout that week.

---

## 6. Parcel lost or damaged

1. Open a courier claim the same day, with photos and the tracking reference.
2. Tell both sides within 24 h. The buyer does not chase the courier; we do.
3. **Lost** → refund the buyer in full, including delivery. The platform absorbs
   it, then claims from the courier.
4. **Damaged** → photo evidence, partial or full refund; the item is returned if
   the courier allows.
5. Log the courier reference and the claim outcome. Three claims for the same
   courier in a month → review the SLA.

---

## 7. COD remittance mismatch

1. Compare `deliveries.cod_amount_millimes` and `cod_remitted_at` against the
   courier's settlement file, per tracking reference.
2. Any gap: raise it with the courier the same week, with the order numbers.
3. Never mark `cod_remitted_at` on a lump-sum payment. If the courier refuses
   per-order reconciliation, treat 2 % of COD as expected leakage and price it in
   — or change courier.
4. Reconcile before releasing seller payouts that depend on COD money.

---

## 8. Donation flow

1. Donor lists an item as donation → `donation_requests.status = 'offered'`.
2. Match to a partner org (`partner_orgs`, active, same wilaya). If none, queue
   for the next scheduled pickup. Do not promise a date before the org confirms.
3. Book the courier on the platform account (shipping paid by platform) and
   attach `order_id` to the donation.
4. Org confirms receipt → `status = 'delivered'`, `delivered_at = now()`.
5. Send the donor a confirmation (email + in-app). If the donor is a company,
   issue the receipt the partner org provides; we do not issue tax receipts for
   in-kind donations ourselves.

---

## 9. Site down / errors spiking

1. Check `/api/health` and the hosting status page.
2. If the database is up but the app is not: roll back to the previous deployment
   first, investigate second.
3. If the database is down: do **not** retry migrations. Restore from the latest
   dump, then replay nothing — webhooks are idempotent, so replaying is safe, but
   only after the schema matches.
4. Communicate on the status page and socials within 30 minutes, even without a
   cause. Silence is read as incompetence.
5. Post-mortem within 48 h: timeline, cause, blast radius, one preventive action.

---

## 10. Secret leaked

1. **Rotate first.** Supabase service role, payment keys, courier keys, SMS keys.
2. Revoke the old key at the provider.
3. Run `gitleaks git --config .gitleaks.toml --redact` over the full history to
   find every occurrence.
4. If it was pushed: assume it was read. Check provider logs for unexpected use.
5. Rewrite history only after rotation, and coordinate with every clone.
6. Log the incident in `docs/ownership.md` §7 (date, scope, action) — never the
   secret itself.

---

## 11. Cron stopped (release window not firing)

1. `select * from cron.job;` and `select * from cron.job_run_details order by start_time desc limit 20;`
2. If jobs are missing, re-create them (the block in
   `20261026120200_views_storage.sql` is idempotent).
3. Manual sweep, once, if orders are overdue:
   `select app.fn_release_due_orders(500);`
4. Check that pg_cron is installed on the plan. If not, the runtime must call the
   same function on a schedule — never let a delivered order sit unreleased.

---

## 12. Support macros

Keep them short, in both languages, no exclamation marks.

- **Order delayed** — state the last tracking event, the new estimate, and what we
  are doing. No apology paragraph.
- **Refund issued** — amount, method, 3–5 business days, reference number.
- **Dispute opened** — what happens next, the 48 h response window, how to add
  evidence.
- **Account blocked** — the reason category, how to appeal, the review window.

---

## 13. Weekly checks (15 minutes)

- Orders in a non-terminal state older than 7 days.
- Disputes without a first response.
- Refunds stuck in `processing`.
- Payouts requested but unpaid.
- Failed notifications and failed courier bookings.
- Error rate on `/api/health` and the payment webhook.
- Backup ran, and the last restore drill date.
