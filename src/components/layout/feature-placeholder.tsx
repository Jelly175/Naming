import { PageContainer } from "@/components/layout/page-container";

type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturePlaceholder({
  eyebrow,
  title,
  description,
}: FeaturePlaceholderProps) {
  return (
    <PageContainer className="gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
        {eyebrow}
      </p>
      <section className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {description}
        </p>
      </section>
    </PageContainer>
  );
}
