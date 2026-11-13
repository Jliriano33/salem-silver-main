import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BUSINESS_NAME, LEGAL_EMAIL, LEGAL_LAST_UPDATED, PHONE_DISPLAY, PHONE_HREF } from '@/lib/legal';

// Rewritten in SS-3 (F-003, F-019): it describes the tracking and the services the site really uses, and it
// names Salem Silver Capital only. The text is Jefri's to approve (GO-L) before it ships.

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Salem Silver Capital collects, uses, and shares your information when you visit salemsilver.com or request a cash offer.',
  alternates: {
    canonical: 'https://www.salemsilver.com/privacy-policy',
  },
};

const link = 'text-brand-blue hover:underline';

function ContactLine() {
  return (
    <>
      call us at{' '}
      <a href={PHONE_HREF} className={link}>{PHONE_DISPLAY}</a>
      {LEGAL_EMAIL && (
        <>
          {' '}or email{' '}
          <a href={`mailto:${LEGAL_EMAIL}`} className={link}>{LEGAL_EMAIL}</a>
        </>
      )}
    </>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-brand-blue mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">Last updated: {LEGAL_LAST_UPDATED}</p>
          </div>

          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed">
              {BUSINESS_NAME} (&ldquo;Salem Silver,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) buys homes for cash in
              Massachusetts, New Hampshire and Rhode Island. This policy explains what information we collect when you
              visit{' '}
              <a href="https://www.salemsilver.com" className={link}>www.salemsilver.com</a> or ask us for an offer, how
              we use it, who helps us handle it, and the choices you have. Our{' '}
              <Link href="/terms" className={link}>Terms of Service</Link> also apply.
            </p>
          </section>

          <PolicySection number="1" title="Information We Collect">
            <p><strong>Information you give us.</strong> When you request a cash offer, we collect:</p>
            <ul>
              <li>your name, phone number and email address;</li>
              <li>the property address, including any unit number;</li>
              <li>
                your answers about the property, such as its condition, your timeline, its estimated value, your reason
                for selling, its features, bedrooms, bathrooms, lot size, finished square feet, garage and who lives
                there;
              </li>
              <li>whether you agreed to be contacted, which version of that agreement you saw, and when.</li>
            </ul>
            <p>
              If you ask about one of our properties for investors, we collect your name, phone number, email address,
              the kind of buyer you are, whether you have proof of funds, your message and the language you chose.
            </p>
            <p>
              <strong>Calls and messages.</strong> When we talk with you by phone, the call may be recorded, transcribed
              and summarized, including calls handled by an automated or artificial-intelligence (AI) voice assistant. We
              keep records of the texts and emails we exchange with you.
            </p>
            <p>
              <strong>Information collected automatically.</strong> Like most websites, ours receives your IP address,
              browser and device type, the pages you visit, the page that sent you to us, and cookies or similar
              identifiers set by the tools described in section 3.
            </p>
          </PolicySection>

          <PolicySection number="2" title="How We Use Your Information">
            <ul>
              <li>to prepare and present an offer for your property;</li>
              <li>to contact you by phone, text message and email about your request, as you agreed;</li>
              <li>to schedule appointments and keep records of our conversations;</li>
              <li>to detect and block spam, fraud and misuse of our forms;</li>
              <li>to measure and improve our advertising and our website;</li>
              <li>to comply with the law.</li>
            </ul>
          </PolicySection>

          <PolicySection number="3" title="Tools and Service Providers">
            <p>These companies help us run the website and our business, and receive information to do so:</p>
            <ul>
              <li>
                <strong>Cloudflare</strong> hosts the website and handles every visit to it.
              </li>
              <li>
                <strong>Meta Pixel.</strong> On every page, Meta&apos;s pixel records your visit, and it records when
                you send us a cash-offer request, together with the page address, your browser and device information
                and Meta cookies. The pixel also sends these events to Meta&apos;s Conversions API Gateway. Meta uses
                this to measure and improve our ads and may connect it to your Facebook or Instagram account. We do not
                use Meta&apos;s automatic advanced matching, which would read the contact details you type into our
                forms. Meta&apos;s own privacy policy governs what Meta does with this information. Our pages pass your
                name, phone number, email and property address from page to page without putting them in the page
                address, and when a link to our site carries details like these, our pages remove the ones they
                recognize before Meta&apos;s pixel loads.
              </li>
              <li>
                <strong>OpenStreetMap (Nominatim)</strong> receives the address you type, to suggest matching addresses.
              </li>
              <li>
                <strong>Google Maps</strong> shows a map of the address you confirm in our cash-offer questions.
              </li>
              <li>
                <strong>GoHighLevel</strong> is our customer database, and it sends our text messages and emails.
              </li>
              <li>
                <strong>Our phone and voice providers</strong>, including Retell AI, place, record and transcribe our
                calls.
              </li>
              <li>
                <strong>Our automation, database and team-messaging services</strong> (n8n, Supabase and Slack) route
                your request, keep a record of it and alert our team.
              </li>
            </ul>
            <p>
              We do not sell your personal information. We may also disclose information when the law requires it, to
              protect our rights or the safety of others, or as part of a sale or transfer of our business.
            </p>
            <p>
              You can limit advertising cookies in your browser settings and in your Facebook or Instagram ad
              settings.
            </p>
          </PolicySection>

          <PolicySection number="4" title="Text Messages and Calls">
            <p>
              If you check the consent box on one of our forms, you agree that {BUSINESS_NAME} may call and text you at
              the number you entered about selling your property, including with an autodialer, a prerecorded voice or
              an artificial voice (including AI). Consent is not a condition of any sale or purchase.
            </p>
            <ul>
              <li><strong>Message frequency:</strong> message frequency varies.</li>
              <li><strong>Rates:</strong> message and data rates may apply.</li>
              <li>
                <strong>Opt out:</strong> reply <strong>STOP</strong> to any text to stop texts. You may receive one
                message confirming that you opted out. To stop calls or emails, tell us on a call, use the unsubscribe
                link in any email, or <ContactLine />.
              </li>
              <li><strong>Help:</strong> reply <strong>HELP</strong> to any text, or <ContactLine />.</li>
              <li>
                No mobile information will be shared with third parties or affiliates for marketing or promotional
                purposes. Information may be shared with the service providers that help us run our text messages and
                customer service, listed in section 3. Other than that, text messaging opt-in data and consent will not
                be shared with any third parties.
              </li>
            </ul>
          </PolicySection>

          <PolicySection number="5" title="How Long We Keep Information">
            <p>
              We keep your information for as long as we need it to evaluate and follow up on your request, and as long
              as we need it for our business records and to comply with the law. You can ask us to delete it at any
              time (section 7). We keep a record of an opt-out so that we can honor it.
            </p>
          </PolicySection>

          <PolicySection number="6" title="How We Protect Information">
            <p>
              We use reasonable safeguards, such as encrypted connections and access limited to the people who work on
              your request. No method of transmission or storage is completely secure.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Your Choices">
            <p>
              You may ask us to show you the information we hold about you, to correct it, or to delete it, unless we must
              keep it by law. You may opt out of texts, calls and emails at any time, as described in section 4. To make a
              request, <ContactLine />. We honor these requests from everyone, wherever you live, and respond within a
              reasonable time.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Children">
            <p>
              Our website and services are not directed to children under 13, and we do not knowingly collect their
              information. If you believe a child has given us information, contact us and we will delete it.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Changes to This Policy">
            <p>
              We may update this policy. When we do, we will post the new version here with a new &ldquo;last
              updated&rdquo; date.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Contact Us">
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
              <p className="text-gray-700 text-sm">Massachusetts, New Hampshire &amp; Rhode Island</p>
            </div>
          </PolicySection>

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

function PolicySection({
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
