# SS-2 consent tests
npm run build
npx playwright test -c tests/playwright.config.ts

The Next server's output is written to `$TMPDIR/ss2-next-server.log`; `log-hygiene.spec.ts` reads it to check
that `/api/lead` never logs the webhook URL (F-050).
