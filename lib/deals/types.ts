// The assignment-deal contract (goal NN). Every deal page is one content file in
// content/deals/<slug>.ts plus one photo folder in public/deals/<slug>/. The page,
// the gallery, the form and scripts/deal-check.mjs all read this shape and nothing
// else, so a new deal never needs a code change.
//
// This file must stay erasable TypeScript (types only, no enums, no runtime code):
// scripts/deal-check.mjs imports content files with Node's built-in type stripping.

export type Locale = 'en' | 'es';

/** One string per language. Both are required on every field. */
export type L10n = { en: string; es: string };

/**
 * A value that is not known yet. Write it as the literal string `PLACEHOLDER_<FIELD>`
 * (for example 'PLACEHOLDER_PRICE'). deal:check fails while any string anywhere in
 * the content file starts with PLACEHOLDER_ or any listed photo file is missing.
 */
export type Placeholder = `PLACEHOLDER_${string}`;

/** Whole US dollars, or a placeholder. Formatting happens in the page. */
export type Money = number | Placeholder;

/** A count or measure, or a placeholder. */
export type Num = number | Placeholder;

export type DealPhoto = {
  /** File name inside public/deals/<slug>/, named 01.jpg, 02.jpg ... in display order. */
  file: string;
  /** Describes the room or view only. Never a person, the seller or the sale. */
  alt: L10n;
};

export type Deal = {
  /** URL segment: /deals/<slug> and /es/deals/<slug>. Must equal the file name. */
  slug: string;
  /**
   * false: preview builds only. The production build (Cloudflare branch main) leaves
   * the page out entirely, and refuses to build if a published deal still has a
   * placeholder. Flip to true only after deal:check passes.
   */
  published: boolean;
  /** noindex unless Jefri decides otherwise at publish time. */
  indexable: boolean;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  /** Asking price to the end buyer (the assignment price). */
  price: {
    asking: Money;
    /** Optional second line, for example the assignment fee if Jefri wants it shown. Null hides it. */
    assignmentFee: Money | null;
  };

  details: {
    beds: Num;
    baths: Num;
    sqft: Num;
    /** Free text so it can be acres or square feet, e.g. "0.18 acres". Localized. */
    lotSize: L10n | Placeholder;
    yearBuilt: Num;
    /** e.g. "Single-family", "2-family". Localized. */
    propertyType: L10n | Placeholder;
  };

  numbers: {
    estimatedRepairs: Money;
    arv: Money;
    /**
     * Spread display stays off until Jefri approves a formula. The page never
     * calculates or shows profit on its own.
     */
    showSpread: false;
  };

  /** Short description, plain text, one or two paragraphs per language. */
  description: L10n | Placeholder;

  photos: DealPhoto[];

  seo: {
    title: L10n;
    description: L10n;
  };

  /** Contact fields written to GoHighLevel for this deal. */
  ghl: {
    /** Deal tag, e.g. "assignment-65-woodland-st". */
    dealTag: string;
    /** Contact source, e.g. "Deal page 65 Woodland St". */
    source: string;
  };
};
