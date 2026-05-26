import { AnimatedCounter } from "@/components/animated-counter";
import { ScrollReveal } from "@/components/scroll-reveal";

const metrics = [
  { value: 60, suffix: "%", label: "Less manual work" },
  { value: 3, suffix: "x", label: "Faster operations" },
  { value: 100, suffix: "%", label: "Process visibility" },
];

const marqueeItems = [
  "Workflow Transformation",
  "Practical AI",
  "Operational Clarity",
  "Intelligent Automation",
  "Human-in-the-Loop",
  "Cross-tool Integration",
  "Workflow Transformation",
  "Practical AI",
  "Operational Clarity",
  "Intelligent Automation",
  "Human-in-the-Loop",
  "Cross-tool Integration",
];

export function SocialProofSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        {/* Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-16 border-y border-border-subtle py-20">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <ScrollReveal>
                <AnimatedCounter value={m.value} suffix={m.suffix} />
                <p className="mt-2 text-sm text-text-muted">{m.label}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="mt-16 overflow-hidden border-y border-border-subtle py-8" aria-hidden="true">
          <div className="flex w-max animate-marquee gap-12">
            {marqueeItems.map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-sm font-medium text-text-muted"
              >
                {item}
                {i < marqueeItems.length - 1 && (
                  <span className="ml-12 text-white/20">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
