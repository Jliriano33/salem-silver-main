import { NextResponse, type NextRequest } from 'next/server';
import { routableDeals } from '@/lib/deals/registry';

// Deal URLs are case-sensitive (salemsilver.com/deals/65-Woodland-St-Lawrence-MA).
// A link typed in another case gets a permanent redirect to the exact spelling
// instead of a 404. Runs only on deal paths.
export function middleware(req: NextRequest) {
  const m = req.nextUrl.pathname.match(/^(\/es)?\/deals\/([^/]+)\/?$/);
  if (!m) return NextResponse.next();
  const [, es = '', asked] = m;
  const deal = routableDeals().find((d) => d.slug.toLowerCase() === asked.toLowerCase());
  if (!deal || deal.slug === asked) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `${es}/deals/${deal.slug}`;
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: ['/deals/:slug*', '/es/deals/:slug*'] };
