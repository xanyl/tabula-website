import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Case Studies",
  description:
    "Real results from companies that transformed their workflows with Tabula.",
};

export default async function CaseStudiesPage() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-center font-serif text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Case Studies
        </p>
        <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          Results, not promises.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-muted">
          How companies like yours turned manual chaos into automated clarity.
        </p>

        {studies.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-border-subtle bg-bg-surface p-12 text-center">
            <p className="text-lg font-medium">No case studies yet</p>
            <p className="mt-2 text-text-muted">
              Detailed results from client engagements will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {studies.map((study) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group rounded-2xl border border-border-subtle bg-bg-surface p-8 transition-[background] hover:bg-bg-surface/80"
              >
                {study.industry && (
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                    {study.industry}
                  </p>
                )}
                <h2 className="mt-3 font-serif text-2xl tracking-[-0.02em] transition-colors group-hover:text-accent">
                  {study.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-text-muted">
                  {study.excerpt}
                </p>
                {(study.results as string[] | undefined)?.length ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {(study.results as string[]).map(
                      (result: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1 text-xs font-medium text-accent"
                        >
                          {result}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
