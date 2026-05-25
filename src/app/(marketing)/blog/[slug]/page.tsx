import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) notFound();

  return (
    <article className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          {new Date(post.publishedAt!).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-text-muted">{post.excerpt}</p>
        )}
        <div
          className="prose prose-invert prose-zinc mt-12 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
