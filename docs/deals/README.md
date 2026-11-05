# How to publish a new deal

Paste this whole page to Claude Code when you want a new assignment deal page. Each deal is one
content file plus one photo folder. No code changes are needed.

## Steps

1. Copy `content/deals/65-Woodland-St-Lawrence-MA.ts` to `content/deals/<new-slug>.ts`. The file name must equal the slug, which is the live URL segment exactly, case included (letters, digits and hyphens, for example `12-Main-St-Lowell-MA` for salemsilver.com/deals/12-Main-St-Lowell-MA). Links typed in another case redirect to it. The photo folder uses the same spelling.
2. Set `slug` to the new slug. Set `ghl.dealTag` (for example `assignment-12-main-st`) and `ghl.source` (for example `Deal page 12 Main St`).
3. Fill every field. An unknown value stays as its `PLACEHOLDER_*` string until it arrives:
   - `address`: street, city, state, zip
   - `price.asking` and `price.assignmentFee` (use `null` for the fee to hide that line)
   - `details`: beds, baths, sqft, lotSize (EN and ES), yearBuilt, propertyType (EN and ES), halfBaths, units, parking, basement, annualTaxes, assessedValue (any of the last six can be `null` to hide the row)
   - `condition`: overall condition and occupancy (required), then roofAge, heatingSystem, heatingAge, airConditioning, foundationType, foundationCondition, electrical, plumbing, waterHeater (each EN and ES text such as "8 years" or "Unknown", or `null` to hide)
   - `numbers`: estimatedRepairs, estimatedRepairsHigh (the top of a range, or `null` for one figure), arv (leave `showSpread: false`)
   - `documents`: optional files in `public/deals/<slug>/docs/` with an EN and ES label (an inspection or permit history; never the purchase contract or anything about the sale). Anything in `public/` can be downloaded by anyone with its address, even before the deal is published. Before adding a file, a person opens it and checks every page for an owner or seller name, signature, phone, email or account number, redacts what it finds, strips the PDF metadata (author, title), and only then sets `reviewed: true` on that entry. `deal:check` refuses a document without it.
   - `description` (EN and ES)
   - `photos`: one entry per file, with neutral alt text in EN and ES
   - `seo.title` and `seo.description` (EN and ES)
4. Drop the photos in `public/deals/<slug>/` named `01.jpg`, `02.jpg`, and so on, in display order. The first photo is the hero and the share image.
5. Run `npm run deal:check <slug>` until it prints `READY: <slug>`. It lists every placeholder by field path and every photo file that is missing.
6. Set `published: true`. Decide `indexable`: `false` keeps the page out of search engines (the default), `true` allows indexing.
7. Deploy. A push to `main` is production on Cloudflare Pages. Any other branch is a preview.

## What the build does

- `npm run build` runs `node scripts/deal-check.mjs --build` first.
- Production (Cloudflare branch `main`): every deal with `published: true` must pass the check or the build fails. Drafts are skipped and not built.
- Any other branch: the build reports every deal's status and never fails because of an unfinished deal. Drafts show on previews, with "To be announced" in place of any placeholder.
- `npm run deal:check -- --all` checks every deal.
- The check also prints WARN lines if a deal file contains words such as "seller", "divorce", "probate", "foreclosure", "contract date" or "paid". These do not fail the check. A person must read each one.

## Privacy rule

Nothing about the seller or the sale goes anywhere on the page. That means no seller name or contact, no reason for the sale, no contract dates, no contract price paid, and no personal detail about the sale. This covers the description, alt text, SEO text, file names and code comments. Only send facts about the property.

## The spread

The page does not show a spread or profit. It stays off (`showSpread: false`) until Jefri approves a formula.

## Tomorrow: publish 65 Woodland St

The file `content/deals/65-Woodland-St-Lawrence-MA.ts` is already in place as a draft (`published: false`, `indexable: false`) with 10 photo slots listed. Jefri sends these values:

- [ ] Asking price (the assignment price buyers pay)
- [ ] Assignment fee, only if it should be shown (otherwise it is hidden)
- [ ] Beds
- [ ] Baths
- [ ] Square feet
- [ ] Lot size (for example "0.18 acres")
- [ ] Year built
- [ ] Property type (for example single-family or 2-family)
- [ ] Estimated repairs (one figure, or a low and high range)
- [ ] ARV
- [ ] Half baths, units (for 2-4 family), parking, basement, annual taxes, assessed value (say "hide" for any you do not want shown)
- [ ] Property condition (for example major repair, cosmetic, turnkey) and occupancy (vacant, owner-occupied, tenant-occupied)
- [ ] Roof age, heating system and its age, air conditioning, foundation type and condition, electrical, plumbing, water heater ("Unknown" is fine; "hide" removes the row)
- [ ] Any documents to attach (optional)
- [ ] Description, in English and Spanish, or in English only and Claude translates it for review
- [ ] Photos, 10 files in display order, named `01.jpg` to `10.jpg` (if there are fewer or more, tell Claude so the photo list matches)
- [ ] Decision on `indexable` (default: not indexed)
- [ ] Approval of the notice text and the investor consent text in `content/deals/_ui.ts` (both are marked "COPY FOR JEFRI REVIEW" and the consent is a draft)

Remember the privacy rule above: send nothing about the seller or the sale.

Then Claude fills the file, puts the photos in `public/deals/65-Woodland-St-Lawrence-MA/`, runs `npm run deal:check 65-Woodland-St-Lawrence-MA` until `READY`, sets `published: true`, and the page goes live when the change is pushed to `main`.
