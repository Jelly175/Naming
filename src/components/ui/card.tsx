import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const cardVariants = cva("rounded-card transition-shadow", {
  variants: {
    variant: {
      default: "border border-orange-100 bg-white shadow-card",
      elevated: "bg-white shadow-float ring-1 ring-slate-950/5",
      premium:
        "bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white shadow-float",
      soft: "border border-orange-100 bg-surface-soft shadow-sm",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-card",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}
