'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView } from '@/lib/meta-pixel';

// The Liriano Team's Pixel, shared with lirianorealty.com. Meta allows one
// dataset per ad account, so Salem Silver cannot have its own; the custom
// conversion "Seller Lead - Salem Silver" separates the two by content_category.
//
// Hard-coded on purpose. A pixel id ships in the HTML to every visitor, so it is
// not a secret, and keeping it in the source means a deploy needs nothing but a
// push. NEXT_PUBLIC_META_PIXEL_ID still overrides it when we need to point a
// build somewhere else.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '109869655523147';

export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!PIXEL_ID) return;
    // The base snippet below already sent the PageView for the first render.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      {/* The host check keeps localhost and *.pages.dev previews out of the
          dataset. It is shared with lirianorealty.com and drives ad delivery,
          so test traffic in it is not harmless. */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`if (/(^|\\.)salemsilver\\.com$/.test(location.hostname)) {
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
}`}
      </Script>
      {/* No <noscript> fallback on purpose. Next preloads the image inside it,
          and the browser fetches that preload even with scripting on, which
          sends a PageView from localhost and from previews, straight past the
          host check above. It would buy us nothing anyway: every conversion
          path here (the quiz, the LP form, the router) needs JavaScript, so a
          visitor without it cannot convert. */}
    </>
  );
}
