# SS-2 consent tests
npm run build
npx playwright test -c tests/playwright.config.ts

The Next server's output is written to `$TMPDIR/ss2-next-server.log`; `log-hygiene.spec.ts` reads it to check
that `/api/lead` never logs the webhook URL or its path (F-050), including when n8n answers 404 with the path in
the message (the echo server's `POST /mode {"next":"n8n-404"}`). A second server on port 3101 has a malformed
webhook URL, so fetch throws an error that carries the URL; its output goes to `$TMPDIR/ss2-next-server-bad-url.log`.
Ports 3100, 3101 and 3199 must be free.
