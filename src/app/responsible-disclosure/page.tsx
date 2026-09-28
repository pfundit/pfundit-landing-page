import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Responsible Disclosure Policy',
  description:
    'Read the Responsible Disclosure Policy for reporting security vulnerabilities to Pfundit Pte. Ltd. and Pfundit Capital Private Limited.',
  alternates: {
    canonical: '/responsible-disclosure',
  },
};

export default function ResponsibleDisclosurePage() {
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
              Responsible Disclosure Policy
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#0f1b3d]/70 font-medium">
              Pfundit Pte. Ltd. (Singapore) and Pfundit Capital Private Limited (India)
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#0f1b3d]/55">
              <span>Effective date: <strong>28 September 2026</strong></span>
              <span>·</span>
              <span>Published at: <strong>pfundit.com/responsible-disclosure</strong></span>
              <span>·</span>
              <span>Version: <strong>1.0</strong></span>
            </div>
          </div>

          {/* Document Body */}
          <article className="prose prose-slate max-w-none space-y-10 text-[14.5px] sm:text-[15px] leading-[1.8] text-[#0f1b3d]/80">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                1. Our commitment
              </h2>
              <p>
                We welcome reports of security vulnerabilities in our systems from researchers acting in good faith. This policy explains how to report them and what you can expect from us.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                2. Scope
              </h2>
              <p>
                <strong>In scope:</strong> pfundit.com and its sub-domains operated by Pfundit.
              </p>
              <p>
                <strong>Out of scope:</strong> third-party services we use (report those to the provider); social engineering or phishing of our staff or partners; physical attacks; denial-of-service or load testing; spam or rate-limit findings without a security impact; and missing best-practice headers without a demonstrated exploit.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                3. How to report
              </h2>
              <p>
                Email <a href="mailto:security@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">security@pfundit.com</a> with a description of the issue, the affected URL or component, steps to reproduce, the likely impact, and your contact details. Please report as soon as you find the issue.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                4. Rules of engagement
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Test only against your own accounts and data, and access no more data than you need to show the issue.
                </li>
                <li>
                  Do not access, change, delete, copy or keep other people&rsquo;s data. If you encounter personal data, stop, tell us, and delete any copies.
                </li>
                <li>
                  Do not degrade the Site or disrupt anyone&rsquo;s use of it.
                </li>
                <li>
                  Do not use automated scanners at a volume that affects service.
                </li>
                <li>
                  Keep the issue confidential until we have fixed it or agreed a disclosure date with you.
                </li>
                <li>
                  Do not demand payment or any other benefit in exchange for your report.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                5. What we will do
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Acknowledge your report within 5 business days.</li>
                <li>Keep you updated on our assessment and fix.</li>
                <li>Credit you publicly, if you wish, once the issue is fixed.</li>
                <li>Where you have acted in good faith and followed this policy, not bring civil action against you and not refer your research to law enforcement.</li>
              </ul>
              <p className="mt-3">
                This policy cannot authorise activity that is unlawful, and it does not bind third parties. We do not currently offer monetary rewards.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                6. Contact
              </h2>
              <p>
                <a href="mailto:security@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">security@pfundit.com</a>
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
