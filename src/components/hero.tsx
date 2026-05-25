import Link from "next/link";
import { ParticleCanvas } from "@/components/particle-canvas";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <ParticleCanvas />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.12),transparent_60%)] dot-grid" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 text-center">
        <div className="mb-8">
          <div aria-hidden="true" className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/25 font-mono text-2xl font-bold text-accent shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-float">
            T
          </div>
        </div>

        <h1 className="mx-auto max-w-[10ch] font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.05em]">
          <span className="bg-gradient-to-b from-white via-white to-indigo-300 bg-clip-text text-transparent">
            Turn chaos into clarity.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[48ch] text-[clamp(1rem,1.5vw,1.12rem)] text-text-muted">
          Tabula transforms manual workflows into intelligent systems using
          practical AI — built for companies with real operational complexity.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(99,102,241,0.25)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Start a conversation
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:border-white/[0.14] active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-text-muted">
          <span>Practical AI, not hype</span>
          <span className="text-white/40">|</span>
          <span>Built around real workflows</span>
          <span className="text-white/40">|</span>
          <span>Designed for operational clarity</span>
        </div>
      </div>
    </section>
  );
}
