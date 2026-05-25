import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center py-32">
      <div className="mx-auto max-w-[1200px] px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent font-serif">
          404
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          Page not found.
        </h1>
        <p className="mt-4 text-text-muted max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Let us get you back on track.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:-translate-y-0.5"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
