import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";

type MobileShellProps = {
  children: ReactNode;
};

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="min-h-dvh bg-orange-50/60 text-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white shadow-2xl shadow-orange-950/5">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
