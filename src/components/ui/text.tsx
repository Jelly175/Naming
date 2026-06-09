import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const textVariants = cva("tracking-[-0.02em]", {
  variants: {
    variant: {
      display: "text-display font-bold text-slate-950",
      title: "text-title font-bold text-slate-950",
      subtitle: "text-lg font-semibold text-slate-900",
      body: "text-body tracking-normal text-slate-600",
      caption:
        "text-caption font-medium uppercase tracking-[0.12em] text-brand",
      muted: "text-sm tracking-normal text-slate-500",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: "h1" | "h2" | "h3" | "p" | "span";
    children: ReactNode;
  };

export function Text({
  as: Component = "p",
  children,
  className,
  variant,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
