'use client';

import { useState } from 'react';
import Hero from './Hero';
import Stats from './Stats';
import SocialProof from './SocialProof';
import HowItWorks from './HowItWorks';
import WhyUs from './WhyUs';
import Comparison from './Comparison';
import Situations from './Situations';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import LeadForm from './LeadForm';
import FAQ from './FAQ';
import ServiceArea from './ServiceArea';

export default function HomeClient() {
  const [heroAddress, setHeroAddress] = useState('');

  const handleHeroSubmit = (address: string) => {
    setHeroAddress(address);
    setTimeout(() => {
      document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <>
      <Hero onAddressSubmit={handleHeroSubmit} />
      <Stats />
      <SocialProof />
      <HowItWorks />
      <WhyUs />
      <Comparison />
      <Situations onCTAClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} />
      <Testimonials />
      <CTABanner onCTAClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })} />
      <LeadForm initialAddress={heroAddress} />
      <FAQ />
      <ServiceArea />
    </>
  );
}
