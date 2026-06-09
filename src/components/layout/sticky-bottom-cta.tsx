"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type StickyBottomCtaProps = {
  primaryLabel: string;
  secondaryLabel?: string;
  helperText?: string;
  primaryHref?: string;
  secondaryHref?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  primaryIcon?: ReactNode;
};

export function StickyBottomCta({
  className,
  helperText,
  onPrimaryClick,
  onSecondaryClick,
  primaryIcon,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: StickyBottomCtaProps) {
  const primaryContent = (
    <>
      {primaryLabel}
      {primaryIcon}
    </>
  );

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-orange-100 bg-white/90 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-float backdrop-blur-xl",
        className,
      )}
    >
      {helperText ? (
        <p className="mb-2 text-center text-caption font-medium text-slate-500">
          {helperText}
        </p>
      ) : null}
      <div className="grid gap-2">
        {primaryHref ? (
          <Link
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-7 text-base font-semibold tracking-[-0.01em] text-white shadow-float shadow-slate-950/20 transition-all duration-200 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 active:scale-[0.99]"
            href={primaryHref}
            onClick={onPrimaryClick}
          >
            {primaryContent}
          </Link>
        ) : (
          <Button fullWidth size="xl" variant="premium" onClick={onPrimaryClick}>
            {primaryContent}
          </Button>
        )}
        {secondaryLabel ? (
          secondaryHref ? (
            <Link
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-transparent px-6 text-base font-semibold tracking-[-0.01em] text-slate-700 transition-all duration-200 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 active:scale-[0.99]"
              href={secondaryHref}
              onClick={onSecondaryClick}
            >
              {secondaryLabel}
            </Link>
          ) : (
            <Button
              fullWidth
              size="lg"
              variant="ghost"
              onClick={onSecondaryClick}
            >
              {secondaryLabel}
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
}
