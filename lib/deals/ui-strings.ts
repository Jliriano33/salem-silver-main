// Every fixed piece of text on a deal page, in both languages (goal NN). The type
// lives here; the words live in content/deals/_ui.ts, so copy changes never touch
// a component. Keys marked REVIEW are copy for Jefri to approve before publishing.

import type { InquiryErrorCode } from './inquiry';
import type { L10n } from './types';

export type DealUiStrings = {
  langToggle: { toEs: L10n; toEn: L10n }; // label of the link to the other language
  gallery: {
    comingSoon: L10n; // "Photo coming soon" / "Foto próximamente"
    open: L10n; // aria label, "Open photo {n} of {total}"
    close: L10n;
    next: L10n;
    prev: L10n;
    counter: L10n; // "{n} / {total}"
  };
  price: { heading: L10n; asking: L10n; assignmentFee: L10n };
  details: {
    heading: L10n;
    beds: L10n;
    baths: L10n;
    sqft: L10n;
    lotSize: L10n;
    yearBuilt: L10n;
    propertyType: L10n;
  };
  numbers: { heading: L10n; estimatedRepairs: L10n; arv: L10n; estimateNote: L10n };
  description: { heading: L10n };
  /** Shown text for any field that is still a placeholder on a preview build. */
  pending: L10n; // "To be announced"
  /** Listing-style layout (Nov 5): crumbs, status line, key facts, facts and features, side card. */
  listing: {
    crumbRoot: L10n; // "Investment properties"
    status: L10n; // "Assignment of contract"
    perSqft: L10n; // "per sq ft"
    seeAll: L10n; // "See all {total} photos"
    keyFacts: L10n;
    units: L10n;
    halfBaths: L10n;
    parking: L10n;
    basement: L10n;
    annualTaxes: L10n;
    assessedValue: L10n;
    factsHeading: L10n; // "Facts and features"
    interior: L10n;
    exterior: L10n;
    construction: L10n;
    conditionHeading: L10n; // "Property condition and systems"
    condition: {
      overall: L10n;
      occupancy: L10n;
      roofAge: L10n;
      heatingSystem: L10n;
      heatingAge: L10n;
      airConditioning: L10n;
      foundationType: L10n;
      foundationCondition: L10n;
      electrical: L10n;
      plumbing: L10n;
      waterHeater: L10n;
    };
    documents: L10n;
    requestDetails: L10n; // side-card button to the form
    call: L10n;
    pofLine: L10n; // "Proof of funds required"
  };
  /** REVIEW: assignment of contract, proof of funds, estimates to verify. */
  notice: { heading: L10n; body: L10n; short: L10n }; // short: one line under the price
  form: {
    heading: L10n;
    intro: L10n;
    firstName: L10n;
    lastName: L10n;
    email: L10n;
    phone: L10n;
    buyerType: L10n;
    buyerTypes: { cash: L10n; hard_money: L10n; other: L10n };
    pofReady: L10n;
    yes: L10n;
    no: L10n;
    message: L10n;
    optional: L10n;
    /** REVIEW: draft investor consent (the approved site consent is about selling a home). */
    consent: L10n;
    consentVersion: string;
    submit: L10n;
    sending: L10n;
    errorSummary: L10n;
    errors: Record<InquiryErrorCode, L10n>;
    thanksHeading: L10n;
    thanksBody: L10n;
  };
  footer: {
    tagline: L10n;
    phoneLabel: L10n;
    rights: L10n;
    privacy: L10n;
  };
};
