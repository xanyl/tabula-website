import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessTimeline } from "@/components/process-timeline";
import { ServicesSection } from "@/components/services-section";
import { UseCasesSection } from "@/components/use-cases-section";
import { SocialProofSection } from "@/components/social-proof-section";
import { CTASection } from "@/components/cta-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ProcessTimeline />
      <ServicesSection />
      <UseCasesSection />
      <SocialProofSection />
      <CTASection />
    </main>
  );
}
