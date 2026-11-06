import type { Deal } from '../../lib/deals/types';

// 33 Huntington Ave, Methuen, MA 01844. Assignment of contract (Jefri, 2026-11-06).
// Facts marked "Zillow" come from the public Zillow record for this address, read
// 2026-11-06 (zpid 56087702). They are public-record data, not an inspection: confirm
// them before publishing. Price, fee, repairs, ARV, condition, occupancy, description
// come from Jefri. Do not guess any PLACEHOLDER_ value. The Zillow listing photos are used with
// Jefri's permission (2026-11-06); no Zillow description, sale history or Zestimate is used.
// Systems facts marked "MLS" come from the MLS PIN listing of June 2026 (#73532932), read
// 2026-11-06: facts only, no remarks, photos, prices or dates from that listing.
const deal: Deal = {
  // The live address will be salemsilver.com/deals/33-Huntington-Ave-Methuen-MA.
  slug: '33-Huntington-Ave-Methuen-MA',
  // Published by Jefri 2026-11-06, with unknown values shown as "To be announced" (allowPending).
  published: true,
  allowPending: true,
  indexable: true,
  address: { street: '33 Huntington Ave', city: 'Methuen', state: 'MA', zip: '01844' },
  price: { asking: 300000 /* Jefri, 2026-11-06 */, assignmentFee: 5000 /* Jefri, 2026-11-06 */ },
  details: {
    beds: 2, // Zillow
    baths: 1, // Zillow
    sqft: 1279, // Zillow
    lotSize: { en: '7,200 sq ft', es: '7,200 pies²' }, // Zillow
    yearBuilt: 1910, // Zillow
    propertyType: { en: 'Single-family', es: 'Unifamiliar' }, // Zillow
    // Set any of these to null to hide the row.
    halfBaths: null, // Zillow: none
    units: null, // single-family
    parking: { en: '4 spaces, paved driveway', es: '4 espacios, entrada pavimentada' }, // MLS
    basement: { en: 'None', es: 'No tiene' }, // Zillow
    annualTaxes: 3821, // Zillow, 2025
    assessedValue: 361200, // Zillow
  },
  // Condition and systems. Text values, e.g. { en: 'Major repair', es: 'Reparación mayor' }.
  // "Unknown" / "Desconocido" is a fine answer; null hides the row.
  condition: {
    overall: { en: 'Major repair', es: 'Reparación mayor' }, // Jefri, 2026-11-06
    occupancy: 'PLACEHOLDER_OCCUPANCY',
    roofAge: 'PLACEHOLDER_ROOF_AGE',
    heatingSystem: { en: 'Hot-water baseboard, oil', es: 'Zócalo de agua caliente, aceite (oil)' }, // MLS
    heatingAge: 'PLACEHOLDER_HEATING_AGE',
    airConditioning: { en: 'None', es: 'No tiene' }, // Zillow
    foundationType: { en: 'Slab', es: 'Losa' }, // Zillow
    foundationCondition: 'PLACEHOLDER_FOUNDATION_CONDITION',
    electrical: { en: '100 amps', es: '100 amperios' }, // MLS
    // Jefri chose to disclose the failed Title V (2026-11-06).
    plumbing: {
      en: "City water; private septic that failed its Title V inspection (buyer's responsibility)",
      es: 'Agua de la ciudad; séptico privado que falló la inspección Title V (responsabilidad del comprador)',
    }, // MLS
    waterHeater: { en: 'Tankless', es: 'Sin tanque' }, // Zillow
  },
  // Jefri, 2026-11-06: one repair figure (no range), ARV, assignment fee above.
  numbers: { estimatedRepairs: 100000, estimatedRepairsHigh: null, arv: 500000, showSpread: false },
  description: 'PLACEHOLDER_DESCRIPTION',
  // Photos: the 5 listing photos from the public Zillow page (zpid 56087702), used with
  // permission Jefri confirmed on 2026-11-06. Taken from an earlier listing, so they may not
  // show today's condition. 1024px is the largest size Zillow serves; metadata stripped.
  photos: [
    { file: '01.jpg', alt: { en: 'House and yard', es: 'Casa y patio' } },
    { file: '02.jpg', alt: { en: 'Kitchen and dining area', es: 'Cocina y área de comedor' } },
    { file: '03.jpg', alt: { en: 'Dining area', es: 'Área de comedor' } },
    { file: '04.jpg', alt: { en: 'Kitchen', es: 'Cocina' } },
    { file: '05.jpg', alt: { en: 'Enclosed entry porch', es: 'Porche de entrada cerrado' } },
  ],
  // Optional files in public/deals/33-Huntington-Ave-Methuen-MA/docs/. Never the purchase contract or any document about the sale or its parties.
  documents: [],
  seo: {
    title: {
      en: '33 Huntington Ave, Methuen, MA 01844 | Investment Property | Salem Silver Capital',
      es: '33 Huntington Ave, Methuen, MA 01844 | Propiedad de inversión | Salem Silver Capital',
    },
    description: {
      en: '33 Huntington Ave, Methuen, MA 01844: an investment property offered as an assignment of contract by Salem Silver Capital.',
      es: '33 Huntington Ave, Methuen, MA 01844: una propiedad de inversión ofrecida como cesión de contrato por Salem Silver Capital.',
    },
  },
  ghl: { dealTag: 'assignment-33-huntington-ave', source: 'Deal page 33 Huntington Ave' },
};

export default deal;
