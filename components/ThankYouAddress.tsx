'use client';

import { useEffect, useRef, useState } from 'react';
import { takePrefill } from '@/lib/lead-handoff';

// The LP form hands the address over in sessionStorage, not in the URL (F-004).
export default function ThankYouAddress() {
  const [address, setAddress] = useState('');
  const taken = useRef(false);
  useEffect(() => {
    if (taken.current) return; // once, even when development mode runs this effect twice
    taken.current = true;
    setAddress(takePrefill().address ?? '');
  }, []);
  if (!address) return null;
  return (
    <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg px-5 py-3 mb-5 inline-block">
      <p className="text-brand-blue text-sm font-medium">
        Property: <span className="font-bold">{address}</span>
      </p>
    </div>
  );
}
