import { ScrollReveal } from "@/components/scroll-reveal";
import { CursorCard } from "@/components/cursor-card";

const useCases = [
  {
    icon: "⚙",
    title: "Operations",
    desc: "Approvals, handoffs, reporting, multi-tool coordination — automated and visible.",
  },
  {
    icon: "👥",
    title: "Customer Workflows",
    desc: "Intake, triage, onboarding, routing, follow-up — intelligent and self-running.",
  },
  {
    icon: "📄",
    title: "Documents & Knowledge",
    desc: "Extraction, summarization, retrieval, action — across every document and form.",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <ScrollReveal className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Use Cases
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Workflows Tabula can transform.
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {useCases.map((uc, i) => (
            <ScrollReveal key={uc.title} delay={i * 0.1}>
              <CursorCard icon={uc.icon} title={uc.title} desc={uc.desc} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
