'use client';

import { useEffect, useState } from 'react';
import { readPrefill } from '@/lib/lead-handoff';

// The LP form hands the address over in sessionStorage, not in the URL (F-004).
export default function ThankYouAddress() {
  const [address, setAddress] = useState('');
  useEffect(() => { setAddress(readPrefill().address ?? ''); }, []);
  if (!address) return null;
  return (
    <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg px-5 py-3 mb-5 inline-block">
      <p className="text-brand-blue text-sm font-medium">
        Property: <span className="font-bold">{address}</span>
      </p>
    </div>
  );
}
