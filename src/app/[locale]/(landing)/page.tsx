import { Hero } from "@/components/landing/hero";
import { AnimatedStats } from "@/components/landing/animated-stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { RankingPreview } from "@/components/landing/ranking-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <AnimatedStats />
      <HowItWorks />
      <RankingPreview />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
}
