'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
}

const STATE_ABBR: Record<string, string> = {
  Massachusetts: 'MA', 'New Hampshire': 'NH', 'Rhode Island': 'RI',
  Connecticut: 'CT', Maine: 'ME', Vermont: 'VT', 'New York': 'NY',
};

function formatAddress(r: NominatimResult): string {
  const a = r.address;
  const num = a.house_number ?? '';
  const street = a.road ?? '';
  const city = a.city ?? a.town ?? a.village ?? '';
  const state = STATE_ABBR[a.state ?? ''] ?? a.state ?? '';
  const zip = a.postcode?.split('-')[0] ?? '';
  if (!num && !street) return r.display_name;
  return [
    [num, street].filter(Boolean).join(' '),
    city,
    [state, zip].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  inputClassName?: string;
  placeholder?: string;
  'aria-label'?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  inputClassName = '',
  placeholder = 'Enter your property address...',
  'aria-label': ariaLabel,
  id,
  name,
  required,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 4) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    try {
      const params = new URLSearchParams({
        q: query + ' USA',
        format: 'json',
        addressdetails: '1',
        limit: '6',
        countrycodes: 'us',
        'accept-language': 'en',
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { 'User-Agent': 'SalemSilverCapital/1.0' } }
      );
      const data: NominatimResult[] = await res.json();
      // Only keep results that have a road (actual addresses, not just cities)
      const formatted = data
        .filter((r) => r.address.road)
        .map(formatAddress)
        .filter((v, i, arr) => arr.indexOf(v) === i); // dedupe
      setSuggestions(formatted);
      setOpen(formatted.length > 0);
      setActiveIdx(-1);
    } catch {
      setSuggestions([]);
      setOpen(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const select = (addr: string) => {
    onChange(addr);
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={open}
        required={required}
        className={inputClassName}
      />
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((addr, i) => (
            <li
              key={addr}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); select(addr); }}
              className={`px-4 py-2.5 text-sm cursor-pointer text-gray-800 leading-snug ${
                i === activeIdx ? 'bg-blue-50 text-brand-blue font-medium' : 'hover:bg-gray-50'
              }`}
            >
              {addr}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
