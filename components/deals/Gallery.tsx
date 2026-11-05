'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type GalleryPhoto = { src: string | null; alt: string };

export type GalleryLabels = {
  comingSoon: string;
  open: string; // contains {n} and {total}
  close: string;
  next: string;
  prev: string;
  counter: string; // contains {n} and {total}
};

const fill = (tpl: string, n: number, total: number) =>
  tpl.replace('{n}', String(n)).replace('{total}', String(total));

function Frame({
  photo,
  label,
  eager,
  className,
  fit = 'cover',
}: {
  photo: GalleryPhoto;
  label: string;
  eager?: boolean;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  if (!photo.src) {
    return (
      <div
        className={`flex items-center justify-center bg-[#e5e7eb] px-2 text-center text-sm font-medium text-gray-700 ${className ?? ''}`}
        role="img"
        aria-label={photo.alt}
      >
        {label}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      alt={photo.alt}
      width={1600}
      height={1200}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className ?? ''}`}
    />
  );
}

export default function Gallery({ photos, labels }: { photos: GalleryPhoto[]; labels: GalleryLabels }) {
  const total = photos.length;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    const el = triggerRef.current;
    if (el) setTimeout(() => el.focus(), 0);
  }, []);

  const go = useCallback(
    (d: number) => setOpenIndex((i) => (i === null ? i : (i + d + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab') {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, go]);

  if (total === 0) return null;

  const btn =
    'inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div>
      <button
        type="button"
        onClick={(e) => open(0, e.currentTarget)}
        aria-label={fill(labels.open, 1, total)}
        className="block w-full overflow-hidden rounded-xl bg-[#e5e7eb] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      >
        <Frame photo={photos[0]} label={labels.comingSoon} eager className="aspect-[4/3] w-full sm:aspect-[16/10]" />
      </button>

      {total > 1 && (
        <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {photos.slice(1).map((p, k) => {
            const i = k + 1;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={(e) => open(i, e.currentTarget)}
                  aria-label={fill(labels.open, i + 1, total)}
                  className="block w-full overflow-hidden rounded-lg bg-[#e5e7eb] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <Frame photo={p} label={labels.comingSoon} className="aspect-[4/3] w-full !text-xs" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {openIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={fill(labels.counter, openIndex + 1, total)}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-sm tabular-nums" aria-live="polite" data-testid="lightbox-counter">
              {fill(labels.counter, openIndex + 1, total)}
            </p>
            <button ref={closeRef} type="button" onClick={close} aria-label={labels.close} className={btn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16">
            <Frame
              photo={photos[openIndex]}
              label={labels.comingSoon}
              fit="contain"
              className="max-h-full max-w-full min-h-[12rem] min-w-[12rem]"
            />
            {total > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className={`${btn} absolute left-2 top-1/2 -translate-y-1/2 !bg-black/50`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button type="button" onClick={() => go(1)} aria-label={labels.next} className={`${btn} absolute right-2 top-1/2 -translate-y-1/2 !bg-black/50`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
