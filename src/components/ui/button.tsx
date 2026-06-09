import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex min-h-touch items-center justify-center rounded-full px-5 text-sm font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-card shadow-orange-900/10 hover:bg-brand-strong focus-visible:outline-brand",
        premium:
          "bg-slate-950 text-white shadow-float shadow-slate-950/20 hover:bg-slate-800 focus-visible:outline-slate-950",
        secondary:
          "bg-surface-soft text-brand-ink hover:bg-brand-100 focus-visible:outline-brand",
        outline:
          "border border-border-soft bg-white text-brand-ink hover:bg-surface-soft focus-visible:outline-brand",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
      },
      size: {
        sm: "min-h-10 px-4 text-xs",
        md: "min-h-touch px-5",
        lg: "min-h-12 px-6 text-base",
        xl: "min-h-14 px-7 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
