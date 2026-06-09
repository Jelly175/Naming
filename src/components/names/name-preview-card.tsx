import { Lock, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type NamePreviewCardProps = {
  name: string;
  meaning: string;
  gender: "boy" | "girl" | "unisex";
  numerologyNumber?: number;
  styleLabel?: string;
  isPremium?: boolean;
  usabilityScore?: number;
  rarityScore?: number;
};

export function NamePreviewCard({
  gender,
  isPremium = false,
  meaning,
  name,
  numerologyNumber,
  rarityScore,
  styleLabel,
  usabilityScore,
}: NamePreviewCardProps) {
  return (
    <Card className="min-h-64" variant={isPremium ? "premium" : "elevated"}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <Badge variant={isPremium ? "outline" : "brand"}>
          {styleLabel ?? "Modern"}
        </Badge>
        {isPremium ? (
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
            <Lock aria-hidden="true" className="size-4" />
          </span>
        ) : (
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-orange-50 text-brand">
            <Sparkles aria-hidden="true" className="size-4" />
          </span>
        )}
      </div>

      <Text
        as="h3"
        className={isPremium ? "text-white" : undefined}
        variant="title"
      >
        {name}
      </Text>
      <p
        className={
          isPremium
            ? "mt-2 line-clamp-3 text-sm leading-6 text-white/70"
            : "mt-2 line-clamp-3 text-sm leading-6 text-slate-500"
        }
      >
        {meaning}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Metric label="Gender" value={gender} premium={isPremium} />
        <Metric
          label="Number"
          value={numerologyNumber ? String(numerologyNumber) : "-"}
          premium={isPremium}
        />
        <Metric
          label="Rarity"
          value={rarityScore ? String(Math.round(rarityScore)) : "-"}
          premium={isPremium}
        />
      </div>

      {usabilityScore ? (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
          <span className={isPremium ? "text-xs text-white/70" : "text-xs text-slate-500"}>
            Usability score
          </span>
          <span className={isPremium ? "text-sm font-bold text-white" : "text-sm font-bold text-slate-950"}>
            {Math.round(usabilityScore)} / 100
          </span>
        </div>
      ) : null}
    </Card>
  );
}

function Metric({
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
      className={
        premium
          ? "rounded-2xl bg-white/10 p-3 ring-1 ring-white/10"
          : "rounded-2xl bg-slate-50 p-3"
      }
    >
      <p
        className={
          premium ? "text-[0.65rem] text-white/60" : "text-[0.65rem] text-slate-500"
        }
      >
        {label}
      </p>
      <p
        className={
          premium
            ? "mt-1 truncate text-sm font-bold capitalize text-white"
            : "mt-1 truncate text-sm font-bold capitalize text-slate-950"
        }
      >
        {value}
      </p>
    </div>
  );
}
