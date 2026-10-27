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
 * @file     apps/web/src/app/global-not-found.tsx
 * @summary  Prerendered, locale-aware 404 document served for unmatched URLs.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Global, prerendered 404.
 *
 * Next.js only renders a `not-found.tsx` boundary on the server for routes it
 * can render ahead of time. A 404 thrown while a dynamic route streams resolves
 * on the client, which leaves the first paint blank — unacceptable for a
 * dark-first product. `global-not-found.tsx` is static: it is generated once at
 * build time and served for any unmatched URL, with a real 404 status.
 *
 * It therefore owns its own `<html>` (the locale layout is not in scope). The
 * document is rendered in French, then a blocking inline script stamps the real
 * `lang`, `dir` and `data-locale` from the URL before the body is parsed, so
 * Arabic gets RTL and the Plex face on the first frame. Copy is read from the
 * same message files as every other page; `globals.css` hides the block that
 * does not match `data-locale`.
 */

import { brand } from "@edurelay/brand";
import { buttonStyles } from "@edurelay/ui";
import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/fonts";
import ar from "@/messages/ar.json";
import fr from "@/messages/fr.json";
import "./globals.css";

/** The 404 is still the product: same canvas colour in the browser chrome. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: brand.darkColors.canvas,
};

export const metadata: Metadata = {
  title: `404 — ${brand.name}`,
  robots: { index: false, follow: false },
};

/**
 * Runs in `<head>`, before the body exists. `dataset.locale` drives the copy
 * switch; `lang`/`dir` drive the Arabic face and direction.
 */
const localeScript = `try{var s=location.pathname.split("/")[1];var l=s==="ar"?"ar":"fr";var r=document.documentElement;r.lang=l;r.dir=l==="ar"?"rtl":"ltr";r.dataset.locale=l}catch(e){}`;

const copies = [
  { code: "fr", dir: "ltr", messages: fr.NotFound },
  { code: "ar", dir: "rtl", messages: ar.NotFound },
] as const;

export default function GlobalNotFound() {
  return (
    <html
      lang="fr"
      dir="ltr"
      data-theme="dark"
      data-locale="fr"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed, non-user string */}
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <main className="relative mx-auto flex min-h-dvh max-w-[880px] flex-col items-start justify-center overflow-hidden px-6 py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-40 top-1/3 size-[26rem] rounded-full bg-brand/10 blur-[130px]"
          />

          <div className="relative">
            <p
              aria-hidden="true"
              className="font-mono text-micro uppercase tracking-caps text-brand"
            >
              — 404
            </p>
            <p className="text-gradient display-glow mt-3 font-serif text-display leading-display tracking-display">
              404
            </p>

            {copies.map(({ code, dir, messages }) => (
              <div key={code} className={`locale-${code}`} dir={dir} lang={code}>
                <h1 className="mt-4 font-serif text-h2 leading-heading tracking-heading text-ink">
                  {messages.title}
                </h1>
                <p className="mt-3 max-w-[46ch] text-body leading-body text-muted">
                  {messages.body}
                </p>
                <a href={`/${code}`} className={buttonStyles({ size: "lg", className: "mt-9" })}>
                  {messages.cta}
                </a>
              </div>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
