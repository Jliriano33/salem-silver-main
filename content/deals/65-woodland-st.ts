import type { Deal } from '../../lib/deals/types';

// 65 Woodland St, Lawrence, MA 01841. Assignment of contract.
// Every PLACEHOLDER_ value arrives with the photos. Do not guess any of them.
// Alt text stays neutral until the photos are reviewed.
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
