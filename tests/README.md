# SS-2 consent tests
npm run build
npx playwright test -c tests/playwright.config.ts

The Next server's output is written to `$TMPDIR/ss2-next-server.log`; `log-hygiene.spec.ts` reads it to check
that `/api/lead` never logs the webhook URL or its path (F-050), including when n8n answers 404 with the path in
the message (the echo server's `POST /mode {"next":"n8n-404"}`). A second server on port 3101 has a malformed
webhook URL, so fetch throws an error that carries the URL; its output goes to `$TMPDIR/ss2-next-server-bad-url.log`.
SS-3 moved the main server to port 3110 (3100 is often taken on this Mac) and added a third server on 3102 with
`N8N_WEBHOOK_SECRET` set, for the intake secret header (F-044b); its output goes to `$TMPDIR/ss3-next-server-locked.log`.
Ports 3110, 3101, 3102 and 3199 must be free.
