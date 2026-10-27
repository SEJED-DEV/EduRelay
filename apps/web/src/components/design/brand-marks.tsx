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
 * @file     apps/web/src/components/design/brand-marks.tsx
 * @summary  Design gallery: signature tones, signed lockup and icon on each surface.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Brand-mark gallery.
 *
 * Three questions this section answers, in the order a designer asks them:
 *
 *   1. Which mark do I use — the signed lockup, the composed signature, or the
 *      icon alone?
 *   2. What colour variant works on this surface?
 *   3. What may I never do to the artwork?
 *
 * The signed SVGs are shown exactly as shipped, at their own palettes. Their
 * `prefers-color-scheme` block resolves from the embedding page in Chromium and
 * WebKit, so each specimen declares the `color-scheme` it wants instead of
 * inheriting the page's. That is a preview concern only: in the product, the
 * surface uses the composed signature, which is token-driven and therefore
 * deterministic everywhere.
 *
 * Nothing here is recoloured by CSS. The colour variants come from the
 * composed signature; the signed artwork keeps its two shipped palettes.
 */

import { brand } from "@edurelay/brand";
import type { SignatureTone } from "@edurelay/ui";
import { BrandIcon, BrandLockup, BrandSignature, Wordmark } from "@edurelay/ui";
import { getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";

interface BrandMarksProps {
  locale: string;
}

const TONES: { tone: SignatureTone; plate: string; key: string }[] = [
  { tone: "dual", plate: "bg-elevated", key: "toneDual" },
  { tone: "brand", plate: "bg-elevated", key: "toneBrand" },
  { tone: "ink", plate: "bg-elevated", key: "toneInk" },
  { tone: "accent", plate: "bg-elevated", key: "toneAccent" },
  { tone: "on-light", plate: "bg-mist", key: "toneOnLight" },
  { tone: "on-brand", plate: "bg-brand", key: "toneOnBrand" },
];

const PLATES: { plate: string; tone: SignatureTone; key: string }[] = [
  { plate: "bg-canvas", tone: "dual", key: "plateCanvas" },
  { plate: "bg-surface", tone: "dual", key: "plateSurface" },
  { plate: "bg-elevated", tone: "dual", key: "plateElevated" },
  { plate: "bg-brand-light", tone: "dual", key: "plateBrandLight" },
  { plate: "bg-mist", tone: "on-light", key: "plateMist" },
  { plate: "bg-brand", tone: "on-brand", key: "plateBrand" },
  { plate: "bg-accent", tone: "on-brand", key: "plateAccent" },
  { plate: "bg-ink", tone: "on-light", key: "plateInk" },
];

const ICON_SIZES = [16, 24, 32, 48, 64, 96] as const;

/** One framed specimen with a caption underneath. */
function Specimen({
  label,
  className,
  style,
  children,
}: {
  label: string;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <figure className="min-w-0">
      <div
        style={style}
        className={`flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-line/70 px-5 py-6 ${className}`}
      >
        {children}
      </div>
      <figcaption className="mt-2 truncate font-mono text-[0.62rem] uppercase tracking-caps text-muted/80">
        {label}
      </figcaption>
    </figure>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-[0.68rem] font-medium uppercase tracking-caps text-ink/60">
      {children}
    </h3>
  );
}

export async function BrandMarks({ locale }: BrandMarksProps) {
  const t = await getTranslations({ locale, namespace: "Design" });
  const tagline = locale === "ar" ? brand.tagline.ar : brand.tagline.fr;

  return (
    <section className="mt-14" aria-labelledby="brand-marks">
      <h2 id="brand-marks" className="font-serif text-h3 leading-heading tracking-heading text-ink">
        {t("marks")}
      </h2>
      <p className="mt-3 max-w-[62ch] text-small leading-body text-muted">{t("signatureIntro")}</p>

      {/* ── Composed signature, one specimen per tone ─────────────────────── */}
      <div className="mt-8">
        <SubHeading>{t("tones")}</SubHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TONES.map(({ tone, plate, key }) => (
            <Specimen key={tone} label={t(key)} className={plate}>
              <BrandSignature size="md" tone={tone} tagline={tagline} />
            </Specimen>
          ))}
        </div>
      </div>

      {/* ── Composed signature, sizes ─────────────────────────────────────── */}
      <div className="mt-10">
        <SubHeading>{t("sizes")}</SubHeading>
        <div className="surface-card mt-4 flex flex-wrap items-end gap-x-10 gap-y-6 rounded-2xl p-6">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <BrandSignature size={size} tagline={size === "sm" ? undefined : tagline} />
              <span className="font-mono text-[0.62rem] uppercase tracking-caps text-muted/70">
                {size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Composed signature, one specimen per surface ──────────────────── */}
      <div className="mt-10">
        <SubHeading>{t("plates")}</SubHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATES.map(({ plate, tone, key }) => (
            <Specimen key={key} label={t(key)} className={plate}>
              <BrandSignature size="sm" tone={tone} tagline={tagline} />
            </Specimen>
          ))}
        </div>
      </div>

      {/* ── Signed lockup ────────────────────────────────────────────────── */}
      <div className="mt-12">
        <SubHeading>{t("lockup")}</SubHeading>
        <p className="mt-3 max-w-[62ch] text-small leading-body text-muted">{t("lockupIntro")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Specimen label={t("lockupOnDark")} className="bg-elevated">
            <BrandLockup
              width={280}
              className="h-auto w-full max-w-[280px]"
              style={{ colorScheme: "dark" }}
            />
          </Specimen>

          <Specimen label={t("lockupOnLight")} className="bg-mist">
            <BrandLockup
              width={280}
              className="h-auto w-full max-w-[280px]"
              style={{ colorScheme: "light" }}
            />
          </Specimen>

          <Specimen label={t("lockupOnNone")} className="bg-canvas">
            <BrandLockup
              width={280}
              className="h-auto w-full max-w-[280px]"
              style={{ colorScheme: "dark" }}
            />
          </Specimen>

          <Specimen label={t("lockupOnTransparent")} className="bg-transparent">
            <BrandLockup
              width={280}
              className="h-auto w-full max-w-[280px]"
              style={{ colorScheme: "dark" }}
            />
          </Specimen>
        </div>

        <p className="mt-3 max-w-[62ch] text-micro leading-body text-muted/80">{t("lockupRule")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/brand/edu-relay-logo.svg"
            download
            className="rounded-full border border-line/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-caps text-muted transition-colors hover:border-brand/45 hover:text-ink"
          >
            {t("download")} · logo
          </a>
          <a
            href="/brand/edu-relay-icon.svg"
            download
            className="rounded-full border border-line/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-caps text-muted transition-colors hover:border-brand/45 hover:text-ink"
          >
            {t("download")} · icon
          </a>
        </div>
      </div>

      {/* ── Icon ─────────────────────────────────────────────────────────── */}
      <div className="mt-12">
        <SubHeading>{t("icon")}</SubHeading>
        <p className="mt-3 max-w-[62ch] text-small leading-body text-muted">{t("iconIntro")}</p>

        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-caps text-muted/70">
          {t("iconSizes")}
        </p>
        <div className="surface-card mt-2 flex flex-wrap items-end gap-x-8 gap-y-5 rounded-2xl p-6">
          {ICON_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <BrandIcon size={size} decorative />
              <span className="font-mono text-[0.6rem] tabular-nums text-muted/70">{size}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-caps text-muted/70">
          {t("iconSurfaces")}
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Specimen label={t("plateCanvas")} className="bg-canvas">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateSurface")} className="bg-surface">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateMist")} className="bg-mist">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateBrandLight")} className="bg-brand-light">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateBrand")} className="bg-brand">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateAccent")} className="bg-accent">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateElevated")} className="bg-elevated">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateInk")} className="bg-ink">
            <BrandIcon size={56} decorative />
          </Specimen>
          <Specimen label={t("plateTransparent")} className="bg-transparent">
            <BrandIcon size={56} decorative />
          </Specimen>
        </div>

        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-caps text-muted/70">
          {t("iconContexts")}
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <Specimen label={t("contextAvatar")} className="bg-canvas">
            <span className="rounded-full ring-2 ring-brand/40 ring-offset-4 ring-offset-canvas">
              <BrandIcon size={64} decorative className="rounded-full" />
            </span>
          </Specimen>

          <Specimen label={t("contextHeader")} className="bg-canvas">
            <span className="inline-flex items-center gap-2.5">
              <BrandIcon size={30} decorative />
              <Wordmark size="sm" />
            </span>
          </Specimen>

          <Specimen label={t("contextFavicon")} className="bg-canvas">
            <span className="flex items-end gap-3">
              <BrandIcon size={16} decorative />
              <BrandIcon size={32} decorative />
              <BrandIcon size={48} decorative />
            </span>
          </Specimen>
        </div>
      </div>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <div className="mt-12">
        <SubHeading>{t("rules")}</SubHeading>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              "ruleClearSpace",
              "ruleMinSize",
              "ruleNoStretch",
              "ruleNoRecolor",
              "rulePlate",
            ] as const
          ).map((key) => (
            <li
              key={key}
              className="surface-card rounded-xl p-4 text-small leading-body text-muted"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
