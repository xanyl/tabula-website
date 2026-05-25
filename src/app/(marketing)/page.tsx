import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessTimeline } from "@/components/process-timeline";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ProcessTimeline />
    </main>
  );
}
