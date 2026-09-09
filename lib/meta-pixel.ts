declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fire the Meta "Lead" standard event.
 *
 * Call this once, at the moment /api/lead answers OK. Do NOT also fire it on
 * /thank-you: the LP form lands there after submitting and that would count
 * every LP lead twice.
 *
 * Always pass content_category: 'salem_silver_seller'. The pixel is shared with
 * lirianorealty.com, and the custom conversion "Seller Lead - Salem Silver"
 * (1558948439065317) keys off that value to tell the two businesses apart.
 */
export function trackLead(params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead', params);
}

/** Fire a PageView. The base snippet already sends the first one. */
export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'PageView');
}
