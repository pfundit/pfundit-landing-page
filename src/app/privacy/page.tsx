import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Website Privacy Notice',
  description:
    'Learn how Pfundit Pte. Ltd. (Singapore) and Pfundit Capital Private Limited (India) collect, use, store and protect your personal data on pfundit.com in compliance with DPDP Act 2023 and Singapore PDPA.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyNoticePage() {
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
              Website Privacy Notice
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#0f1b3d]/70 font-medium">
              Pfundit Pte. Ltd. (Singapore) and Pfundit Capital Private Limited (India) · Website visitors, enquiries, investors and partners
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#0f1b3d]/55">
              <span>Effective date: <strong>28 September 2026</strong></span>
              <span>·</span>
              <span>Published at: <strong>pfundit.com/privacy</strong></span>
              <span>·</span>
              <span>Version: <strong>1.0</strong></span>
            </div>
          </div>

          {/* Document Body */}
          <article className="prose prose-slate max-w-none space-y-10 text-[14.5px] sm:text-[15px] leading-[1.8] text-[#0f1b3d]/80">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                1. About this notice
              </h2>
              <p>
                This notice explains how Pfundit collects, uses, shares, stores and protects personal data when you visit pfundit.com (the &ldquo;Site&rdquo;), write to us, request investor materials, or contact us as a prospective investor, lender, partner, adviser or supplier.
              </p>
              <p>
                It does not cover job applicants, who should read our <Link href="/hiring/privacy" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Applicant Privacy Notice</Link>, or cookies, which are covered by our <Link href="/cookies" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Cookie Notice</Link>.
              </p>
              <p>
                It is written to meet the requirements of India&rsquo;s Digital Personal Data Protection Act, 2023 (DPDP Act) and Digital Personal Data Protection Rules, 2025, the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules), and Singapore&rsquo;s Personal Data Protection Act 2012 (PDPA). Most DPDP obligations come into force on 13 May 2027; until then the SPDI Rules apply in India. We already follow the DPDP standards in this notice.
              </p>
              <p>
                Neither Pfundit company offers loans or any other financial product or service. We do not collect personal data from borrowers or loan applicants through the Site.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                2. Who we are
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pfundit Pte. Ltd.</strong> (UEN: 202544131H; registered address: 14B Stanley Street, Singapore 068733) operates the Site and handles most enquiries, including investor enquiries. It is an &ldquo;organisation&rdquo; responsible for your data under the PDPA.
                </li>
                <li>
                  <strong>Pfundit Capital Private Limited</strong> (CIN: U64910KA2026FTC227353; registered office: Prestige Central, 36 Infantry Road, M.G. Road, Bengaluru 560001, India) handles enquiries about its business in India. For that data it is the &ldquo;Data Fiduciary&rdquo; under the DPDP Act and the &ldquo;body corporate&rdquo; under the SPDI Rules.
                </li>
              </ul>
              <p>
                In this notice, &ldquo;Pfundit&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean both companies. Each is responsible for its own compliance.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                3. Personal data we collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Contact details:</strong> name, email address, phone number, organisation, job title and country.
                </li>
                <li>
                  <strong>Your enquiry:</strong> what you write to us and any documents you choose to send.
                </li>
                <li>
                  <strong>Investor information (only if you request investor materials):</strong> the type of investor you are (for example institutional or accredited investor), your jurisdiction, and the organisation you represent. If you later invest, identity and anti-money-laundering checks are covered by a separate notice given at that time.
                </li>
                <li>
                  <strong>Relationship records:</strong> notes of meetings and calls, and correspondence.
                </li>
                <li>
                  <strong>Technical data:</strong> IP address, device and browser information. See our <Link href="/cookies" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">Cookie Notice</Link>.
                </li>
              </ul>
              <div className="rounded-xl bg-[#0f1b3d]/5 p-4 border border-[#0f1b3d]/10 mt-3 text-xs leading-relaxed">
                Please do not send us bank or card details, government identification numbers, or health or other sensitive information through the Site. We do not need them to respond to you.
              </div>
              <p>
                <strong>Where we get it from:</strong> you; the organisation you work for; people who introduce you to us; and public professional sources such as company websites and LinkedIn.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                4. Why we use your data and our legal basis
              </h2>
              <p>We use your personal data to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>respond to your enquiry and keep in touch about it;</li>
                <li>assess and manage potential investment, lending, partnership, advisory or supply relationships;</li>
                <li>confirm that investor materials go only to eligible investors, and record what we shared and when;</li>
                <li>keep the Site and our communications secure, and prevent fraud and impersonation; and</li>
                <li>comply with law and establish, exercise or defend legal claims.</li>
              </ul>
              <p className="font-medium text-[#0f1b3d] mt-2">
                We do not use your data for marketing unless you opt in, and you can opt out at any time.
              </p>
              <div className="space-y-2 mt-3">
                <p>
                  <strong>India:</strong> we rely on the consent you give when you contact us, which you can withdraw at any time (section 10), and on the &ldquo;legitimate uses&rdquo; in section 7 of the DPDP Act, such as data you provide voluntarily for a specified purpose or processing required by law.
                </p>
                <p>
                  <strong>Singapore:</strong> we rely on your consent, including consent deemed given when you contact us voluntarily. Business contact information that you give us solely for business purposes is outside most PDPA data protection obligations, but we protect it to the same standard.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                5. Who we share your data with
              </h2>
              <p>We share personal data only as needed for the purposes above, with:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>each other (Pfundit Pte. Ltd. and Pfundit Capital Private Limited);</li>
                <li>service providers who process data on our behalf, such as website hosting, email, customer relationship and virtual data-room providers, under written contracts;</li>
                <li>our professional advisers, such as lawyers, accountants and auditors;</li>
                <li>regulators, courts, law-enforcement or government authorities where required by law, including the Reserve Bank of India in connection with our registration process; and</li>
                <li>a prospective buyer, investor or merger partner, subject to confidentiality.</li>
              </ul>
              <p className="font-semibold text-[#0f1b3d] mt-2">
                We do not sell your personal data.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                6. International transfers
              </h2>
              <p>Your personal data may be transferred between Singapore and India, and to service providers in other countries.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>From India:</strong> the DPDP Act allows transfers outside India except to countries the Government of India restricts by notification. Under the SPDI Rules, we transfer data only to recipients that provide the same level of protection.
                </li>
                <li>
                  <strong>From Singapore:</strong> we take steps to ensure that recipients outside Singapore protect your data to a standard comparable to the PDPA, for example through contractual clauses.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                7. How long we keep your data
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Enquiries that do not lead to a relationship:</strong> 24 months after our last contact, then erased.
                </li>
                <li>
                  <strong>Investors, lenders, partners, advisers and suppliers:</strong> for the relationship and afterwards for as long as law or legitimate business record-keeping requires.
                </li>
              </ul>
              <p>
                We erase personal data once the purpose is served or you withdraw consent, unless the law requires us to keep it. We keep limited processing records, such as access logs, for at least one year.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                8. How we protect your data
              </h2>
              <p>
                We use reasonable security safeguards designed with reference to IS/ISO/IEC 27001, including encryption, role-based access, access logging and vendor due diligence. If a personal data breach affects you, we will tell you without delay and report it as the law requires, including to the Data Protection Board of India, CERT-In and, for notifiable breaches, Singapore&rsquo;s Personal Data Protection Commission (PDPC).
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                9. Your rights
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#0f1b3d] mb-1">Under Indian law</h3>
                  <p className="text-sm">
                    Access to a summary of your data and who we shared it with; correction, completion, updating and erasure; withdrawal of consent; grievance redressal through our Grievance Officer; nomination of another person to exercise your rights if you die or become incapacitated; and a complaint to the Data Protection Board of India once you have used our grievance process.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f1b3d] mb-1">Under Singapore law</h3>
                  <p className="text-sm">
                    Access to your data and how it has been used or disclosed in the past year; correction of errors or omissions; withdrawal of consent on reasonable notice; and a complaint to the PDPC (pdpc.gov.sg).
                  </p>
                </div>
                <p className="text-xs text-[#0f1b3d]/65">
                  We respond within 30 days, and in any event within the time allowed by law. We may ask you to verify your identity. For Singapore access requests we may charge a reasonable fee, which we will tell you in advance.
                </p>
                <div className="rounded-xl bg-white p-4 border border-[#0f1b3d]/10 mt-3 text-sm">
                  To make a request, email <a href="mailto:privacy@pfundit.com?subject=Data%20request" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">privacy@pfundit.com</a> with the subject line <strong>&ldquo;Data request&rdquo;</strong>.
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                10. Withdrawing your consent
              </h2>
              <p>
                You can withdraw consent at any time by emailing <a href="mailto:privacy@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">privacy@pfundit.com</a>. We will then stop processing your data and erase it, unless the law requires us to keep it. Withdrawal does not affect processing before you withdrew.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                11. Children
              </h2>
              <p>
                The Site is not directed at anyone under 18, and we do not knowingly collect their personal data. If we learn that we have, we will erase it.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                12. Contact us
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">India – Grievance Officer</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    [Name], Grievance Officer<br />
                    Pfundit Capital Private Limited<br />
                    Prestige Central, 36 Infantry Road, M.G. Road,<br />
                    Bengaluru 560001, India<br />
                    Email: <a href="mailto:grievance@pfundit.com" className="font-medium text-[#D3A337] underline">grievance@pfundit.com</a> · <a href="mailto:privacy@pfundit.com" className="font-medium text-[#D3A337] underline">privacy@pfundit.com</a><br />
                    Hours: Monday to Friday, 10:00–18:00 IST
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">Singapore – Data Protection Officer</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    [Name or designation], Data Protection Officer<br />
                    Pfundit Pte. Ltd.<br />
                    14B Stanley Street,<br />
                    Singapore 068733<br />
                    Email: <a href="mailto:dpo@pfundit.com" className="font-medium text-[#D3A337] underline">dpo@pfundit.com</a>
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#0f1b3d]/65 mt-2">
                <strong>Regulators:</strong> Data Protection Board of India (through its digital platform); Personal Data Protection Commission, Singapore (pdpc.gov.sg).
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                13. Language and changes
              </h2>
              <p>
                You can ask for this notice in English or in any language listed in the Eighth Schedule to the Constitution of India by emailing <a href="mailto:privacy@pfundit.com" className="font-semibold text-[#D3A337] underline hover:text-[#b49050]">privacy@pfundit.com</a>. We may update this notice from time to time and will post the updated version on the Site with a new effective date.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
