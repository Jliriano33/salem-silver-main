'use client';

import { useEffect } from 'react';

/** The root layout hard-codes lang="en"; the Spanish deal page corrects it on mount. */
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
