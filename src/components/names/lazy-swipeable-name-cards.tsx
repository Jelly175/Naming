"use client";

import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { SwipeableBabyName } from "@/components/names/swipeable-name-cards";

const SwipeableNameCards = dynamic(
  () =>
    import("@/components/names/swipeable-name-cards").then(
      (module) => module.SwipeableNameCards,
    ),
  {
    loading: () => <SwipeableNameCardsSkeleton />,
    ssr: false,
  },
);

type LazySwipeableNameCardsProps = {
  names: SwipeableBabyName[];
  className?: string;
  unlockHref?: string;
  consultationHref?: string;
  viewerUserId?: string;
};

export function LazySwipeableNameCards(props: LazySwipeableNameCardsProps) {
  return <SwipeableNameCards {...props} />;
}

function SwipeableNameCardsSkeleton() {
  return (
    <section className="grid gap-4" aria-label="Loading swipeable names">
      <div>
        <Text as="p" variant="caption">
          Swipe shortlist
        </Text>
        <div className="mt-2 h-4 w-24 rounded-full bg-orange-100" />
      </div>
      <Card className="min-h-[31rem] animate-pulse" padding="lg" variant="soft">
        <div className="mb-8 flex gap-2">
          <div className="h-7 w-20 rounded-full bg-orange-100" />
          <div className="h-7 w-24 rounded-full bg-orange-100" />
        </div>
        <div className="h-12 w-40 rounded-2xl bg-orange-100" />
        <div className="mt-4 grid gap-2">
          <div className="h-4 w-full rounded-full bg-orange-100" />
          <div className="h-4 w-3/4 rounded-full bg-orange-100" />
        </div>
        <div className="mt-40 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-2xl bg-white" />
          <div className="h-16 rounded-2xl bg-white" />
          <div className="h-16 rounded-2xl bg-white" />
        </div>
      </Card>
    </section>
  );
}
