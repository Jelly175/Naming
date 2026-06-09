import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type SwipeableRailProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  itemClassName?: string;
  label?: string;
};

export function SwipeableRail<T>({
  className,
  getKey,
  itemClassName,
  items,
  label = "Swipeable content",
  renderItem,
}: SwipeableRailProps<T>) {
  return (
    <div aria-label={label} className={cn("-mx-4 overflow-hidden", className)}>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <div
            className={cn(
              "w-[82%] shrink-0 snap-center first:snap-start",
              itemClassName,
            )}
            key={getKey(item, index)}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
