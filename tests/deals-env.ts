import os from 'node:os';
import path from 'node:path';

// Shared by deals.playwright.config.ts and the deal specs: the local Next server's output goes here.
export const DEALS_SERVER_LOG = path.join(os.tmpdir(), 'nn-deals-server.log');
