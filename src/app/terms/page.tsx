import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Read the Terms of Use governing your access to and use of pfundit.com, operated by Pfundit Pte. Ltd. and Pfundit Capital Private Limited.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfUsePage() {
  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#0f1b3d]">
      <Navbar />

      <main className="relative z-10 pt-28 sm:pt-36 pb-20">
        <div className="layout-shell editorial-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D3A337] hover:underline"
            >
              &larr; Back to Home
            </Link>
          </div>

          {/* Document Header */}
          <div className="border-b border-[#0f1b3d]/10 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D3A337]/10 px-3 py-1 text-xs font-bold text-[#D3A337] mb-4">
              <span>Website Legal Policies</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f1b3d]">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#0f1b3d]/70 font-medium">
              Pfundit Pte. Ltd. (Singapore) and Pfundit Capital Private Limited (India)
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#0f1b3d]/55">
              <span>Effective date: <strong>28 September 2026</strong></span>
              <span>·</span>
              <span>Published at: <strong>pfundit.com/terms</strong></span>
              <span>·</span>
              <span>Version: <strong>1.0</strong></span>
            </div>
          </div>

          {/* Document Body */}
          <article className="prose prose-slate max-w-none space-y-10 text-[14.5px] sm:text-[15px] leading-[1.8] text-[#0f1b3d]/80">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                1. About these Terms
              </h2>
              <p>
                These Terms govern your use of pfundit.com and its sub-pages (the &ldquo;Site&rdquo;), operated by Pfundit Pte. Ltd. By using the Site you agree to them. If you do not agree, please do not use the Site.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                2. Who we are
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pfundit Pte. Ltd.</strong> (UEN: 202544131H), a private company incorporated in Singapore, registered address 14B Stanley Street, Singapore 068733.
                </li>
                <li>
                  <strong>Pfundit Capital Private Limited</strong> (CIN: U64910KA2026FTC227353), its wholly-owned subsidiary incorporated in India, registered office Prestige Central, 36 Infantry Road, M.G. Road, Bengaluru 560001.
                </li>
              </ul>
              <p>
                &ldquo;Pfundit&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean both companies.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                3. Regulatory status
              </h2>
              <p>
                Pfundit Pte. Ltd. is an investment holding company. It does not lend money, extend credit or provide any financial product or service in Singapore or elsewhere, and it is not licensed or regulated by the Monetary Authority of Singapore or the Registry of Moneylenders.
              </p>
              <p>
                Pfundit Capital Private Limited proposes to apply to the Reserve Bank of India (RBI) for registration as a non-deposit taking NBFC-ICC (Type II, Base Layer). It is not registered with the RBI and will not undertake any lending or other non-banking financial activity unless and until it receives an RBI Certificate of Registration. References on the Site to lending, credit products, segments or geographies describe intended future activities only.
              </p>
              <p>
                Any future business in Southeast Asia, the GCC or any other jurisdiction will be carried on only by an entity holding the licences required there.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                4. No offer and no advice
              </h2>
              <p>
                Nothing on the Site is an offer of credit, an offer or invitation to buy, sell or subscribe for any securities, or investment, legal, tax, accounting or financial advice, in any jurisdiction. Do not rely on the Site to make any financial or investment decision. Take independent professional advice.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                5. Investor information
              </h2>
              <p>
                Investor materials are available only to institutional investors and accredited investors (as defined in the Securities and Futures Act 2001 of Singapore) and equivalent professional investors in other jurisdictions, and only where lawful. Requests are reviewed individually and materials are shared only under a confidentiality agreement. Any investment would be made only on the basis of definitive documents, not the Site.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                6. Forward-looking statements and market data
              </h2>
              <p>
                The Site contains forward-looking statements, including targets, projected cost-to-income ratios, timelines and expansion plans. They reflect management&rsquo;s current expectations and assumptions, depend on regulatory approvals and market conditions, and may not be achieved. They are not forecasts, promises or guarantees. We are not obliged to update them.
              </p>
              <p>
                Market sizes and industry figures come from third-party research cited on the Site. We have not independently verified them, and they do not describe Pfundit&rsquo;s own business, loan book or assets.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                7. Fraud warning
              </h2>
              <p>
                Pfundit does not offer loans, has no lending app, and does not ask for fees, deposits or documents for loans. We never charge recruitment fees. We do not authorise any agent to do any of these things on our behalf. If anyone contacts you claiming to offer a Pfundit loan or job for a fee, report it to <a href="mailto:info@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">info@pfundit.com</a> and, in India, to the National Cybercrime Reporting Portal (<a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">cybercrime.gov.in</a>).
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                8. Intellectual property
              </h2>
              <p>
                The Site and its content, including text, graphics, logos, the name &ldquo;Pfundit&rdquo; and software, are owned by or licensed to Pfundit Pte. Ltd. Pfundit Capital Private Limited uses them under licence. You may view and print pages for your own non-commercial use. You may not copy, adapt, distribute, frame or use our content or marks for any other purpose without our written permission.
              </p>
              <p>
                Names and marks of other organisations belong to their owners and are used for identification only. Their use does not mean those organisations endorse or are affiliated with Pfundit.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                9. Acceptable use
              </h2>
              <p>
                You must not: use the Site unlawfully or to impersonate Pfundit or anyone else; submit false information; introduce malicious code; attempt unauthorised access to the Site or our systems; scrape or harvest data by automated means; or interfere with the Site&rsquo;s operation. Security researchers should follow our <Link href="/responsible-disclosure" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Responsible Disclosure Policy</Link>.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                10. Third-party links
              </h2>
              <p>
                Links to other websites are for convenience. We do not control or endorse them and are not responsible for their content or privacy practices.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                11. Disclaimer
              </h2>
              <p>
                We try to keep the Site accurate and up to date, but it is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent permitted by law, we make no representations or warranties about its accuracy, completeness or availability, or that it is free of viruses or errors.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                12. Limitation of liability
              </h2>
              <p>
                To the extent permitted by law, neither Pfundit company is liable for any loss or damage arising from your use of, or reliance on, the Site, including indirect or consequential loss and loss of profit, data or opportunity. Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                13. Privacy and cookies
              </h2>
              <p>
                Our <Link href="/privacy" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Privacy Notice</Link>, <Link href="/hiring/privacy" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Applicant Privacy Notice</Link> and <Link href="/cookies" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Cookie Notice</Link> explain how we handle personal data.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                14. Governing law and jurisdiction
              </h2>
              <p>
                These Terms are governed by the laws of Singapore. The courts of Singapore have non-exclusive jurisdiction over any dispute arising from them or the Site. This does not take away any rights you have under the mandatory laws of the country where you live.
              </p>
            </section>

            {/* Section 15 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                15. Changes
              </h2>
              <p>
                We may change these Terms or the Site at any time. The version on the Site, with its effective date, applies.
              </p>
            </section>

            {/* Section 16 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                16. Contact
              </h2>
              <p>
                <a href="mailto:info@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">info@pfundit.com</a>
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
