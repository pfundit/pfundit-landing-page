import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Cookie Notice | Pfundit',
  description:
    'Learn how Pfundit Capital Private Ltd. and Pfundit Pte. Ltd. use cookies and similar technologies on pfundit.com in compliance with DPDP Act 2023 and Singapore PDPA.',
  alternates: {
    canonical: '/cookies',
  },
};

export default function CookieNoticePage() {
  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#0f1b3d]">
      <Navbar />

      <main className="relative z-10 pt-28 sm:pt-36 pb-20">
        <div className="layout-shell editorial-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A437] hover:underline"
            >
              &larr; Back to Home
            </Link>
          </div>

          {/* Document Header */}
          <div className="border-b border-[#0f1b3d]/10 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4A437]/10 px-3 py-1 text-xs font-bold text-[#D4A437] mb-4">
              <span>Website Legal Policies</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f1b3d]">
              Cookie Notice
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#0f1b3d]/70 font-medium">
              Pfundit Capital Private Ltd. (India) and Pfundit Pte. Ltd. (Singapore)
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#0f1b3d]/55">
              <span>Effective date: <strong>25 September 2026</strong></span>
              <span>·</span>
              <span>Published at: <strong>pfundit.com/cookies</strong></span>
              <span>·</span>
              <span>Version: <strong>1.0</strong></span>
            </div>
          </div>

          {/* Document Body */}
          <article className="prose prose-slate max-w-none space-y-10 text-[14.5px] sm:text-[15px] leading-[1.8] text-[#0f1b3d]/80">
            {/* A1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A1. What this notice covers
              </h2>
              <p>
                This notice explains how Pfundit Capital Private Ltd. (India) and Pfundit Pte. Ltd. (Singapore) (“Pfundit”, “we” and “us”) use cookies and similar technologies, such as pixels, tags, local storage and software development kits (together, “cookies”), on pfundit.com and its sub-pages (the “Site”). It forms part of, and should be read with, our privacy notices, including the <Link href="/hiring/privacy" className="text-[#D4A437] font-semibold underline hover:text-[#b49050]">Applicant Privacy Notice</Link>.
              </p>
              <p>
                Where information collected through cookies identifies you, or can identify you when combined with other information, we treat it as personal data under India’s Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000 and the rules made under them, and Singapore’s Personal Data Protection Act 2012 (PDPA).
              </p>
            </section>

            {/* A2 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A2. What cookies are
              </h2>
              <p>
                Cookies are small files placed on your device when you visit a website. “Session” cookies are deleted when you close your browser; “persistent” cookies stay until they expire or you delete them. “First-party” cookies are set by us; “third-party” cookies are set by another provider.
              </p>
            </section>

            {/* A3 */}
            <section className="space-y-4 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A3. Cookies we use
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Strictly necessary (always on):</strong> needed to run the Site securely and to deliver what you ask for, such as security and fraud prevention, load balancing, submitting the application form and remembering your cookie choices. The Site cannot work without them, and we do not use them to track you.
                </li>
                <li>
                  <strong>Functional (optional):</strong> remember your preferences, such as language. We set them only with your consent.
                </li>
                <li>
                  <strong>Analytics (optional):</strong> help us understand, in aggregate, how visitors use the Site so that we can improve it. We set them only with your consent.
                </li>
                <li>
                  <strong>Marketing and advertising:</strong> we do not use marketing, advertising or cross-site tracking cookies. If we introduce them, we will update this notice and ask for your consent before setting them.
                </li>
              </ul>

              <div className="mt-6 overflow-x-auto rounded-xl border border-[#0f1b3d]/10 bg-white">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#0f1b3d]/5 text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                    <tr>
                      <th className="px-4 py-3 border-b border-[#0f1b3d]/10">Cookie Name</th>
                      <th className="px-4 py-3 border-b border-[#0f1b3d]/10">Provider</th>
                      <th className="px-4 py-3 border-b border-[#0f1b3d]/10">Purpose</th>
                      <th className="px-4 py-3 border-b border-[#0f1b3d]/10">Category</th>
                      <th className="px-4 py-3 border-b border-[#0f1b3d]/10">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0f1b3d]/5 text-[#0f1b3d]/75">
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium">__session_sec</td>
                      <td className="px-4 py-3">Pfundit</td>
                      <td className="px-4 py-3">Security and CSRF protection</td>
                      <td className="px-4 py-3"><span className="inline-block rounded bg-green-100 px-2 py-0.5 text-[0.7rem] font-bold text-green-700">Strictly Necessary</span></td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium">pfundit_cookie_consent</td>
                      <td className="px-4 py-3">Pfundit</td>
                      <td className="px-4 py-3">Records cookie consent preferences</td>
                      <td className="px-4 py-3"><span className="inline-block rounded bg-green-100 px-2 py-0.5 text-[0.7rem] font-bold text-green-700">Strictly Necessary</span></td>
                      <td className="px-4 py-3">12 months</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium">_va_id</td>
                      <td className="px-4 py-3">Analytics Provider</td>
                      <td className="px-4 py-3">Aggregated anonymous usage metrics</td>
                      <td className="px-4 py-3"><span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[0.7rem] font-bold text-blue-700">Analytics</span></td>
                      <td className="px-4 py-3">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* A4 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A4. Your choices and consent
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Before optional cookies are set:</strong> our banner asks you to choose. “Accept all” and “Reject all” are equally prominent, and you can choose by category. No optional cookie is set until you actively opt in. Closing the banner, scrolling or continuing to browse is not consent.
                </li>
                <li>
                  <strong>Changing your mind:</strong> you can change or withdraw your consent at any time, as easily as you gave it. We will then stop setting the relevant cookies and delete, or ask our providers to delete, the data collected through them, unless the law requires us to keep it. Withdrawal does not affect processing that took place before you withdrew.
                </li>
                <li>
                  <strong>Browser controls:</strong> you can also block or delete cookies in your browser settings. If you block strictly necessary cookies, parts of the Site, including the application form, may not work.
                </li>
                <li>
                  <strong>Record of your choice:</strong> we keep a record of your choice (a consent identifier, the date and time, the categories chosen and the version of this notice) so that we can honour it and show that we have done so. We will ask you again every 12 months, or sooner if this notice changes materially.
                </li>
              </ul>
            </section>

            {/* A5 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A5. Third parties and international transfers
              </h2>
              <p>
                Some cookies are set by our service providers (for example, hosting and analytics providers), which process the data on our instructions under written contracts. This data may be processed outside India and Singapore. We make such transfers only where Indian law permits them and where the recipient protects the data to a standard comparable to the PDPA, as described in our privacy notices. We do not sell data collected through cookies, and we do not use it to make decisions about you, including hiring decisions.
              </p>
            </section>

            {/* A6 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A6. How long we keep cookie data
              </h2>
              <p>
                Each cookie lasts for the period shown in the cookie list. We keep data derived from cookies only for as long as we need it for the purpose described, and then delete or anonymise it.
              </p>
            </section>

            {/* A7 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A7. Your rights and how to contact us
              </h2>
              <p>
                You have the rights described in our privacy notices, including access, correction, erasure, withdrawal of consent, grievance redressal and nomination under Indian law, and access and correction under Singapore law.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">India – Grievance Officer</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    Pfundit Capital Private Ltd.<br />
                    Prestige Central, 36 Infantry Road, M.G. Road,<br />
                    Bengaluru 560001, India<br />
                    Email: <a href="mailto:privacy@pfundit.com" className="font-medium text-[#D4A437] underline">privacy@pfundit.com</a>
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">Singapore – Data Protection Officer</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    Pfundit Pte. Ltd.<br />
                    14B, Stanley Street,<br />
                    Singapore 068733<br />
                    Email: <a href="mailto:dpo@pfundit.com" className="font-medium text-[#D4A437] underline">dpo@pfundit.com</a>
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#0f1b3d]/65 mt-2">
                If you are not satisfied with our response, you may complain to the Data Protection Board of India (after using our grievance process) or to Singapore’s Personal Data Protection Commission (pdpc.gov.sg).
              </p>
            </section>

            {/* A8 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A8. Children
              </h2>
              <p>
                The Site is not directed at anyone under 18. We do not knowingly use cookies to track, behaviourally monitor or target advertising at children.
              </p>
            </section>

            {/* A9 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                A9. Changes and language
              </h2>
              <p>
                We may update this notice from time to time. We will post the updated version on the Site with a new effective date and, if the changes are material, ask for your cookie choices again. You can ask for this notice in English or in any language listed in the Eighth Schedule to the Constitution of India by emailing <a href="mailto:privacy@pfundit.com" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">privacy@pfundit.com</a>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
