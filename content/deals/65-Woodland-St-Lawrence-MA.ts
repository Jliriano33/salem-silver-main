import type { Deal } from '../../lib/deals/types';

// 65 Woodland St, Lawrence, MA 01841. Assignment of contract.
// Every PLACEHOLDER_ value arrives with the photos. Do not guess any of them.
// Alt text stays neutral until the photos are reviewed.
const deal: Deal = {
  // The live address is salemsilver.com/deals/65-Woodland-St-Lawrence-MA (Jefri, 2026-11-05).
  slug: '65-Woodland-St-Lawrence-MA',
  published: false,
  indexable: false,
  address: { street: '65 Woodland St', city: 'Lawrence', state: 'MA', zip: '01841' },
  price: { asking: 499000, assignmentFee: 'PLACEHOLDER_ASSIGNMENT_PRICE' },
  details: {
    beds: 'PLACEHOLDER_BEDS',
    baths: 'PLACEHOLDER_BATHS',
    sqft: 'PLACEHOLDER_SQFT',
    lotSize: 'PLACEHOLDER_LOT_SIZE',
    yearBuilt: 'PLACEHOLDER_YEAR_BUILT',
    propertyType: 'PLACEHOLDER_PROPERTY_TYPE',
    // Set any of these to null to hide the row.
    halfBaths: 'PLACEHOLDER_HALF_BATHS',
    units: 'PLACEHOLDER_UNITS',
    parking: 'PLACEHOLDER_PARKING',
    basement: 'PLACEHOLDER_BASEMENT',
    annualTaxes: 'PLACEHOLDER_ANNUAL_TAXES',
    assessedValue: 'PLACEHOLDER_ASSESSED_VALUE',
  },
  // Condition and systems. Text values, e.g. { en: 'Major repair', es: 'Reparación mayor' }.
  // "Unknown" / "Desconocido" is a fine answer; null hides the row.
  condition: {
    overall: 'PLACEHOLDER_CONDITION',
    occupancy: 'PLACEHOLDER_OCCUPANCY',
    roofAge: 'PLACEHOLDER_ROOF_AGE',
    heatingSystem: 'PLACEHOLDER_HEATING_SYSTEM',
    heatingAge: 'PLACEHOLDER_HEATING_AGE',
    airConditioning: 'PLACEHOLDER_AIR_CONDITIONING',
    foundationType: 'PLACEHOLDER_FOUNDATION_TYPE',
    foundationCondition: 'PLACEHOLDER_FOUNDATION_CONDITION',
    electrical: 'PLACEHOLDER_ELECTRICAL',
    plumbing: 'PLACEHOLDER_PLUMBING',
    waterHeater: 'PLACEHOLDER_WATER_HEATER',
  },
  numbers: { estimatedRepairs: 'PLACEHOLDER_REPAIRS', estimatedRepairsHigh: 'PLACEHOLDER_REPAIRS_HIGH', arv: 'PLACEHOLDER_ARV', showSpread: false },
  description: 'PLACEHOLDER_DESCRIPTION',
  photos: [
    { file: '01.jpg', alt: { en: 'Photo 1 of 65 Woodland St', es: 'Foto 1 de 65 Woodland St' } },
    { file: '02.jpg', alt: { en: 'Photo 2 of 65 Woodland St', es: 'Foto 2 de 65 Woodland St' } },
    { file: '03.jpg', alt: { en: 'Photo 3 of 65 Woodland St', es: 'Foto 3 de 65 Woodland St' } },
    { file: '04.jpg', alt: { en: 'Photo 4 of 65 Woodland St', es: 'Foto 4 de 65 Woodland St' } },
    { file: '05.jpg', alt: { en: 'Photo 5 of 65 Woodland St', es: 'Foto 5 de 65 Woodland St' } },
    { file: '06.jpg', alt: { en: 'Photo 6 of 65 Woodland St', es: 'Foto 6 de 65 Woodland St' } },
    { file: '07.jpg', alt: { en: 'Photo 7 of 65 Woodland St', es: 'Foto 7 de 65 Woodland St' } },
    { file: '08.jpg', alt: { en: 'Photo 8 of 65 Woodland St', es: 'Foto 8 de 65 Woodland St' } },
    { file: '09.jpg', alt: { en: 'Photo 9 of 65 Woodland St', es: 'Foto 9 de 65 Woodland St' } },
    { file: '10.jpg', alt: { en: 'Photo 10 of 65 Woodland St', es: 'Foto 10 de 65 Woodland St' } },
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
