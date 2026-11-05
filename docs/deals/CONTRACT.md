# Assignment-deal pages: the contract (goal NN)

Committed before any parallel work. Builders build against this file and do not change it;
a needed change goes back to the lead.

## Routes

| Path | What |
|---|---|
| `/deals/<slug>` | English deal page (static, one per routable deal) |
| `/es/deals/<slug>` | Spanish deal page. The site has no locale system yet, so `/es/...` is a plain route segment. The page wraps its content in `lang="es"` and sets `document.documentElement.lang` on load. |
| `POST /api/deals/inquiry` | Investor form delivery (edge runtime). Body: `InquiryPayload` in `lib/deals/inquiry.ts`. Reply: `InquiryResponse`. |

No `/deals` index (out of scope). Deal pages are not added to `app/sitemap.ts`.

## Content

- One file per deal: `content/deals/<slug>.ts`, default export of type `Deal` (`lib/deals/types.ts`).
  The file name equals `slug`. Files starting with `_` are not deals.
- Fixed page text, EN and ES: `content/deals/_ui.ts`, default export of type `DealUiStrings`
  (`lib/deals/ui-strings.ts`).
- `lib/deals/registry.ts` finds deal files with `require.context`; no import list to edit.
- Draft vs published: `published: false` pages build on previews only. Production
  (Cloudflare branch `main`) leaves drafts out, and its build fails if a published deal has a placeholder.

## Placeholder rules

- An unknown value is the literal string `PLACEHOLDER_<FIELD>`, for example `PLACEHOLDER_PRICE`.
- On a page, any placeholder value renders as the `pending` string ("To be announced" / "Por anunciar").
  A placeholder string is never shown raw.
- `npm run deal:check <slug>` exits 1 and lists every placeholder (by field path) and every missing
  photo file; exits 0 when none remain. `--all` checks every deal. `npm run build` runs
  `deal:check --build`, which fails only on published deals during a production build.
- The check script must not depend on Node's type stripping (Cloudflare's build image may run an
  older Node). It transpiles the content file with the `typescript` package already in devDependencies.

## Photos

- Folder: `public/deals/<slug>/`. Names `01.jpg`, `02.jpg` ... in display order; the content file's
  `photos` list names them. The first photo is the hero and the Open Graph image.
- At build, a listed file that is missing renders as a neutral grey frame labelled
  "Photo coming soon" / "Foto próximamente" (`lib/deals/photos.ts`, server only).
- Alt text describes the room or view only.

## Sections, in page order

1. Header: Salem Silver Capital logo, language toggle (EN <-> ES link to the same deal).
2. Photo gallery: hero + grid + full-screen lightbox (keyboard: Esc, Left, Right; swipe on touch).
3. Address.
4. Price block: asking (assignment) price; assignment fee line only when not null. Assignment notice short form directly under the price.
5. Property details: beds, baths, sq ft, lot size, year built, property type.
6. Deal numbers: estimated repairs, ARV, with the "estimates, verify" note. No spread, no profit.
7. Description.
8. Assignment notice (full) directly above the form.
9. Investor contact form.
10. Footer: Salem Silver Capital contact only: (617) 714-2020, privacy policy link. Nothing from Liriano Realty.

## Investor form and GoHighLevel

- Fields: first name, last name, email, phone, buyer type (`cash` / `hard_money` / `other`), proof of
  funds ready (`yes` / `no`), message (optional, max 2000), language (from the page locale), consent
  checkbox (required), honeypot `company` (hidden).
- Validation: `validateInquiry` in `lib/deals/inquiry.ts` runs in the browser and again in the route.
  Errors come back as codes; the form shows the EN or ES text from `_ui.ts` and keeps what was typed.
- Delivery (route): GHL v2 `POST /contacts/upsert` WITHOUT tags (upsert replaces tags, SS-1 F-056),
  then `POST /contacts/{id}/tags` with `salem-silver-investor`, the deal tag and the language tag
  (`investor-english` or `investor-spanish`), then `POST /contacts/{id}/notes` with buyer type,
  proof of funds, message, deal and consent version. Contact `source` = the deal's `ghl.source`.
- Env (server only, never in code): `GHL_DEALS_TOKEN`, `GHL_DEALS_LOCATION_ID`; tests may set
  `GHL_DEALS_BASE_URL` to a local echo server. The route never logs the token or the request body.
- No GHL workflows, pipelines or automations are created by this work.

## SEO

Per language: `<title>`, meta description, Open Graph image = first photo (or the placeholder frame
image `public/deals/_placeholder-og.png`). `robots: noindex, nofollow` unless `indexable: true`.
`alternates.languages` links the EN and ES pages.

## Privacy

Nothing about the seller or the sale anywhere: no seller name or contact, reason for sale, contract
dates or contract price, in the page, metadata, alt text, structured data, file names or comments.

## File ownership

| Owner | Files |
|---|---|
| Lead (contract) | `lib/deals/types.ts`, `lib/deals/inquiry.ts`, `lib/deals/ui-strings.ts`, `lib/deals/registry.ts`, `lib/deals/photos.ts`, `next.config.mjs`, `package.json`, this file |
| W1 (UI) | `app/deals/**`, `app/es/deals/**`, `components/deals/*` except `InvestorForm.tsx`, `app/deals/deals.css` if needed, `public/deals/_placeholder-og.png` |
| W2 (content) | `content/deals/*`, `scripts/deal-check.mjs`, `docs/deals/README.md` |
| W3 (lead, form) | `components/deals/InvestorForm.tsx`, `app/api/deals/inquiry/route.ts`, `lib/deals/ghl.ts`, `tests/deals-*.spec.ts` |

`InvestorForm` props: `{ slug: string; locale: Locale; ui: DealUiStrings }`. W1 renders it in
section 9 and may stub it until W3 merges.
