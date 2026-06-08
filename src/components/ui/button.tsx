import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-orange-600 text-white shadow-sm shadow-orange-900/10 hover:bg-orange-700 focus-visible:outline-orange-600",
        secondary:
          "bg-orange-50 text-orange-900 hover:bg-orange-100 focus-visible:outline-orange-500",
        outline:
          "border border-orange-200 bg-white text-orange-900 hover:bg-orange-50 focus-visible:outline-orange-500",
      },
      size: {
        sm: "min-h-10 px-4",
        md: "min-h-11 px-5",
        lg: "min-h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
