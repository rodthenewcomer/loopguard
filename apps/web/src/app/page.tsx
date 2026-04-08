import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import RunsInBar from '../components/landing/RunsInBar';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ContextEngineSection from '../components/landing/ContextEngineSection';
import InstallSection from '../components/landing/InstallSection';
import RoadmapSection from '../components/landing/RoadmapSection';
import FaqSection from '../components/landing/FaqSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import SupportSection from '../components/landing/SupportSection';
import AgentSection from '../components/landing/AgentSection';
import LandingFooter from '../components/landing/LandingFooter';
import { JSON_LD } from '../lib/landingData';

export const metadata: Metadata = {
  title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
  description:
    'LoopGuard detects when AI-assisted coding sessions get stuck in repeat-fix loops and filters prompts to only the context that matters. Saves time, tokens, and money. Free VS Code extension.',
  openGraph: {
    title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
    description:
      'Detects repeat-fix loops and shrinks AI prompts before they hit the model. Free VS Code extension. Your code never leaves your machine.',
    type: 'website',
    url: 'https://loopguard.vercel.app',
    siteName: 'LoopGuard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
    description:
      'Detects repeat-fix loops and shrinks AI prompts before they hit the model. Free VS Code extension.',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071019]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Navbar />
      <HeroSection />
      <RunsInBar />
      <HowItWorksSection />
      <FeaturesSection />
      <ContextEngineSection />
      <InstallSection />
      <RoadmapSection />
      <FaqSection />
      <TestimonialsSection />
      <SupportSection />
      <AgentSection />
      <LandingFooter />
    </div>
  );
}
