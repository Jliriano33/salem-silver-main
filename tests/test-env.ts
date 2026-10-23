import os from 'node:os';
import path from 'node:path';

// Shared by the Playwright config and the specs.
// The route forwards leads here (the local echo server, never n8n).
export const WEBHOOK_URL = 'http://127.0.0.1:3199/hook';
// The local Next server's stdout and stderr go here, so a spec can read what /api/lead logs.
export const SERVER_LOG = path.join(os.tmpdir(), 'ss2-next-server.log');
