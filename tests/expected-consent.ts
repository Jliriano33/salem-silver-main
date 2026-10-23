// The consent wording the tests expect, written out independently of lib/consent.ts
// so a weakened or swapped text in the app fails here. When Jefri approves new
// wording (SS-2, GO-A), update both files and bump the version in both.
export const EXPECTED_VERSION = '2026-10-23-v1';
export const EXPECTED_TEXT =
  'By checking this box, I agree that Salem Silver Capital may call and text me at the phone number I entered about selling my property, including calls and texts made with an autodialer, a prerecorded voice or an artificial voice (including AI). Consent is not a condition of any sale or purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.';
export const EXPECTED_ERROR = 'Please check the box to agree to be contacted.';

// Elements any approved wording must keep, checked on the rendered label.
export const REQUIRED_PHRASES = [
  'Salem Silver Capital',
  'call and text',
  'autodialer',
  'prerecorded',
  'artificial voice',
  'not a condition of any sale',
  'Message and data rates may apply',
  'STOP',
  'HELP',
];
