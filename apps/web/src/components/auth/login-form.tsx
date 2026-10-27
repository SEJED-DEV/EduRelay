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
 * @file     apps/web/src/components/auth/login-form.tsx
 * @summary  Client sign-in form; coarse errors so accounts cannot be probed.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Sign-in form.
 *
 * Supabase's browser client stores the session in cookies, so the redirect
 * immediately after `signInWithPassword` lands on Server Components that already
 * know who the visitor is. `router.refresh()` is what re-runs them; without it
 * the client cache would still hold the signed-out tree.
 *
 * Errors are deliberately coarse: "wrong e-mail or password" for credential
 * failures, one generic line for everything else. Supabase's message ("Email not
 * confirmed", rate limits) is logged, not rendered, so the form cannot be used to
 * probe which addresses exist.
 */

"use client";

import { getSupabaseBrowserClient } from "@edurelay/db/client";
import { Button } from "@edurelay/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

const FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-line/80 bg-canvas/60 px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-brand/60 focus:ring-2 focus:ring-brand/20 disabled:opacity-60";

export function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      // `invalid_credentials` and `invalid_grant` are the wrong-password cases;
      // everything else gets the generic line.
      const isCredentialError =
        signInError.code === "invalid_credentials" || signInError.code === "invalid_grant";

      if (!isCredentialError) {
        console.error("[edurelay] Sign-in failed.", signInError.code);
      }

      setError(isCredentialError ? t("invalid") : t("generic"));
      setPending(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="text-small font-medium text-ink">
          {t("email")}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          disabled={pending}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-invalid={error ? true : undefined}
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="login-password" className="text-small font-medium text-ink">
            {t("password")}
          </label>
          <button
            type="button"
            onClick={() => setReveal((current) => !current)}
            aria-pressed={reveal}
            aria-controls="login-password"
            className="rounded-full px-1 text-micro text-muted transition-colors hover:text-brand"
          >
            {reveal ? t("hide") : t("show")}
          </button>
        </div>
        <input
          id="login-password"
          name="password"
          type={reveal ? "text" : "password"}
          autoComplete="current-password"
          required
          disabled={pending}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          className={FIELD_CLASS}
        />
      </div>

      {error ? (
        <p
          id="login-error"
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/[0.08] px-4 py-3 text-small leading-body text-danger"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={pending} aria-busy={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
