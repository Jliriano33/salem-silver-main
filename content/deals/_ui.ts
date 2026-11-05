import type { DealUiStrings } from '../../lib/deals/ui-strings';

// Fixed text for every deal page, English and Latin-American Spanish.
// Items marked "COPY FOR JEFRI REVIEW" must be approved before any deal is published.
const ui: DealUiStrings = {
  langToggle: {
    toEs: { en: 'Español', es: 'Español' },
    toEn: { en: 'English', es: 'English' },
  },
  gallery: {
    comingSoon: { en: 'Photo coming soon', es: 'Foto próximamente' },
    open: { en: 'Open photo {n} of {total}', es: 'Abrir foto {n} de {total}' },
    close: { en: 'Close', es: 'Cerrar' },
    next: { en: 'Next photo', es: 'Foto siguiente' },
    prev: { en: 'Previous photo', es: 'Foto anterior' },
    counter: { en: '{n} / {total}', es: '{n} / {total}' },
  },
  price: {
    heading: { en: 'Price', es: 'Precio' },
    asking: { en: 'Asking price', es: 'Precio de venta' },
    assignmentFee: { en: 'Assignment fee', es: 'Tarifa de cesión' },
  },
  details: {
    heading: { en: 'Property details', es: 'Detalles de la propiedad' },
    beds: { en: 'Bedrooms', es: 'Habitaciones' },
    baths: { en: 'Bathrooms', es: 'Baños' },
    sqft: { en: 'Square feet', es: 'Pies cuadrados' },
    lotSize: { en: 'Lot size', es: 'Tamaño del terreno' },
    yearBuilt: { en: 'Year built', es: 'Año de construcción' },
    propertyType: { en: 'Property type', es: 'Tipo de propiedad' },
  },
  numbers: {
    heading: { en: 'Deal numbers', es: 'Números del negocio' },
    estimatedRepairs: { en: 'Estimated repairs', es: 'Reparaciones estimadas' },
    arv: { en: 'After-repair value (ARV)', es: 'Valor después de reparaciones (ARV)' },
    estimateNote: {
      en: 'These figures are estimates. Verify them on your own before you buy.',
      es: 'Estas cifras son estimados. Verifíquelas por su cuenta antes de comprar.',
    },
  },
  description: { heading: { en: 'About this property', es: 'Sobre esta propiedad' } },
  pending: { en: 'To be announced', es: 'Por anunciar' },
  // COPY FOR JEFRI REVIEW
  notice: {
    heading: { en: 'About this offer', es: 'Sobre esta oferta' },
    body: {
      en: 'This property is offered as an assignment of contract: the buyer takes over the existing purchase contract. Buyers must provide proof of funds. All figures shown (price, repairs, ARV) are estimates, and investors must verify them on their own before buying.',
      es: 'Esta propiedad se ofrece como cesión de contrato: el comprador asume el contrato de compra existente. Los compradores deben presentar prueba de fondos. Todas las cifras mostradas (precio, reparaciones, ARV) son estimados, y los inversionistas deben verificarlas por su cuenta antes de comprar.',
    },
    // COPY FOR JEFRI REVIEW: the one-line version shown under the price.
    short: {
      en: 'Assignment of contract. Proof of funds required. All figures are estimates to verify.',
      es: 'Cesión de contrato. Se requiere prueba de fondos. Todas las cifras son estimados a verificar.',
    },
  },
  form: {
    heading: { en: 'Request details on this property', es: 'Solicite información de esta propiedad' },
    intro: {
      en: 'Tell us a little about yourself and we will follow up with details.',
      es: 'Cuéntenos un poco sobre usted y le daremos seguimiento con los detalles.',
    },
    firstName: { en: 'First name', es: 'Nombre' },
    lastName: { en: 'Last name', es: 'Apellido' },
    email: { en: 'Email', es: 'Correo electrónico' },
    phone: { en: 'Phone', es: 'Teléfono' },
    buyerType: { en: 'How do you plan to buy?', es: '¿Cómo piensa comprar?' },
    buyerTypes: {
      cash: { en: 'Cash', es: 'Contado' },
      hard_money: { en: 'Hard money', es: 'Préstamo de dinero duro (hard money)' },
      other: { en: 'Other financing', es: 'Otro financiamiento' },
    },
    pofReady: {
      en: 'Do you have proof of funds ready?',
      es: '¿Tiene prueba de fondos lista?',
    },
    yes: { en: 'Yes', es: 'Sí' },
    no: { en: 'No', es: 'No' },
    message: { en: 'Message', es: 'Mensaje' },
    optional: { en: 'optional', es: 'opcional' },
    // DRAFT FOR JEFRI REVIEW: investor consent. The approved site consent is about
    // selling a home, so it does not fit investors. Needs approval before publishing.
    consent: {
      en: 'By checking this box, I agree that Salem Silver Capital may call, text and email me at the phone number and email address I entered about this property and similar investment properties. Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.',
      es: 'Al marcar esta casilla, acepto que Salem Silver Capital me llame, me envíe mensajes de texto y me escriba por correo electrónico al teléfono y al correo que ingresé, sobre esta propiedad y otras propiedades de inversión similares. El consentimiento no es condición para ninguna compra. La frecuencia de los mensajes varía. Pueden aplicar tarifas de mensajes y datos. Responda STOP para dejar de recibir mensajes o HELP para obtener ayuda.',
    },
    consentVersion: 'investor-2026-11-05-draft',
    submit: { en: 'Send my request', es: 'Enviar mi solicitud' },
    sending: { en: 'Sending...', es: 'Enviando...' },
    errorSummary: {
      en: 'Please fix the items below and try again.',
      es: 'Corrija los puntos siguientes e intente de nuevo.',
    },
    errors: {
      first_name: { en: 'Enter your first name.', es: 'Escriba su nombre.' },
      last_name: { en: 'Enter your last name.', es: 'Escriba su apellido.' },
      email: { en: 'Enter a valid email address.', es: 'Escriba un correo electrónico válido.' },
      phone: {
        en: 'Enter a valid 10-digit US phone number.',
        es: 'Escriba un número de teléfono de EE. UU. válido, de 10 dígitos.',
      },
      buyer_type: { en: 'Choose how you plan to buy.', es: 'Elija cómo piensa comprar.' },
      pof: {
        en: 'Tell us whether you have proof of funds ready.',
        es: 'Indique si tiene la prueba de fondos lista.',
      },
      consent: {
        en: 'Check the box to agree to be contacted.',
        es: 'Marque la casilla para aceptar que lo contactemos.',
      },
      message_too_long: {
        en: 'Your message is too long. Keep it under 2,000 characters.',
        es: 'Su mensaje es demasiado largo. Use menos de 2,000 caracteres.',
      },
      unknown_deal: {
        en: 'This property is no longer available through this page. Please reload and try again.',
        es: 'Esta propiedad ya no está disponible en esta página. Recargue e intente de nuevo.',
      },
      delivery_failed: {
        en: 'We could not send your request. Please try again in a few minutes.',
        es: 'No pudimos enviar su solicitud. Intente de nuevo en unos minutos.',
      },
      bad_request: {
        en: 'Something went wrong with your request. Please reload the page and try again.',
        es: 'Algo salió mal con su solicitud. Recargue la página e intente de nuevo.',
      },
    },
    thanksHeading: { en: 'Thank you', es: 'Gracias' },
    thanksBody: {
      en: 'We received your request. A member of our team will follow up with you about this property.',
      es: 'Recibimos su solicitud. Un miembro de nuestro equipo le dará seguimiento sobre esta propiedad.',
    },
  },
  footer: {
    tagline: { en: 'Investment properties and cash home buying', es: 'Propiedades de inversión y compra de casas al contado' },
    phoneLabel: { en: 'Call us', es: 'Llámenos' },
    rights: { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    privacy: { en: 'Privacy policy', es: 'Política de privacidad' },
  },
};

export default ui;
