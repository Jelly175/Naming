"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type StickyBottomCtaProps = {
  primaryLabel: string;
  secondaryLabel?: string;
  helperText?: string;
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
  primaryLabel,
  secondaryLabel,
}: StickyBottomCtaProps) {
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
        <Button fullWidth size="xl" variant="premium" onClick={onPrimaryClick}>
          {primaryLabel}
          {primaryIcon}
        </Button>
        {secondaryLabel ? (
          <Button
            fullWidth
            size="lg"
            variant="ghost"
            onClick={onSecondaryClick}
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
