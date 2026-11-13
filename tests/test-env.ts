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

// The main test server. 3100 is often taken on this Mac by another project, so SS-3 moved it.
export const MAIN_SERVER = 'http://127.0.0.1:3110';

// A third server with the intake secret set, as production will be after GO-K (F-044b). The value is a
// made-up marker so the log test can search for it.
export const LOCKED_SERVER = 'http://127.0.0.1:3102';
export const INTAKE_SECRET = 'ss3-test-intake-secret-5c1d8e';
export const INTAKE_HEADER = 'x-salem-intake-key';
export const LOCKED_SERVER_LOG = path.join(os.tmpdir(), 'ss3-next-server-locked.log');
