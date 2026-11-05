// Server-only photo lookup for deal pages, run at build time.
import fs from 'node:fs';
import path from 'node:path';

/** True when public/deals/<slug>/<file> exists. Missing photos render as placeholder frames. */
export function photoExists(slug: string, file: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', 'deals', slug, file));
}
