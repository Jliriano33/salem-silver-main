'use client';

import { useRouter } from 'next/navigation';
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

  const handleHeroSubmit = (address: string) => {
    router.push(`/cash-offer?address=${encodeURIComponent(address)}`);
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
