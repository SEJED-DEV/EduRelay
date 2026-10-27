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
 * @file     apps/web/src/app/[locale]/login/page.tsx
 * @summary  Sign-in page: real form when Supabase exists, honest notice otherwise.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Sign-in page.
 *
 * Two states, both honest:
 *   - Supabase credentials present: a real e-mail/password form. A visitor who
 *     already has a session is redirected home instead of being asked to sign in
 *     again.
 *   - No credentials (fresh clone, preview build, the current local stack):
 *     the page says accounts are not open yet and keeps the catalogue and legal
 *     documents reachable. It never renders a form that cannot work.
 *
 * The copy is in the `Login` namespace; the three trust lines are reused from
 * `Hero` so the page cannot drift from what the home page promises.
 */

import { brand } from "@edurelay/brand";
import { isSupabaseConfigured } from "@edurelay/db/env";
import { buttonStyles } from "@edurelay/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import { Heart, ShieldCheck, Truck } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Link, redirect } from "@/i18n/navigation";
import { alternates } from "@/lib/seo";
import { getServerSupabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Login" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternates(locale, "/login"),
    robots: { index: false, follow: true },
  };
}

const TRUST = [
  { key: "trustEscrow", Icon: ShieldCheck },
  { key: "trustDelivery", Icon: Truck },
  { key: "trustDonation", Icon: Heart },
] as const;

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Login" });
  const hero = await getTranslations({ locale, namespace: "Hero" });

  const configured = isSupabaseConfigured();

  if (configured) {
    const supabase = await getServerSupabase();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

    if (data.user) {
      redirect({ href: "/", locale });
    }
  }

  return (
    <>
      <SiteHeader locale={locale} />

      <main
        id="main"
        className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-16 sm:px-8 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-20 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-32 top-10 -z-10 size-[26rem] rounded-full bg-brand/10 blur-[130px]"
        />

        <div className="animate-fade-up">
          <p className="flex items-center gap-3 font-mono text-micro uppercase tracking-caps text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand/60" />
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 font-serif text-h1 leading-heading tracking-heading text-ink">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-[42ch] text-body leading-body text-muted">{t("subtitle")}</p>

          <ul className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line/70 pt-6 text-small text-muted">
            {TRUST.map(({ key, Icon }) => (
              <li key={key} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-brand" />
                {hero(key)}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card edge-light animate-fade-up rounded-[1.75rem] p-6 [animation-delay:80ms] sm:p-8">
          {configured ? (
            <LoginForm />
          ) : (
            <div>
              <p className="font-mono text-micro uppercase tracking-caps text-brand/70">
                — {t("eyebrow")}
              </p>
              <h2 className="mt-3 font-serif text-h3 leading-heading tracking-heading text-ink">
                {t("unconfiguredTitle")}
              </h2>
              <p className="mt-3 text-small leading-body text-muted">{t("unconfiguredBody")}</p>

              <Link href="/" className={buttonStyles({ size: "lg", className: "mt-6" })}>
                {t("backHome")}
              </Link>

              <p className="mt-6 border-t border-line/70 pt-5 text-micro leading-body text-muted">
                {t("supportLabel")}{" "}
                <a
                  href={`mailto:${brand.contacts.supportEmail}`}
                  className="text-brand transition-colors hover:text-brand-dark"
                >
                  {brand.contacts.supportEmail}
                </a>
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
