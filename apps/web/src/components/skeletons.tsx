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
 * @file     apps/web/src/components/skeletons.tsx
 * @summary  Shimmer placeholders for streamed catalogue and stats sections.
 * @marker   EDURELAY-HEADER
 * ==============================================================================
 */

/**
 * Skeleton states.
 *
 * Skeletons mirror the real card's geometry so the page does not reflow when
 * data arrives — including the lead card that spans the catalogue grid. They
 * are decorative: the live region announces loading once, and every block is
 * hidden from assistive technology.
 *
 * The shimmer is defined in globals.css and collapses under
 * prefers-reduced-motion.
 */

import { cn } from "@edurelay/ui";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-md", className)} />;
}

export function ListingCardSkeleton({ feature = false }: { feature?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[1.4rem] border border-line/80 bg-surface/50",
        feature &&
          "sm:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
      )}
    >
      <div
        className={cn(
          "relative p-4",
          feature ? "aspect-[16/10] lg:aspect-auto lg:min-h-[21rem]" : "aspect-[4/3]",
        )}
      >
        <Skeleton className="h-full w-full rounded-[1.1rem]" />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5",
          feature && "justify-center gap-4 p-6 lg:p-10",
        )}
      >
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="mt-auto h-8 w-1/3" />
      </div>
    </div>
  );
}

export function ListingsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      aria-hidden="true"
      className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholders, never reordered
        <ListingCardSkeleton key={index} feature={index === 0} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 grid grid-cols-3 gap-3 border-t border-line/70 pt-5"
      aria-busy="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative placeholders, never reordered
        <div key={index}>
          <Skeleton className="h-6 w-10" />
          <Skeleton className="mt-2 h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

/** Route-level fallback: same vertical rhythm as the real home page. */
export function HomePageSkeleton() {
  return (
    <div aria-busy="true" className="animate-fade-in">
      <div className="border-b border-line/60 bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-5 sm:h-[4.5rem] sm:px-8">
          <Skeleton className="size-8 rounded-[22%]" />
          <Skeleton className="h-4 w-24" />
          <div className="ms-auto flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <main id="main" className="mx-auto max-w-[1180px] px-5 pb-20 pt-16 sm:px-8 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
          <div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-7 h-16 w-full max-w-[16ch]" />
            <Skeleton className="mt-3 h-16 w-3/4" />
            <Skeleton className="mt-7 h-5 w-full max-w-[46ch]" />
            <Skeleton className="mt-2 h-5 w-2/3" />
            <div className="mt-9 flex gap-3">
              <Skeleton className="h-[3.35rem] w-52 rounded-full" />
              <Skeleton className="h-[3.35rem] w-44 rounded-full" />
            </div>
            <div className="mt-10 flex gap-6 border-t border-line/70 pt-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-line/80 bg-surface/40 p-2">
            <Skeleton className="aspect-[4/3] w-full rounded-[1.6rem]" />
          </div>
        </div>

        <div className="mt-24">
          <Skeleton className="h-9 w-64" />
          <ListingsGridSkeleton />
        </div>
      </main>
    </div>
  );
}
