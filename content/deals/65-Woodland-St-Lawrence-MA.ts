import type { Deal } from '../../lib/deals/types';

// 65 Woodland St, Lawrence, MA 01841. Assignment of contract.
// Facts marked "Zillow" come from the public Zillow record (zpid 59234070, read 2026-11-06):
// public-record data, not an inspection; confirm before publishing. Price is Jefri's.
// No Zillow photos, description, sale history or Zestimate are used. Do not guess any PLACEHOLDER_ value.
// Alt text stays neutral until the photos are reviewed.
const deal: Deal = {
  // The live address is salemsilver.com/deals/65-Woodland-St-Lawrence-MA (Jefri, 2026-11-05).
  slug: '65-Woodland-St-Lawrence-MA',
  // Published by Jefri 2026-11-06, with unknown values shown as "To be announced" (allowPending).
  published: true,
  allowPending: true,
  indexable: true,
  address: { street: '65 Woodland St', city: 'Lawrence', state: 'MA', zip: '01841' },
  price: { asking: 499000, assignmentFee: 'PLACEHOLDER_ASSIGNMENT_PRICE' },
  details: {
    beds: 4, // Zillow
    baths: 1, // Zillow
    sqft: 1360, // Zillow
    lotSize: { en: '10,018 sq ft', es: '10,018 pies²' }, // Zillow
    // Zillow lists 1800, a value assessors often use when the year is unknown. Confirm the real year.
    yearBuilt: 'PLACEHOLDER_YEAR_BUILT',
    propertyType: { en: 'Single-family', es: 'Unifamiliar' }, // Zillow
    // Set any of these to null to hide the row.
    halfBaths: null, // Zillow: none
    units: null, // single-family
    // Zillow says parking "Other" and garage "None", but the photos show a driveway and a detached garage.
    parking: { en: 'Driveway and detached garage', es: 'Entrada de autos y garaje separado' }, // photos 04, 16
    // Zillow says "None". Confirm before publishing.
    basement: 'PLACEHOLDER_BASEMENT',
    annualTaxes: 3927, // Zillow, 2025
    assessedValue: 446300, // Zillow
  },
  // Condition and systems. Text values, e.g. { en: 'Major repair', es: 'Reparación mayor' }.
  // "Unknown" / "Desconocido" is a fine answer; null hides the row.
  condition: {
    overall: 'PLACEHOLDER_CONDITION',
    occupancy: 'PLACEHOLDER_OCCUPANCY',
    roofAge: 'PLACEHOLDER_ROOF_AGE',
    heatingSystem: { en: 'Oil, radiators', es: 'Aceite (oil), radiadores' }, // Zillow (oil); radiators in photos 05, 10-12
    heatingAge: 'PLACEHOLDER_HEATING_AGE',
    airConditioning: { en: 'None', es: 'No tiene' }, // Zillow
    foundationType: 'PLACEHOLDER_FOUNDATION_TYPE',
    foundationCondition: 'PLACEHOLDER_FOUNDATION_CONDITION',
    electrical: 'PLACEHOLDER_ELECTRICAL',
    plumbing: 'PLACEHOLDER_PLUMBING',
    waterHeater: 'PLACEHOLDER_WATER_HEATER',
  },
  numbers: { estimatedRepairs: 'PLACEHOLDER_REPAIRS', estimatedRepairsHigh: 'PLACEHOLDER_REPAIRS_HIGH', arv: 'PLACEHOLDER_ARV', showSpread: false },
  description: 'PLACEHOLDER_DESCRIPTION',
  // Photos from Jefri's Drive folder (2026-11-06): converted from HEIC, resized to 1600px,
  // metadata (GPS) stripped, reviewed for people and papers. Alt text describes the view only.
  photos: [
    { file: '01.jpg', alt: { en: 'Front of the house', es: 'Frente de la casa' } },
    { file: '02.jpg', alt: { en: 'Front of the house from the street', es: 'Frente de la casa desde la calle' } },
    { file: '03.jpg', alt: { en: 'Front and side of the house', es: 'Frente y lateral de la casa' } },
    { file: '04.jpg', alt: { en: 'Side of the house and driveway', es: 'Lateral de la casa y entrada de autos' } },
    { file: '05.jpg', alt: { en: 'Front room with bay windows', es: 'Sala del frente con ventanal' } },
    { file: '06.jpg', alt: { en: 'Front hall and stairs', es: 'Recibidor y escalera' } },
    { file: '07.jpg', alt: { en: 'Kitchen', es: 'Cocina' } },
    { file: '08.jpg', alt: { en: 'Kitchen area with doors to the deck', es: 'Área de cocina con puertas a la terraza' } },
    { file: '09.jpg', alt: { en: 'First-floor room', es: 'Habitación del primer piso' } },
    { file: '10.jpg', alt: { en: 'Upstairs hall', es: 'Pasillo del segundo piso' } },
    { file: '11.jpg', alt: { en: 'Upstairs room', es: 'Habitación del segundo piso' } },
    { file: '12.jpg', alt: { en: 'Upstairs room', es: 'Habitación del segundo piso' } },
    { file: '13.jpg', alt: { en: 'Upstairs room', es: 'Habitación del segundo piso' } },
    { file: '14.jpg', alt: { en: 'Back deck', es: 'Terraza trasera' } },
    { file: '15.jpg', alt: { en: 'Back deck', es: 'Terraza trasera' } },
    { file: '16.jpg', alt: { en: 'Detached garage and driveway', es: 'Garaje separado y entrada de autos' } },
    { file: '17.jpg', alt: { en: 'Backyard', es: 'Patio trasero' } },
  ],
  // Optional files in public/deals/65-Woodland-St-Lawrence-MA/docs/. Never the purchase contract or any document about the sale or its parties.
  documents: [],
  seo: {
    title: {
      en: '65 Woodland St, Lawrence, MA 01841 | Investment Property | Salem Silver Capital',
      es: '65 Woodland St, Lawrence, MA 01841 | Propiedad de inversión | Salem Silver Capital',
    },
    description: {
      en: '65 Woodland St, Lawrence, MA 01841: an investment property offered as an assignment of contract by Salem Silver Capital.',
      es: '65 Woodland St, Lawrence, MA 01841: una propiedad de inversión ofrecida como cesión de contrato por Salem Silver Capital.',
    },
  },
  ghl: { dealTag: 'assignment-65-woodland-st', source: 'Deal page 65 Woodland St' },
};

export default deal;
