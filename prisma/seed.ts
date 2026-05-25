import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const samplePost = await prisma.blogPost.upsert({
    where: { slug: "why-ai-workflows-fail" },
    update: {},
    create: {
      title: "Why Most AI Workflows Fail (and How We Fix It)",
      slug: "why-ai-workflows-fail",
      excerpt:
        "Three patterns we see in every failed automation project — and the engineering discipline that prevents them.",
      content: `<p>Most AI workflow projects fail not because the AI isn't good enough, but because the workflow around the AI wasn't designed well.</p>

<h2>Pattern 1: The "Just Add AI" Fallacy</h2>
<p>Teams often approach automation by dropping an LLM into an existing workflow and expecting magic. The result is usually worse than the manual process — slower, less reliable, and harder to debug.</p>
<p>What works instead: redesign the workflow around the AI's strengths. An LLM is great at classification, extraction, and summarization. It is bad at consistency, arithmetic, and knowing when it's wrong. Build workflows that play to these strengths.</p>

<h2>Pattern 2: No Feedback Loop</h2>
<p>Manual workflows improve naturally — the person doing the work notices problems and adjusts. Automated workflows don't have this property unless you build it in.</p>
<p>Every Tabula workflow includes a feedback mechanism: flagged outputs, confidence scores, human review checkpoints. Without this, your automation gets worse over time, not better.</p>

<h2>Pattern 3: Bollard Not Bridge</h2>
<p>The worst automation outcome isn't failure — it's a system that runs but is so brittle no one can touch it. When your workflow depends on one person who understands the 12-step Rube Goldberg machine, you've traded one bottleneck for another.</p>
<p>We design workflows so anyone on the team can understand, modify, and extend them. The code is documentation. The process is observable. The handoff points are explicit.</p>

<h2>What Actually Works</h2>
<p>Start with the outcome, not the technology. Map the current workflow end-to-end. Identify the highest-leverage 20% to automate. Build, measure, refine. Repeat.</p>
<p>This isn't glamorous. It's engineering. And it works.</p>`,
      publishedAt: new Date(),
    },
  });

  console.log("Seeded blog post:", samplePost.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
