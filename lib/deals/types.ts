// The assignment-deal contract (goal NN). Every deal page is one content file in
// content/deals/<slug>.ts plus one photo folder in public/deals/<slug>/. The page,
// the gallery, the form and scripts/deal-check.mjs all read this shape and nothing
// else, so a new deal never needs a code change.
//
// Keep this file and the content files plain TypeScript with no enums:
// scripts/deal-check.mjs transpiles content files with the typescript package.

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

/** Localized text, or a placeholder until it is known. */
export type Text = L10n | Placeholder;

/** null hides the row on the page. Use it when a fact does not apply or Jefri prefers not to show it. */
export type Opt<T> = T | null;

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
    halfBaths: Opt<Num>;
    /** Number of units for 2-4 family buildings. */
    units: Opt<Num>;
    /** e.g. "Driveway, 2 spaces". */
    parking: Opt<Text>;
    /** e.g. "Full, unfinished". */
    basement: Opt<Text>;
    /** Public-record annual property tax, whole dollars. */
    annualTaxes: Opt<Money>;
    /** Public-record assessed value, whole dollars. */
    assessedValue: Opt<Money>;
  };

  /**
   * Property condition and systems, as an investor sees them (the InvestorLift
   * set plus electrical, plumbing and water heater). Ages are text so they can say
   * "8 years", "2015" or "Unknown". null hides a row.
   */
  condition: {
    /** Overall condition, e.g. "Major repair", "Cosmetic", "Turnkey". */
    overall: Text;
    occupancy: Text;
    roofAge: Opt<Text>;
    heatingSystem: Opt<Text>;
    heatingAge: Opt<Text>;
    airConditioning: Opt<Text>;
    foundationType: Opt<Text>;
    foundationCondition: Opt<Text>;
    electrical: Opt<Text>;
    plumbing: Opt<Text>;
    waterHeater: Opt<Text>;
  };

  numbers: {
    /** Low end of the repair estimate, or the single figure. */
    estimatedRepairs: Money;
    /** High end of a repair range. null shows estimatedRepairs alone. */
    estimatedRepairsHigh: Opt<Money>;
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

  /**
   * Optional files for investors in public/deals/<slug>/docs/ (inspection, permit
   * history). Never the purchase contract or any document about the sale or its parties.
   */
  documents: {
    label: L10n;
    file: string;
    /**
     * Set to true only after a person opened the file and confirmed it has no owner
     * or seller name, signature, phone, email or account number, and that its
     * metadata (PDF author and title) was stripped. deal:check refuses anything else.
     */
    reviewed: true;
  }[];

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
