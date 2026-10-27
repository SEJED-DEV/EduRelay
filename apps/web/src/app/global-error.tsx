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
 * @file     apps/web/src/app/global-error.tsx
 * @summary  Root 500 boundary, inline-styled because no layout survives.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Root error boundary.
 *
 * Reached when the failure happens in the root layout itself (or in a Server
 * Component above the locale tree), where no next-intl provider, no `[locale]`
 * layout and no `globals.css` exist. Everything here is therefore inline style
 * and hardcoded bilingual copy: the page must render even when the design system
 * cannot.
 *
 * It still looks like EduRelay â€” same canvas, same teal, same support address â€”
 * because an error page is the last impression a visitor gets before leaving.
 */

"use client";

import { brand } from "@edurelay/brand";

const canvas = brand.darkColors.canvas;
const surface = brand.darkColors.surface;
const line = brand.darkColors.line;
const ink = brand.darkColors.ink;
const muted = brand.darkColors.muted;
const teal = brand.darkColors.brand;
const danger = brand.darkColors.danger;

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          backgroundColor: canvas,
          color: ink,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <main style={{ width: "100%", maxWidth: "620px" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: danger,
            }}
          >
            â€” 500
          </p>

          <h1
            style={{
              margin: "18px 0 0",
              fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.2rem)",
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            Une erreur inattendue Â· Ø®Ø·Ø£ ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹
          </h1>

          <p style={{ margin: "16px 0 0", color: muted, lineHeight: 1.65 }}>
            La page n'a pas pu Ãªtre rendue. RÃ©essayez, puis Ã©crivez-nous si le problÃ¨me
            persiste.
          </p>
          <p style={{ margin: "8px 0 0", color: muted, lineHeight: 1.65, direction: "rtl" }}>
            ØªØ¹Ø°Ù‘Ø± Ø¹Ø±Ø¶ Ø§Ù„ØµÙØ­Ø©. Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©ØŒ Ø«Ù… Ø±Ø§Ø³Ù„Ù†Ø§ Ø¥Ø°Ø§
            Ø§Ø³ØªÙ…Ø±Ù‘ Ø§Ù„Ù…Ø´ÙƒÙ„Ø©.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                cursor: "pointer",
                border: "1px solid transparent",
                borderRadius: "999px",
                padding: "12px 22px",
                fontWeight: 600,
                fontSize: "15px",
                color: brand.darkColors["on-brand"],
                backgroundColor: teal,
              }}
            >
              RÃ©essayer Â· Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©
            </button>

            <a
              href="/fr"
              style={{
                borderRadius: "999px",
                padding: "12px 22px",
                fontSize: "15px",
                textDecoration: "none",
                color: ink,
                backgroundColor: surface,
                border: `1px solid ${line}`,
              }}
            >
              Accueil Â· Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©
            </a>
          </div>

          <p style={{ margin: "28px 0 0", paddingTop: "20px", borderTop: `1px solid ${line}` }}>
            <a
              href={`mailto:${brand.contacts.supportEmail}`}
              style={{ color: teal, textDecoration: "none", fontSize: "14px" }}
            >
              {brand.contacts.supportEmail}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
