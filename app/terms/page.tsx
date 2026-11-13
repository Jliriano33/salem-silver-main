import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BUSINESS_NAME, LEGAL_EMAIL, LEGAL_LAST_UPDATED, PHONE_DISPLAY, PHONE_HREF } from '@/lib/legal';

// New in SS-3 (F-016): the consent text on the quiz links here, and the page used to be a 404. It names
// Salem Silver Capital only. The text is Jefri's to approve (GO-L) before it ships.

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you use salemsilver.com or ask Salem Silver Capital for a cash offer.',
  alternates: {
    canonical: 'https://www.salemsilver.com/terms',
  },
};

const link = 'text-brand-blue hover:underline';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-brand-blue mb-4">Terms of Service</h1>
            <p className="text-gray-500 text-sm">Last updated: {LEGAL_LAST_UPDATED}</p>
          </div>

          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed">
              These terms apply when you use{' '}
              <a href="https://www.salemsilver.com" className={link}>www.salemsilver.com</a> or ask {BUSINESS_NAME}
              {' '}(&ldquo;Salem Silver,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) for an offer. By using the website you
              agree to them. Our <Link href="/privacy-policy" className={link}>Privacy Policy</Link> explains how we handle
              your information.
            </p>
          </section>

          <TermsSection number="1" title="Who We Are">
            <p>
              {BUSINESS_NAME} buys homes for cash in Massachusetts, New Hampshire and Rhode Island. We are professional
              home buyers, not real estate agents, and we do not represent you when you sell to us. You are always free
              to get advice from your own attorney, agent or advisor before you sign anything.
            </p>
          </TermsSection>

          <TermsSection number="2" title="Offers">
            <p>
              An estimate or offer we give you on this website, by phone, by text or by email is not a binding contract.
              A sale becomes binding only when you and we both sign a written purchase and sale agreement. That agreement
              sets the price, the closing date and every other term of the sale, and it controls if anything on this
              website says otherwise.
            </p>
          </TermsSection>

          <TermsSection number="3" title="Calls, Texts and Emails">
            <p>
              If you check the consent box on one of our forms, you agree that {BUSINESS_NAME} may call and text you at
              the number you entered about selling your property, including with an autodialer, a prerecorded voice or
              an artificial voice (including AI). Consent is not a condition of any sale or purchase. Calls may be
              recorded and transcribed.
            </p>
            <ul>
              <li>Message frequency varies. Message and data rates may apply.</li>
              <li>Reply <strong>STOP</strong> to any text to stop texts, or <strong>HELP</strong> for help.</li>
              <li>
                To stop calls or emails, tell us on a call, use the unsubscribe link in any email, or call{' '}
                <a href={PHONE_HREF} className={link}>{PHONE_DISPLAY}</a>.
              </li>
              <li>Mobile carriers are not liable for delayed or undelivered messages.</li>
            </ul>
          </TermsSection>

          <TermsSection number="4" title="Information You Give Us">
            <p>
              Please give us accurate information. Enter only a phone number and email address that belong to you, and
              ask for an offer only on a property you own or are authorized to sell.
            </p>
          </TermsSection>

          <TermsSection number="5" title="Properties for Investors">
            <p>
              Information on our investor property pages is provided for convenience, may change at any time, and should
              be checked independently. A property page is not an offer you can accept: a sale is binding only under a
              signed written agreement.
            </p>
          </TermsSection>

          <TermsSection number="6" title="Using the Website">
            <p>
              Do not submit false information, use bots or automated tools to send forms, try to get around our security,
              or use the website for anything unlawful. The website&apos;s text, images and design belong to{' '}
              {BUSINESS_NAME} or its licensors and may not be copied without permission. Links to other websites are
              provided for convenience; we are not responsible for their content.
            </p>
          </TermsSection>

          <TermsSection number="7" title="No Warranty; Limitation of Liability">
            <p>
              The website is provided &ldquo;as is.&rdquo; We work to keep it accurate and available, but we do not
              promise that it is error-free or always online. To the fullest extent the law allows, {BUSINESS_NAME} is
              not liable for indirect or consequential damages arising from your use of the website. Nothing in these
              terms limits a right you have by law, or a term of a signed purchase and sale agreement.
            </p>
          </TermsSection>

          <TermsSection number="8" title="Governing Law">
            <p>These terms are governed by the laws of the Commonwealth of Massachusetts.</p>
          </TermsSection>

          <TermsSection number="9" title="Changes">
            <p>
              We may update these terms. When we do, we will post the new version here with a new &ldquo;last
              updated&rdquo; date.
            </p>
          </TermsSection>

          <TermsSection number="10" title="Contact Us">
            <div className="bg-gray-50 rounded-lg p-5 not-prose">
              <p className="font-semibold text-gray-900">{BUSINESS_NAME}</p>
              <p className="text-gray-700 text-sm mt-2">
                Phone: <a href={PHONE_HREF} className={link}>{PHONE_DISPLAY}</a>
              </p>
              {LEGAL_EMAIL && (
                <p className="text-gray-700 text-sm">
                  Email: <a href={`mailto:${LEGAL_EMAIL}`} className={link}>{LEGAL_EMAIL}</a>
                </p>
              )}
            </div>
          </TermsSection>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function TermsSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-brand-blue mb-4">
        {number}. {title}
      </h2>
      <div className="text-gray-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-gray-900">
        {children}
      </div>
    </section>
  );
}
