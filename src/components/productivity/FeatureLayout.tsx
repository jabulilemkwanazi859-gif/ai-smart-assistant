import type { ReactNode } from "react";

export function FeatureLayout({
  eyebrow,
  title,
  description,
  input,
  output,
}: {
  eyebrow: string;
  title: string;
  description: string;
  input: ReactNode;
  output: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl animate-in fade-in duration-500">
      <div className="mb-5 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <div className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
          Editable AI output
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-panel sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-card-foreground">Input</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add the details the assistant should use.</p>
          </div>
          {input}
        </div>

        <div className="rounded-xl border border-border/80 bg-surface-raised p-4 shadow-panel sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-card-foreground">Output</h2>
            <p className="mt-1 text-sm text-muted-foreground">Review and edit before copying or using it.</p>
          </div>
          {output}
        </div>
      </div>
    </section>
  );
}
