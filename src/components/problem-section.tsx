"use client";
import { ScrollReveal } from "@/components/scroll-reveal";

const beforeItems = [
  "Manual email triage",
  "Spreadsheet approvals",
  "Endless handoffs",
  "No process visibility",
];

const afterItems = [
  "Auto-routed to right person",
  "One-click approvals",
  "AI handles triage",
  "Full audit trail",
];

export function ProblemSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <ScrollReveal className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            The Problem
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Manual workflows are invisible friction.
          </h2>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Before */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-border-subtle bg-bg-surface p-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Without Tabula
              </p>
              <ul className="space-y-3">
                {beforeItems.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-dashed border-border-subtle px-5 py-4 text-sm text-text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* After */}
          <ScrollReveal delay={0.25}>
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-accent/[0.02] p-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                With Tabula
              </p>
              <ul className="space-y-3">
                {afterItems.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-accent/15 bg-accent/[0.03] px-5 py-4 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
