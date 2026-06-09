import { ArrowRight, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { NamePreviewCard } from "@/components/names/name-preview-card";
import { Badge, Button, Card, SwipeableRail, Text } from "@/components/ui";

export default function Home() {
  const modules = [
    "Name search",
    "Numerology engine",
    "Premium unlock",
    "WhatsApp consultation",
  ];
  const featuredNames = [
    {
      name: "Aarav",
      meaning: "Peaceful and wise",
      gender: "boy" as const,
      numerologyNumber: 6,
      styleLabel: "Modern",
      usabilityScore: 96,
      rarityScore: 28,
    },
    {
      name: "Kashvi",
      meaning: "Shining and radiant",
      gender: "girl" as const,
      numerologyNumber: 7,
      styleLabel: "Premium",
      isPremium: true,
      usabilityScore: 88,
      rarityScore: 63,
    },
    {
      name: "Arin",
      meaning: "Mountain strength and peaceful energy",
      gender: "unisex" as const,
      numerologyNumber: 6,
      styleLabel: "Sanskrit",
      isPremium: true,
      usabilityScore: 92,
      rarityScore: 70,
    },
  ];

  return (
    <PageContainer className="gap-7">
      <Card
        className="bg-gradient-to-br from-orange-50 via-white to-amber-50"
        padding="lg"
        variant="elevated"
      >
        <Badge className="mb-6 gap-2" variant="outline">
          <Sparkles aria-hidden="true" className="size-4" />
          Mobile-first baby naming
        </Badge>

        <Text as="h1" variant="display">
          Find meaningful Indian baby names.
        </Text>

        <Text className="mt-4" variant="body">
          Starter architecture for search, numerology, premium unlocks,
          Razorpay payments, and WhatsApp consultation funnels.
        </Text>

        <div className="mt-6 grid gap-3">
          <Button fullWidth size="xl">
            Start with name search
            <ArrowRight aria-hidden="true" className="ml-2 size-5" />
          </Button>
          <Button fullWidth size="lg" variant="secondary">
            Open numerology flow
          </Button>
        </div>
      </Card>

      <section className="grid gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Text as="p" variant="caption">
              Swipeable UI
            </Text>
            <Text as="h2" variant="subtitle">
              Premium name cards
            </Text>
          </div>
          <Badge variant="premium">New</Badge>
        </div>
        <SwipeableRail
          getKey={(item) => item.name}
          items={featuredNames}
          label="Featured baby names"
          renderItem={(item) => <NamePreviewCard {...item} />}
        />
      </section>

      <section className="grid gap-3">
        <Text as="h2" variant="subtitle">
          Initial modules
        </Text>
        {modules.map((module) => (
          <Card key={module} padding="sm" variant="default">
            <p className="text-sm font-semibold text-slate-900">{module}</p>
            <p className="mt-1 text-sm text-slate-500">
              Folder structure is ready for modular implementation.
            </p>
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
