import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    // Deal pages (goal NN): drafts are left out of production builds. Inlined at
    // build time because the edge runtime cannot read CF_PAGES_BRANCH.
    DEALS_PRODUCTION_BUILD: process.env.CF_PAGES_BRANCH === 'main' ? '1' : '0',
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
