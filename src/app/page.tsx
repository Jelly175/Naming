import { ArrowRight, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function Home() {
  const modules = [
    "Name search",
    "Numerology engine",
    "Premium unlock",
    "WhatsApp consultation",
  ];

  return (
    <PageContainer className="gap-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm ring-1 ring-orange-100">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
          <Sparkles aria-hidden="true" className="size-4" />
          Mobile-first baby naming
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Find meaningful Indian baby names.
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          Starter architecture for search, numerology, premium unlocks,
          Razorpay payments, and WhatsApp consultation funnels.
        </p>

        <div className="mt-6 grid gap-3">
          <Button className="w-full" size="lg">
            Start with name search
            <ArrowRight aria-hidden="true" className="ml-2 size-5" />
          </Button>
          <Button className="w-full" size="lg" variant="secondary">
            Open numerology flow
          </Button>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-semibold text-slate-950">
          Initial modules
        </h2>
        {modules.map((module) => (
          <div
            className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm"
            key={module}
          >
            <p className="text-sm font-semibold text-slate-900">{module}</p>
            <p className="mt-1 text-sm text-slate-500">
              Folder structure is ready for modular implementation.
            </p>
          </div>
        ))}
      </section>
    </PageContainer>
  );
}
