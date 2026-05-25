import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] p-16 text-center">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.06),transparent_50%)]" />

          <div className="relative z-10">
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.03em]">
              Ready to make your workflows intelligent?
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-white/70">
              If your company is spending too much time on manual, repetitive
              work, Tabula can turn that process into an automated system
              powered by practical AI.
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#1e1b4b] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start a conversation
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.1] active:scale-[0.98]"
              >
                Explore services
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/50">
              Best fit for companies that want practical automation, clearer
              operations, and systems designed around real workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
