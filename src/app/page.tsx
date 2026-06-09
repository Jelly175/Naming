import {
  ArrowRight,
  Crown,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { StickyBottomCta } from "@/components/layout/sticky-bottom-cta";
import { NamePreviewCard } from "@/components/names/name-preview-card";
import { Badge, Button, Card, Input, SwipeableRail, Text } from "@/components/ui";

export default function Home() {
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
  const numerologySteps = [
    {
      title: "Name number",
      description: "Each letter maps to a number from 1 to 9.",
    },
    {
      title: "Meaning fit",
      description: "We compare sound, usability, and cultural meaning.",
    },
    {
      title: "Shortlist",
      description: "Parents get names that are beautiful and practical.",
    },
  ];

  return (
    <>
      <PageContainer className="gap-8 pb-56">
        <section className="pt-2">
          <Card
            className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50"
            padding="lg"
            variant="elevated"
          >
            <Badge className="mb-6 gap-2" variant="outline">
              <Sparkles aria-hidden="true" className="size-4" />
              Made for Indian parents
            </Badge>

            <Text as="h1" variant="display">
              Find a baby name that feels right.
            </Text>

            <Text className="mt-4" variant="body">
              Search modern, Sanskrit-inspired, meaningful names with
              numerology, premium shortlists, and WhatsApp guidance.
            </Text>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <TrustMetric label="Names" value="100+" />
              <TrustMetric label="Filters" value="6" />
              <TrustMetric label="Mobile" value="95%" />
            </div>

            <div className="mt-6 grid gap-3">
              <a
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand px-7 text-base font-semibold tracking-[-0.01em] text-white shadow-card transition-all duration-200 hover:bg-brand-strong active:scale-[0.99]"
                href="#search"
              >
                Start searching
                <ArrowRight aria-hidden="true" className="ml-2 size-5" />
              </a>
              <a
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-surface-soft px-6 text-base font-semibold tracking-[-0.01em] text-brand-ink transition-all duration-200 hover:bg-brand-100 active:scale-[0.99]"
                href="#consultation"
              >
                Talk to a naming expert
              </a>
            </div>
          </Card>
        </section>

        <section className="grid gap-3" id="search">
          <SectionHeader
            eyebrow="Quick search"
            title="Search by the details parents care about."
          />
          <Card padding="lg" variant="default">
            <form action="/names" className="grid gap-4" method="get">
              <Input
                helperText="Try light, wisdom, divine, brave, river."
                id="meaning"
                label="Meaning keyword"
                name="meaning"
                placeholder="Search meaning"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2" htmlFor="startingLetter">
                  <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">
                    Letter
                  </span>
                  <select
                    className="min-h-14 rounded-2xl border border-orange-100 bg-white px-4 text-base text-slate-950 shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-orange-100"
                    id="startingLetter"
                    name="startingLetter"
                  >
                    <option value="">Any</option>
                    {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                      <option key={letter} value={letter}>
                        {letter}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2" htmlFor="gender">
                  <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">
                    Gender
                  </span>
                  <select
                    className="min-h-14 rounded-2xl border border-orange-100 bg-white px-4 text-base text-slate-950 shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-orange-100"
                    id="gender"
                    name="gender"
                  >
                    <option value="">Any</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2" htmlFor="numerology">
                  <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">
                    Numerology
                  </span>
                  <select
                    className="min-h-14 rounded-2xl border border-orange-100 bg-white px-4 text-base text-slate-950 shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-orange-100"
                    id="numerology"
                    name="numerology"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2" htmlFor="premium">
                  <span className="text-sm font-semibold tracking-[-0.01em] text-slate-800">
                    Access
                  </span>
                  <select
                    className="min-h-14 rounded-2xl border border-orange-100 bg-white px-4 text-base text-slate-950 shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-orange-100"
                    id="premium"
                    name="premium"
                  >
                    <option value="all">All</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </label>
              </div>

              <Button fullWidth size="xl" type="submit">
                <Search aria-hidden="true" className="mr-2 size-5" />
                Search names
              </Button>
            </form>
          </Card>
        </section>

        <section className="grid gap-3" id="premium">
          <SectionHeader
            eyebrow="Premium shortlist"
            title="Unlock rare names with better fit scores."
          />
          <SwipeableRail
            getKey={(item) => item.name}
            items={featuredNames}
            label="Premium baby names"
            renderItem={(item) => <NamePreviewCard {...item} />}
          />
          <Card
            className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white"
            padding="lg"
            variant="premium"
          >
            <Crown aria-hidden="true" className="mb-4 size-8 text-orange-200" />
            <Text as="h2" className="text-white" variant="title">
              Premium names are curated, not random.
            </Text>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Get names with high usability, better pronunciation, meaningful
              roots, and lower popularity for a more distinctive choice.
            </p>
            <a
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-slate-950 transition-all duration-200 hover:bg-orange-50 active:scale-[0.99]"
              href="/premium"
            >
              View premium packs
              <ArrowRight aria-hidden="true" className="ml-2 size-5" />
            </a>
          </Card>
        </section>

        <section className="grid gap-3" id="numerology">
          <SectionHeader
            eyebrow="Numerology"
            title="A simple number system for confident shortlisting."
          />
          <Card padding="lg" variant="soft">
            <div className="grid gap-3">
              {numerologySteps.map((step, index) => (
                <div
                  className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm"
                  key={step.title}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-[-0.01em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-3" id="consultation">
          <Card className="bg-white" padding="lg" variant="elevated">
            <Badge className="mb-5 gap-2" variant="success">
              <MessageCircle aria-hidden="true" className="size-4" />
              WhatsApp consultation
            </Badge>
            <Text as="h2" variant="title">
              Need help choosing between names?
            </Text>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Share your preferred style, religion, starting letter, and
              numerology needs. A consultant can guide you through a focused
              shortlist on WhatsApp.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 text-success"
                />
                <p className="text-sm leading-6 text-slate-600">
                  No pressure flow: collect details first, consult only when
                  parents are ready.
                </p>
              </div>
              <a
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-green-600 px-7 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-green-700 active:scale-[0.99]"
                href="/consultation"
              >
                Start WhatsApp consultation
                <MessageCircle aria-hidden="true" className="ml-2 size-5" />
              </a>
            </div>
          </Card>
        </section>
      </PageContainer>

      <StickyBottomCta
        className="bottom-20"
        helperText="One-handed shortcut"
        primaryHref="#search"
        primaryIcon={<Search aria-hidden="true" className="ml-2 size-5" />}
        primaryLabel="Search baby names"
        secondaryHref="#consultation"
        secondaryLabel="WhatsApp help"
      />
    </>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <Text as="p" variant="caption">
        {eyebrow}
      </Text>
      <Text as="h2" className="mt-1" variant="subtitle">
        {title}
      </Text>
    </div>
  );
}

function TrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-3 text-center shadow-sm ring-1 ring-orange-100">
      <p className="text-lg font-bold tracking-[-0.02em] text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
    </div>
  );
}
