import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex min-h-7 items-center rounded-full px-3 text-caption font-semibold tracking-[-0.01em]",
  {
    variants: {
      variant: {
        brand: "bg-brand-100 text-brand-ink",
        premium: "bg-slate-950 text-white",
        neutral: "bg-slate-100 text-slate-700",
        success: "bg-emerald-50 text-success",
        outline: "border border-orange-200 bg-white text-brand-ink",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
