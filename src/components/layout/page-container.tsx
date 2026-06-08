import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-28 pt-4 sm:px-6",
        className,
      )}
    >
      {children}
    </main>
  );
}
