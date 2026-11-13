'use client';

import { useRouter } from 'next/navigation';
import { savePrefill } from '@/lib/lead-handoff';
import Hero from './Hero';
import Stats from './Stats';
import SocialProof from './SocialProof';
import HowItWorks from './HowItWorks';
import WhyUs from './WhyUs';
import Comparison from './Comparison';
import Situations from './Situations';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import FAQ from './FAQ';
import ServiceArea from './ServiceArea';

export default function HomeClient() {
  const router = useRouter();

  // The address goes to the quiz in sessionStorage, never in the URL (F-004).
  const handleHeroSubmit = (address: string) => {
    savePrefill({ address });
    router.push('/cash-offer');
  };

  return (
    <>
      <Hero onAddressSubmit={handleHeroSubmit} />
      <Stats />
      <SocialProof />
      <HowItWorks />
      <WhyUs />
      <Comparison />
      <Situations onCTAClick={() => { window.location.href = '/cash-offer'; }} />
      <Testimonials />
      <CTABanner onCTAClick={() => { window.location.href = '/cash-offer'; }} />
      <FAQ />
      <ServiceArea />
    </>
  );
}
