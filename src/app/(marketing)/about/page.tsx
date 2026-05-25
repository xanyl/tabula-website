export const metadata = {
  title: "About — Tabula",
  description:
    "Tabula helps businesses transform manual workflows into AI-powered automated systems.",
};

export default function AboutPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        <p className="text-center font-serif text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          About
        </p>
        <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          We believe work should be meaningful.
        </h1>

        <div className="mt-16 space-y-6 leading-relaxed text-text-muted">
          <p>
            Most companies are drowning in work <em>about</em> work. Status
            updates. Data entry. Cross-referencing spreadsheets. Moving
            information from one system to another. These tasks consume hours
            every day — hours that could be spent on judgment, creativity, and
            the work that actually moves the business forward.
          </p>

          <p>
            Tabula exists to fix this. We partner with operations teams to map
            their workflows, identify the highest-leverage automation
            opportunities, and build AI-powered systems that handle the
            busywork — so humans can focus on what humans do best.
          </p>

          <h2 className="mt-12 font-serif text-2xl tracking-[-0.02em] text-text-primary">
            Our approach
          </h2>

          <p>
            We don&apos;t believe in black-box automation. Every workflow we
            build is transparent, auditable, and designed to be modified by the
            team that uses it. We transfer knowledge throughout the engagement
            — not at the end with a handoff document that nobody reads.
          </p>

          <p>
            We&apos;re engineers, not consultants. We write code, not decks. We
            measure results, not billable hours. And we stay with each project
            until the workflow is running smoothly in production — not until the
            contract says we can leave.
          </p>

          <h2 className="mt-12 font-serif text-2xl tracking-[-0.02em] text-text-primary">
            The name
          </h2>

          <p>
            <em>Tabula</em> comes from <em>tabula rasa</em> — the clean slate.
            Every workflow we transform starts with a clear-eyed look at what
            exists today, unburdened by assumptions about how it should work.
            From that understanding, we build something better.
          </p>
        </div>
      </div>
    </section>
  );
}
