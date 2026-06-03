import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HomeClient from '@/components/HomeClient';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Salem Silver Capital | We Buy Homes for Cash in MA, NH & RI',
  description:
    'Get a fair all-cash offer for your home within 24 hours. No fees, no repairs, no commissions. Salem Silver Capital buys homes as-is across Massachusetts, New Hampshire, and Rhode Island. Close in as little as 7 days.',
  alternates: { canonical: 'https://www.salemsilver.com' },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HomeClient />
      </main>
      <Footer />
    </>
  );
}
