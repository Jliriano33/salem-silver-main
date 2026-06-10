import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Salem Silver Capital',
  description:
    'Learn how Salem Silver Capital collects, uses, and protects your personal information when you request a cash offer for your home.',
  alternates: {
    canonical: 'https://www.salemsilver.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-brand-blue mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Effective Date: June 10, 2026 &nbsp;·&nbsp; Last Updated: June 10, 2026
            </p>
          </div>

          {/* Intro */}
          <section className="prose prose-gray max-w-none mb-10">
            <p className="text-gray-700 leading-relaxed">
              Salem Silver Capital (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a cash home-buying
              brand operated by Liriano Realty LLC. We are committed to protecting your personal
              information and being transparent about how we collect and use it. This Privacy Policy
              explains our practices when you visit{' '}
              <a href="https://www.salemsilver.com" className="text-brand-blue hover:underline">
                www.salemsilver.com
              </a>{' '}
              or submit a cash-offer request.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you have questions about this policy, contact us at{' '}
              <a href="mailto:info@lirianorealty.com" className="text-brand-blue hover:underline">
                info@lirianorealty.com
              </a>{' '}
              or call{' '}
              <a href="tel:+16177142020" className="text-brand-blue hover:underline">
                (617) 714-2020
              </a>
              .
            </p>
          </section>

          <PolicySection number="1" title="Information We Collect">
            <p>
              When you submit a cash-offer request through our website, we collect the following
              information:
            </p>
            <ul>
              <li><strong>Contact information:</strong> First name, last name, phone number, and email address.</li>
              <li><strong>Property information:</strong> Property address, property condition, and your desired selling timeline.</li>
            </ul>
            <p>
              We also collect standard technical information automatically when you visit our site,
              including your IP address, browser type, pages visited, and referring URL. Our cash-offer
              form is hosted through GoHighLevel (LeadConnector), which may set browser cookies
              necessary for the form to function. We do not currently use Google Analytics or Meta
              Pixel tracking.
            </p>
          </PolicySection>

          <PolicySection number="2" title="How We Use Your Information">
            <p>We use the information you provide to:</p>
            <ul>
              <li>Prepare and deliver a cash offer for your property.</li>
              <li>Contact you by phone, text message, and/or email to discuss your offer and answer questions.</li>
              <li>Maintain records of our communications with you.</li>
              <li>Comply with applicable laws and regulations.</li>
              <li>Improve our website and services.</li>
            </ul>
          </PolicySection>

          <PolicySection number="3" title="How We Share Your Information">
            <p>
              We do not sell your personal information. We may share your information only in the
              following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>GoHighLevel / LeadConnector:</strong> We use GoHighLevel as our customer
                relationship management (CRM) platform to store and manage your contact information and
                follow-up communications.
              </li>
              <li>
                <strong>Internal team:</strong> Your information is accessible to members of the
                Liriano Realty team who work on your inquiry, including acquisitions and follow-up staff.
              </li>
              <li>
                <strong>Service providers:</strong> We may share information with trusted vendors who
                assist us in operating our business (e.g., communication platforms), under
                confidentiality obligations.
              </li>
              <li>
                <strong>Legal requirements:</strong> We may disclose your information if required by
                law, court order, or government authority.
              </li>
            </ul>
            <p>
              <strong>SMS consent:</strong> Information collected for the purpose of SMS messaging is
              not sold, rented, or shared with third parties for their marketing purposes under any
              circumstances.
            </p>
          </PolicySection>

          <PolicySection number="4" title="SMS / Text Message Consent (TCPA)">
            <p>
              By providing your phone number and submitting a cash-offer request, you expressly
              consent to receive calls and text messages from Salem Silver Capital and Liriano Realty
              at the phone number you provided. These communications may include information about your
              cash offer, follow-up questions, and appointment scheduling.
            </p>
            <ul>
              <li><strong>Message frequency:</strong> Message frequency varies based on your inquiry and our follow-up process.</li>
              <li><strong>Message and data rates:</strong> Standard message and data rates may apply depending on your mobile carrier and plan.</li>
              <li>
                <strong>Opt-out:</strong> You may opt out of text messages at any time by replying{' '}
                <strong>STOP</strong> to any text message you receive from us. After opting out, you
                may receive one final confirmation message.
              </li>
              <li>
                <strong>Help:</strong> Reply <strong>HELP</strong> to any text message for assistance,
                or contact us at{' '}
                <a href="mailto:info@lirianorealty.com" className="text-brand-blue hover:underline">
                  info@lirianorealty.com
                </a>
                .
              </li>
              <li>
                <strong>Third-party sharing:</strong> Your consent to receive SMS messages is not
                shared with or sold to third parties for their marketing purposes.
              </li>
            </ul>
            <p>
              You may also opt out of phone calls or email by contacting us directly. Opting out of
              communications does not affect any ongoing business relationship or legal obligation.
            </p>
          </PolicySection>

          <PolicySection number="5" title="Cookies and Tracking Technologies">
            <p>
              Our website uses cookies and similar technologies to operate certain features. Specifically:
            </p>
            <ul>
              <li>
                <strong>Form functionality cookies:</strong> Our cash-offer form, powered by
                GoHighLevel (LeadConnector), uses cookies to enable the form to load and track form
                submissions correctly.
              </li>
              <li>
                <strong>Session cookies:</strong> Standard browser session cookies may be set to
                remember your preferences during a single visit.
              </li>
            </ul>
            <p>
              We do not use advertising cookies, Google Analytics, or Meta Pixel at this time. You
              can configure your browser to refuse cookies, though some site features may not function
              properly as a result.
            </p>
          </PolicySection>

          <PolicySection number="6" title="Data Retention">
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              described in this policy — primarily to evaluate and follow up on your cash-offer
              inquiry. If we do not enter into a transaction with you, we may retain basic contact
              records for up to three (3) years for business record-keeping and legal compliance
              purposes, after which they are deleted or anonymized.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Your Rights and Choices">
            <p>You have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of the personal information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Ask us to correct inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> Request that we delete your personal information, subject to
                any legal retention obligations.
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time by
                replying STOP to any text, clicking &ldquo;unsubscribe&rdquo; in any email, or contacting us
                directly.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:info@lirianorealty.com" className="text-brand-blue hover:underline">
                info@lirianorealty.com
              </a>{' '}
              with &ldquo;Privacy Request&rdquo; in the subject line. We will respond within a reasonable
              timeframe.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Massachusetts Residents">
            <p>
              If you are a resident of Massachusetts, you have rights under the Massachusetts Consumer
              Protection Act and related privacy regulations, including the right to know what personal
              information we collect and how it is used, and the right to request deletion of your
              personal data. To exercise these rights, contact us at{' '}
              <a href="mailto:info@lirianorealty.com" className="text-brand-blue hover:underline">
                info@lirianorealty.com
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection number="9" title="Children's Privacy">
            <p>
              Our website and services are not directed to children under the age of 13. We do not
              knowingly collect personal information from children. If you believe we have
              inadvertently collected information from a child under 13, please contact us immediately
              and we will delete it.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices
              or applicable law. Material changes will be posted on this page with an updated effective
              date. We encourage you to review this policy periodically.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Contact Us">
            <p>
              If you have questions, concerns, or requests related to this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 mt-4 not-prose">
              <p className="font-semibold text-gray-900">Salem Silver Capital</p>
              <p className="text-gray-700 text-sm">Operated by Liriano Realty LLC</p>
              <p className="text-gray-700 text-sm mt-2">
                Email:{' '}
                <a href="mailto:info@lirianorealty.com" className="text-brand-blue hover:underline">
                  info@lirianorealty.com
                </a>
              </p>
              <p className="text-gray-700 text-sm">
                Phone:{' '}
                <a href="tel:+16177142020" className="text-brand-blue hover:underline">
                  (617) 714-2020
                </a>
              </p>
              <p className="text-gray-700 text-sm">Massachusetts, New Hampshire & Rhode Island</p>
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">
              This policy is provided for informational purposes. If you have legal questions about
              your rights under applicable privacy or telecommunications law, we encourage you to
              consult a qualified attorney.
            </p>
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
