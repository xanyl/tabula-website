import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description:
    "Insights on workflow automation, AI operations, and building better business systems.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-center font-serif text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Blog
        </p>
        <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          Thinking on workflow.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-text-muted">
          Observations on how AI is reshaping operations, one workflow at a time.
        </p>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-border-subtle bg-bg-surface p-12 text-center">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="mt-2 text-text-muted">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-[background] hover:bg-bg-surface/80"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                  {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="mt-3 font-serif text-xl tracking-[-0.02em] transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
