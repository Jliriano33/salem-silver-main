'use client';

import Script from 'next/script';

export default function LeadForm() {
  return (
    <section id="lead-form" className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 mb-4">
            Get Your Free Cash Offer Today
          </h2>
          <p className="text-gray-500 text-lg">
            Fill out the short form below — takes less than 60 seconds. We&apos;ll
            contact you within 24 hours.
          </p>
        </div>

        <iframe
          src="https://api.leadconnectorhq.com/widget/form/C2czYikea5LaVBQgErTs"
          style={{ width: '100%', height: '750px', border: 'none', borderRadius: '8px' }}
          id="inline-C2czYikea5LaVBQgErTs"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Salem Silver - Cash Offer"
          data-height="750"
          data-layout-iframe-id="inline-C2czYikea5LaVBQgErTs"
          data-form-id="C2czYikea5LaVBQgErTs"
          title="Salem Silver Cash Offer Form"
        />
        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
          strategy="lazyOnload"
        />

        <p className="text-gray-400 text-xs text-center mt-4">
          No obligation. No spam. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
