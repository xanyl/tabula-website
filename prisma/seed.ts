import "dotenv/config";
import { prisma } from "../src/lib/prisma";

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

  const sampleStudy = await prisma.caseStudy.upsert({
    where: { slug: "fintech-compliance-automation" },
    update: {},
    create: {
      title: "How a Fintech Startup Cut Compliance Review Time by 60%",
      slug: "fintech-compliance-automation",
      industry: "Financial Services",
      excerpt:
        "A 40-person fintech company was drowning in manual compliance reviews. Tabula built an AI workflow that cut review time from 45 minutes to 18 — and caught more issues.",
      content: `<p>When ComplianceTech (name changed for confidentiality) reached out to Tabula, they were processing 300+ compliance reviews per week. Each review took an average of 45 minutes. The team of 8 analysts was working overtime, and the backlog was growing.</p>

<h2>The Baseline</h2>
<p>We spent two weeks embedded with the compliance team, mapping their exact workflow. What we found was surprising: only about 15 minutes of the 45-minute review was actual analysis. The rest was data gathering — pulling reports from 4 different systems, cross-referencing customer profiles, checking against regulatory databases.</p>
<p>This is the pattern we see everywhere: the work isn't the work. The work is finding the work.</p>

<h2>The Build</h2>
<p>Tabula built a 3-stage AI workflow:</p>
<ol>
<li><strong>Ingestion layer:</strong> Automated data pull from all 4 source systems, normalized into a single review workspace</li>
<li><strong>Analysis layer:</strong> An LLM-powered pre-review that flagged high-risk items, cross-referenced regulations, and surfaced relevant precedent</li>
<li><strong>Decision layer:</strong> A structured review interface where analysts made final calls, with every decision logged for audit</li>
</ol>

<h2>The Results</h2>
<p>After 6 weeks of iteration and refinement:</p>
<ul>
<li>Average review time: 45 minutes → 18 minutes (60% reduction)</li>
<li>Issues caught: improved by 12% (the AI spotted patterns humans were missing)</li>
<li>Team morale: analysts reported spending time on "actual analysis, not copy-paste"</li>
<li>Backlog: eliminated within 3 weeks of deployment</li>
</ul>

<h2>What Made It Work</h2>
<p>Three things:</p>
<ol>
<li><strong>We didn't replace the analysts.</strong> The AI did the grunt work. Humans made the decisions. This was critical for regulatory acceptance.</li>
<li><strong>We built for observability.</strong> Every AI decision was traced, timestamped, and auditable. The compliance lead could see exactly what the system did and why.</li>
<li><strong>We iterated in production.</strong> Week 1 was rough. Week 3 was solid. Week 6 was excellent. You can't design a workflow like this upfront — you have to refine it with real data.</li>
</ol>

<p>Six months later, the team is handling 30% more volume with the same headcount, and audit findings are at an all-time low.</p>`,
      results: ["60% faster reviews", "12% more issues caught", "Zero backlog in 3 weeks"],
      metrics: {},
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seeded case study:", sampleStudy.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
