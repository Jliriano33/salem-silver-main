import os from 'node:os';
import path from 'node:path';

// Shared by the Playwright config and the specs.
// A made-up stand-in for the secret part of the real webhook path, so the log tests can search for it.
export const SECRET_MARK = 'ss-test-secret-7f3a9c';
// The route forwards leads here (the local echo server, never n8n).
export const WEBHOOK_URL = `http://127.0.0.1:3199/hook/${SECRET_MARK}`;
// The local Next server's stdout and stderr go here, so a spec can read what /api/lead logs.
export const SERVER_LOG = path.join(os.tmpdir(), 'ss2-next-server.log');

// A second server whose webhook URL is malformed (no colon after http), so fetch throws an error that
// carries the URL. It shows whether the route's catch block writes that error to the log.
export const BAD_SERVER = 'http://127.0.0.1:3101';
export const BAD_WEBHOOK_URL = `http//127.0.0.1:3199/hook/${SECRET_MARK}`;
export const BAD_SERVER_LOG = path.join(os.tmpdir(), 'ss2-next-server-bad-url.log');
