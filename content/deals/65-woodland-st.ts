import type { Deal } from '../../lib/deals/types';

// 65 Woodland St, Lawrence, MA 01841. Assignment of contract.
// Every PLACEHOLDER_ value arrives with the photos. Do not guess any of them.
const deal: Deal = {
  slug: '65-woodland-st',
  published: false,
  indexable: false,
  address: { street: '65 Woodland St', city: 'Lawrence', state: 'MA', zip: '01841' },
  price: { asking: 'PLACEHOLDER_PRICE', assignmentFee: 'PLACEHOLDER_ASSIGNMENT_PRICE' },
  details: {
    beds: 'PLACEHOLDER_BEDS',
    baths: 'PLACEHOLDER_BATHS',
    sqft: 'PLACEHOLDER_SQFT',
    lotSize: 'PLACEHOLDER_LOT_SIZE',
    yearBuilt: 'PLACEHOLDER_YEAR_BUILT',
    propertyType: 'PLACEHOLDER_PROPERTY_TYPE',
  },
  numbers: { estimatedRepairs: 'PLACEHOLDER_REPAIRS', arv: 'PLACEHOLDER_ARV', showSpread: false },
  description: 'PLACEHOLDER_DESCRIPTION',
  photos: [
    { file: '01.jpg', alt: { en: 'Photo 1', es: 'Foto 1' } },
  ],
  seo: {
    title: { en: '65 Woodland St, Lawrence, MA 01841', es: '65 Woodland St, Lawrence, MA 01841' },
    description: { en: 'Investment property', es: 'Propiedad de inversión' },
  },
  ghl: { dealTag: 'assignment-65-woodland-st', source: 'Deal page 65 Woodland St' },
};

export default deal;
