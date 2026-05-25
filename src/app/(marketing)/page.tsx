import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessTimeline } from "@/components/process-timeline";
import { ServicesSection } from "@/components/services-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ProcessTimeline />
      <ServicesSection />
    </main>
  );
}
