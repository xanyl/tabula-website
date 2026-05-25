export const metadata = {
  title: "Services — Tabula",
  description:
    "End-to-end workflow transformation: from process mapping to AI-powered automation.",
};

const services = [
  {
    title: "Workflow Diagnostics",
    description:
      "A two-week deep dive into your current operations. We map every step, measure every bottleneck, and quantify the opportunity. You get a ranked backlog of automation targets with ROI estimates — not a 60-page deck, but a clear picture of what to fix and in what order.",
  },
  {
    title: "Process Engineering",
    description:
      "We redesign your workflows for the AI era. This isn't about bolting chatbots onto broken processes — it's about rethinking how work moves through your organization when intelligent systems handle the busywork. We deliver process maps, decision trees, and integration specs your engineering team can execute.",
  },
  {
    title: "AI Workflow Build",
    description:
      "Our engineering team builds the automation. LLM-powered classification, extraction, and routing. Structured outputs that feed into your existing tools. Human-in-the-loop checkpoints where judgment matters. Every workflow is instrumented, auditable, and designed to improve over time.",
  },
  {
    title: "Team Enablement",
    description:
      "We don't just build and leave. We train your team to operate, modify, and extend the workflows we create. Documentation, playbooks, and pair-programming sessions ensure your workflows outlast our engagement. The goal is for you to not need us anymore.",
  },
];

export default function ServicesPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-center font-serif text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Services
        </p>
        <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          How we work.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-muted">
          Every engagement follows the same principle: understand deeply, build
          incrementally, transfer ownership.
        </p>

        <div className="mt-20 grid gap-8 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-white/[0.06] bg-bg-surface p-8"
            >
              <h2 className="font-serif text-xl tracking-[-0.02em]">
                {service.title}
              </h2>
              <p className="mt-4 leading-relaxed text-text-muted">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
