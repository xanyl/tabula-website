import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!study) return { title: "Not Found" };
  return {
    title: `${study.title} — Tabula Case Study`,
    description: study.excerpt || study.content.slice(0, 160),
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });

  if (!study) notFound();

  return (
    <article className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        {study.industry && (
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
            {study.industry}
          </p>
        )}
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          {study.title}
        </h1>
        <p className="mt-4 text-lg text-text-muted">{study.excerpt}</p>

        {(study.results as string[] | undefined)?.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {(study.results as string[]).map((result: string, i: number) => (
              <span
                key={i}
                className="rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1 text-sm font-medium text-accent"
              >
                {result}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="prose prose-invert prose-zinc mt-12 max-w-none"
          dangerouslySetInnerHTML={{ __html: study.content }}
        />
      </div>
    </article>
  );
}
