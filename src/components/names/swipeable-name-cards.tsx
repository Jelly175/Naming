"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Lock, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/utils/cn";

export type SwipeableBabyName = {
  id?: string;
  name: string;
  meaning: string;
  numerologyNumber?: number;
  origin?: string;
  usabilityScore?: number;
  isPremium?: boolean;
  isLocked?: boolean;
  unlockCost?: number;
  styleLabel?: string;
};

type SwipeableNameCardsProps = {
  names: SwipeableBabyName[];
  className?: string;
  unlockHref?: string;
  consultationHref?: string;
  viewerUserId?: string;
};

const SWIPE_THRESHOLD = 80;

export function SwipeableNameCards({
  className,
  consultationHref = "/consultation",
  names,
  unlockHref = "/premium",
  viewerUserId,
}: SwipeableNameCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedNames, setSavedNames] = useState<Set<string>>(() => new Set());
  const [unlockedNames, setUnlockedNames] = useState<Set<string>>(
    () => new Set(),
  );
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string>();

  const activeName = names[activeIndex];
  const activeKey = activeName ? getNameKey(activeName, activeIndex) : "empty";
  const savedCount = savedNames.size;

  const hasMultipleNames = names.length > 1;
  const progressLabel = useMemo(
    () => `${activeIndex + 1} of ${names.length}`,
    [activeIndex, names.length],
  );

  function showNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % names.length);
  }

  function showPrevious() {
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + names.length) % names.length,
    );
  }

  function toggleSaved() {
    if (!activeName) {
      return;
    }

    setSavedNames((currentSavedNames) => {
      const nextSavedNames = new Set(currentSavedNames);

      if (nextSavedNames.has(activeKey)) {
        nextSavedNames.delete(activeKey);
      } else {
        nextSavedNames.add(activeKey);
      }

      return nextSavedNames;
    });
  }

  if (!activeName) {
    return (
      <Card className={className} variant="soft">
        <Text variant="muted">No names available to swipe.</Text>
      </Card>
    );
  }

  const isSaved = savedNames.has(activeKey);
  const isLocked = Boolean(activeName.isLocked) && !unlockedNames.has(activeKey);

  async function handleUnlock() {
    if (!activeName.id || !viewerUserId) {
      window.location.href = unlockHref;
      return;
    }

    setIsUnlocking(true);
    setUnlockError(undefined);

    try {
      const response = await fetch("/api/premium/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": viewerUserId,
        },
        body: JSON.stringify({ babyNameId: activeName.id }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Unable to unlock name.");
      }

      setUnlockedNames((currentUnlockedNames) => {
        const nextUnlockedNames = new Set(currentUnlockedNames);
        nextUnlockedNames.add(activeKey);
        return nextUnlockedNames;
      });
    } catch (error) {
      setUnlockError(
        error instanceof Error ? error.message : "Unable to unlock name.",
      );
    } finally {
      setIsUnlocking(false);
    }
  }

  return (
    <section className={cn("grid gap-4", className)} aria-label="Swipe names">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Text as="p" variant="caption">
            Swipe shortlist
          </Text>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {progressLabel}
            {savedCount > 0 ? ` · ${savedCount} saved` : ""}
          </p>
        </div>
        <button
          className="inline-flex size-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-orange-100 transition-colors hover:bg-orange-50"
          onClick={showPrevious}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-5" />
          <span className="sr-only">Show previous name</span>
        </button>
      </div>

      <div className="relative min-h-[32rem] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-5 top-5 h-[28rem] rounded-[2rem] bg-orange-100/70 blur-xl" />
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            animate={{ opacity: 1, rotate: 0, scale: 1, x: 0 }}
            className="absolute inset-0"
            drag={hasMultipleNames ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            exit={{ opacity: 0, rotate: -6, scale: 0.96, x: -160 }}
            initial={{ opacity: 0, rotate: 6, scale: 0.96, x: 160 }}
            key={activeKey}
            onDragEnd={(_, info) => {
              if (info.offset.x > SWIPE_THRESHOLD) {
                showPrevious();
              }

              if (info.offset.x < -SWIPE_THRESHOLD) {
                showNext();
              }
            }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            whileDrag={{ rotate: 3, scale: 0.98 }}
          >
            <SwipeCard
              locked={isLocked}
              name={activeName}
              saved={isSaved}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          className={cn(isSaved && "bg-rose-50 text-rose-700 hover:bg-rose-100")}
          fullWidth
          onClick={toggleSaved}
          size="lg"
          variant={isSaved ? "secondary" : "outline"}
        >
          <Heart
            aria-hidden="true"
            className={cn("mr-1.5 size-4", isSaved && "fill-current")}
          />
          Save
        </Button>

        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-3 text-sm font-semibold tracking-[-0.01em] text-white shadow-card transition-all duration-200 hover:bg-slate-800 disabled:opacity-60 active:scale-[0.99]"
          disabled={isUnlocking || !isLocked}
          onClick={handleUnlock}
          type="button"
        >
          <Lock aria-hidden="true" className="mr-1.5 size-4" />
          {isUnlocking ? "Unlocking" : isLocked ? "Unlock" : "Open"}
        </button>

        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-green-600 px-3 text-sm font-semibold tracking-[-0.01em] text-white shadow-card transition-all duration-200 hover:bg-green-700 active:scale-[0.99]"
          href={consultationHref}
        >
          <MessageCircle aria-hidden="true" className="mr-1.5 size-4" />
          Expert
        </Link>
      </div>

      <div className="flex justify-center gap-1.5">
        {names.map((name, index) => (
          <button
            aria-label={`Show ${name.name}`}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex ? "w-6 bg-brand" : "w-2 bg-orange-200",
            )}
            key={getNameKey(name, index)}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
      {unlockError ? (
        <p className="text-center text-sm font-medium text-danger">
          {unlockError}
        </p>
      ) : null}
    </section>
  );
}

function SwipeCard({
  locked,
  name,
  saved,
}: {
  locked: boolean;
  name: SwipeableBabyName;
  saved: boolean;
}) {
  const isPremium = Boolean(name.isPremium);

  return (
    <Card
      className="relative flex min-h-[31rem] touch-pan-y select-none flex-col justify-between overflow-hidden"
      padding="lg"
      variant={isPremium ? "premium" : "elevated"}
    >
      {locked ? (
        <div className="absolute inset-x-5 top-24 z-10 rounded-3xl bg-white/85 p-4 text-center shadow-float backdrop-blur-xl ring-1 ring-white/60">
          <Lock aria-hidden="true" className="mx-auto mb-2 size-5 text-slate-950" />
          <p className="text-sm font-bold text-slate-950">
            Unlock with {name.unlockCost ?? 1} credit
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Premium name and meaning are protected until unlocked.
          </p>
        </div>
      ) : null}
      <div>
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant={isPremium ? "outline" : "brand"}>
              {name.styleLabel ?? "Modern"}
            </Badge>
            {isPremium ? <Badge variant="premium">Premium</Badge> : null}
          </div>
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full",
              isPremium
                ? "bg-white/10 text-white ring-1 ring-white/15"
                : "bg-orange-50 text-brand",
            )}
          >
            {saved ? (
              <Heart aria-hidden="true" className="size-5 fill-current" />
            ) : (
              <Sparkles aria-hidden="true" className="size-5" />
            )}
          </span>
        </div>

        <Text
          as="h3"
          className={cn(isPremium ? "text-white" : undefined, locked && "blur-sm")}
          variant="display"
        >
          {name.name}
        </Text>

        <p
          className={cn(
            "mt-3 text-base leading-7",
            isPremium ? "text-white/70" : "text-slate-600",
            locked && "blur-sm",
          )}
        >
          {name.meaning}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-2">
          <CardMetric
            label="Number"
            premium={isPremium}
            value={name.numerologyNumber ? String(name.numerologyNumber) : "-"}
          />
          <CardMetric
            label="Origin"
            premium={isPremium}
            value={name.origin ?? "-"}
          />
          <CardMetric
            label="Usability"
            premium={isPremium}
            value={
              name.usabilityScore
                ? `${Math.round(name.usabilityScore)}`
                : "-"
            }
          />
        </div>
        <p
          className={cn(
            "mt-4 text-center text-xs font-medium",
            isPremium ? "text-white/55" : "text-slate-400",
          )}
        >
          Swipe left or right to explore more names
        </p>
      </div>
    </Card>
  );
}

function CardMetric({
  label,
  premium,
  value,
}: {
  label: string;
  premium: boolean;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-3",
        premium ? "bg-white/10 ring-1 ring-white/10" : "bg-slate-50",
      )}
    >
      <p
        className={cn(
          "text-[0.65rem]",
          premium ? "text-white/55" : "text-slate-500",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate text-sm font-bold",
          premium ? "text-white" : "text-slate-950",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function getNameKey(name: SwipeableBabyName, index: number) {
  return name.id ?? `${name.name}-${index}`;
}
