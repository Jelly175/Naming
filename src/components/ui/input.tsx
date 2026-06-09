import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export function Input({
  className,
  helperText,
  id,
  label,
  type = "text",
  ...props
}: InputProps) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      {label ? (
        <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          "min-h-14 w-full rounded-2xl border border-orange-100 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-orange-100",
          className,
        )}
        id={id}
        type={type}
        {...props}
      />
      {helperText ? (
        <span className="text-caption text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
}
