import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Applicant Privacy Notice',
  description:
    'Learn how Pfundit Capital Private Ltd. (India) and Pfundit Pte. Ltd. (Singapore) collect, use, store and protect your personal data during recruitment, in compliance with the DPDP Act 2023 and Singapore PDPA.',
  alternates: {
    canonical: '/hiring/privacy',
  },
};

export default function ApplicantPrivacyNoticePage() {
  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#0f1b3d]">
      <Navbar />

      <main className="relative z-10 pt-28 sm:pt-36 pb-20">
        <div className="layout-shell editorial-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/hiring"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A437] hover:underline"
            >
              &larr; Back to Open Opportunities
            </Link>
          </div>

          {/* Document Header */}
          <div className="border-b border-[#0f1b3d]/10 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4A437]/10 px-3 py-1 text-xs font-bold text-[#D4A437] mb-4">
              <span>Recruitment & Hiring Disclosures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0f1b3d]">
              Applicant Privacy Notice
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#0f1b3d]/70 font-medium">
              Pfundit Capital Private Ltd. (India) and Pfundit Pte. Ltd. (Singapore) · Recruitment and hiring
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#0f1b3d]/55">
              <span>Effective date: <strong>25 September 2026</strong></span>
              <span>·</span>
              <span>Published at: <strong>pfundit.com/hiring/privacy</strong></span>
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
                This notice explains how Pfundit collects, uses, shares, stores and protects your personal data when you apply for a role with us, are referred to us, or are contacted by us about a role. It applies to applications made through pfundit.com/hiring, by email to careers@pfundit.com, through LinkedIn, or through a recruitment agency or referrer.
              </p>
              <p>
                It is written to meet the requirements of India’s Digital Personal Data Protection Act, 2023 (DPDP Act) and Digital Personal Data Protection Rules, 2025 (DPDP Rules), the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules), and Singapore’s Personal Data Protection Act 2012 (PDPA).
              </p>
              <p>
                Most obligations under the DPDP Act and DPDP Rules come into force on 13 May 2027. Until then, the SPDI Rules continue to apply in India. We already follow the DPDP standards set out in this notice, in addition to the SPDI Rules.
              </p>
              <p>
                This notice relates only to recruitment. Pfundit Capital Private Ltd. does not hold a Certificate of Registration from the Reserve Bank of India and does not offer loans or any other financial product or service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                2. Who we are
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Pfundit Capital Private Ltd.</strong> (CIN: U64910KA2026FTC227353; registered office: Prestige Central, 36 Infantry Road, M.G. Road, Bengaluru 560001, India) decides why and how your data is processed for roles in India. It is the “Data Fiduciary” under the DPDP Act and the “body corporate” under the SPDI Rules.
                </li>
                <li>
                  <strong>Pfundit Pte. Ltd.</strong> (UEN: 202544131H; registered address: 14B, Stanley Street, Singapore 068733) is our parent company. It reviews applications and takes part in hiring decisions, and is an “organisation” responsible for your data under the PDPA.
                </li>
              </ul>
              <p>
                In this notice, “Pfundit”, “we” and “us” mean both companies. Each is responsible for its own compliance, and you can contact either of them using the details in section 12.
              </p>
              <p>
                <strong>Build–Operate–Transfer roles.</strong> For the Technology Lead role, you will initially be employed by our managed technology-services partner. We share the data needed for that arrangement with the partner, which processes it under its own privacy notice. We will name the partner before sharing your data.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                3. Personal data we collect
              </h2>
              <p>We collect only what we need to assess your application. Specifically:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Identity and contact details:</strong> name, email address, phone number, city of residence and professional profile links (such as LinkedIn).
                </li>
                <li>
                  <strong>Application details:</strong> CV, cover letter, portfolio, employment history, education, qualifications, certifications, skills, current and expected compensation, notice period and references.
                </li>
                <li>
                  <strong>Assessment details:</strong> interview notes, results of tests or case studies, and evaluator feedback.
                </li>
                <li>
                  <strong>Offer-stage checks (only if we plan to make you an offer, with your separate consent):</strong> proof of identity, employment and education verification, reference checks and, for senior or key managerial roles, fit-and-proper checks such as litigation, regulatory and credit-history checks.
                </li>
                <li>
                  <strong>Financial information (offer stage only):</strong> bank account details for payroll. This is “sensitive personal data or information” under the SPDI Rules, and we collect it only with your written (including electronic) consent.
                </li>
                <li>
                  <strong>Accessibility information (optional):</strong> details you choose to share so that we can make reasonable adjustments to the recruitment process.
                </li>
                <li>
                  <strong>Technical data:</strong> IP address, device and browser information and cookies when you use our application form. See our <Link href="/cookies" className="text-[#D4A437] font-semibold underline hover:text-[#b49050]">Cookie Notice</Link>.
                </li>
              </ul>
              <div className="rounded-xl bg-[#0f1b3d]/5 p-4 border border-[#0f1b3d]/10 mt-3 text-xs leading-relaxed">
                <strong>Important Note on Sensitive Documents:</strong> We do not need your Aadhaar number to consider your application. If you provide an Aadhaar document, please mask the first eight digits. Please do not include information about your religion, caste, political views, health (other than accessibility needs) or family in your application.
              </div>
              <p>
                <strong>Where we get it from:</strong> you; people who refer you; recruitment agencies; your public professional profiles; your referees; and, at offer stage, background-verification agencies.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                4. Why we use your data and our legal basis
              </h2>
              <p>We use your personal data to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>assess your skills, experience and suitability for the role you applied for, or for similar roles if you agree;</li>
                <li>communicate with you and arrange interviews and assessments;</li>
                <li>carry out offer-stage checks and, if you are selected, make an offer and prepare for onboarding;</li>
                <li>where you are selected for a senior or key managerial role, show regulators (including the Reserve Bank of India as part of our registration process) the capability and fit-and-proper status of our management team;</li>
                <li>keep our recruitment process secure, including preventing recruitment fraud and fake job offers; and</li>
                <li>comply with law and establish, exercise or defend legal claims.</li>
              </ul>
              <div className="space-y-2 mt-4">
                <p>
                  <strong>India:</strong> we rely on the consent you give when you submit your application, which you can withdraw at any time (section 10). We may also rely on the “legitimate uses” allowed by section 7 of the DPDP Act, such as where you have voluntarily provided your data for a specified purpose or where processing is required to comply with law.
                </p>
                <p>
                  <strong>Singapore:</strong> we rely on your consent, including consent you are deemed to give by submitting your application voluntarily. We may also rely on the PDPA exception for “evaluative purposes” (assessing your suitability for employment) and on the need to comply with law.
                </p>
                <p>
                  <strong>Use of technology:</strong> we may use software, including AI-assisted tools, to organise applications and schedule interviews. No hiring decision about you is made solely by automated means; every decision is reviewed by a person.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                5. Who we share your data with
              </h2>
              <p>We share your personal data only as needed for the purposes above, with:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>each other (Pfundit Capital Private Ltd. and Pfundit Pte. Ltd.) for hiring decisions;</li>
                <li>service providers who process data on our behalf, such as applicant-tracking, cloud-hosting, email, video-interview, assessment and background-verification providers, under written contracts that require them to protect your data and use it only on our instructions;</li>
                <li>our managed technology-services partner, for Build–Operate–Transfer roles;</li>
                <li>the recruitment agency or person who referred you, limited to the status of your application;</li>
                <li>our professional advisers, and regulators, courts, law-enforcement or government authorities where required by law; and</li>
                <li>a prospective buyer or investor in connection with a merger, acquisition or restructuring, subject to confidentiality.</li>
              </ul>
              <p className="font-semibold text-[#0f1b3d]">
                We do not sell your personal data, and we do not use it for marketing.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                6. International transfers
              </h2>
              <p>Your personal data may be transferred between India and Singapore, and to service providers in other countries.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>From India:</strong> the DPDP Act allows transfers outside India except to countries the Government of India restricts by notification. Singapore is not a restricted country at the date of this notice. Under the SPDI Rules, we transfer data only to recipients that provide the same level of protection, and where the transfer is needed for your application or you have consented.
                </li>
                <li>
                  <strong>From Singapore:</strong> under the PDPA, we take steps to ensure that recipients outside Singapore protect your data to a standard comparable to the PDPA, for example through contractual clauses.
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
                  <strong>If you are not selected:</strong> we keep your application for 12 months after the role is filled or closed, then erase it. If you agree, we will keep it for up to 24 months to consider you for future roles. You can ask us to erase it sooner.
                </li>
                <li>
                  <strong>If you join us:</strong> your application becomes part of your employee record and is covered by our employee privacy notice.
                </li>
              </ul>
              <p>
                We erase personal data once the purpose is served or you withdraw consent, unless the law requires us to keep it. As required by the DPDP Rules, we keep limited processing records (such as access logs) for at least one year. Under the PDPA, we stop keeping your data once it no longer serves the purpose for which it was collected or any legal or business purpose.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                8. How we protect your data
              </h2>
              <p>
                We use reasonable security safeguards, designed with reference to IS/ISO/IEC 27001, including encryption, role-based and least-privilege access, access logging, vendor due diligence and confidentiality obligations for our staff.
              </p>
              <p>
                If a personal data breach affects you, we will tell you without delay. We will also report it as the law requires, including to the Data Protection Board of India, to CERT-In, and, for notifiable breaches under the PDPA, to Singapore’s Personal Data Protection Commission (PDPC) within three calendar days of assessing that the breach is notifiable.
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
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Access:</strong> a summary of your personal data we process, what we do with it, and who we have shared it with.</li>
                    <li><strong>Correction and erasure:</strong> to correct, complete or update your data, or to erase data we no longer need.</li>
                    <li><strong>Withdraw consent:</strong> at any time, as easily as you gave it (see section 10).</li>
                    <li><strong>Grievance redressal:</strong> to raise a complaint with our Grievance Officer (section 12).</li>
                    <li><strong>Nomination:</strong> nominate another person to exercise your rights if you die or become incapacitated.</li>
                    <li><strong>Complain:</strong> to the Data Protection Board of India, once you have used our grievance process.</li>
                  </ul>
                  <p className="text-xs text-[#0f1b3d]/65 mt-2">
                    We will respond to requests and grievances within 30 days, and in any event within the time allowed by law. Under the DPDP Act, you must give us accurate information and must not raise false or frivolous grievances.
                  </p>
                </div>

                <div className="pt-2">
                  <h3 className="text-base font-bold text-[#0f1b3d] mb-1">Under Singapore law</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Access:</strong> a copy of your personal data we hold and how it has been used or disclosed in the past year.</li>
                    <li><strong>Correction:</strong> to correct errors or omissions in your data.</li>
                    <li><strong>Withdraw consent:</strong> by giving us reasonable notice (see section 10).</li>
                    <li><strong>Complain:</strong> to the PDPC (pdpc.gov.sg).</li>
                  </ul>
                  <p className="text-xs text-[#0f1b3d]/65 mt-2">
                    We will respond to access and correction requests within 30 days or tell you when we will. We may charge a reasonable fee for access requests and will tell you the fee in advance.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 border border-[#0f1b3d]/10 mt-3 text-sm">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">How to make a request</h4>
                  <p>
                    Email <a href="mailto:privacy@pfundit.com?subject=Applicant%20data%20request" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">privacy@pfundit.com</a> with the subject line <strong>“Applicant data request”</strong> and tell us which right you want to exercise. We may ask you to verify your identity before we act on your request.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                10. Withdrawing your consent
              </h2>
              <p>
                You can withdraw consent at any time by emailing <a href="mailto:privacy@pfundit.com" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">privacy@pfundit.com</a> or <a href="mailto:careers@pfundit.com" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">careers@pfundit.com</a>. Once you do, we will stop processing your data and erase it (and ask our service providers to do the same), unless the law requires us to keep it.
              </p>
              <p>
                Withdrawal does not affect processing before you withdrew. If you withdraw consent while your application is under review, we will not be able to continue considering you for the role.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                11. Applicants under 18
              </h2>
              <p>
                Our roles are open only to people aged 18 or over. We do not knowingly collect personal data from anyone under 18. If we learn that we have, we will erase it.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3 pt-6 border-t border-[#0f1b3d]/10">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f1b3d] tracking-tight">
                12. Contact us
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">India</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    Pfundit Capital Private Ltd.<br />
                    Prestige Central, 36 Infantry Road, M.G. Road,<br />
                    Bengaluru 560001, India<br />
                    Email: <a href="mailto:privacy@pfundit.com" className="font-medium text-[#D4A437] underline">privacy@pfundit.com</a><br />
                    Hours: Monday to Friday, 10:00–18:00 IST
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 border border-[#0f1b3d]/10">
                  <h4 className="font-bold text-[#0f1b3d] mb-1">Singapore</h4>
                  <p className="text-xs leading-relaxed text-[#0f1b3d]/70">
                    Pfundit Pte. Ltd.<br />
                    14B, Stanley Street,<br />
                    Singapore 068733<br />
                    Email: <a href="mailto:privacy@pfundit.com" className="font-medium text-[#D4A437] underline">privacy@pfundit.com</a>
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
                13. Language and changes to this notice
              </h2>
              <p>
                You can ask for this notice in English or in any language listed in the Eighth Schedule to the Constitution of India by emailing <a href="mailto:privacy@pfundit.com" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">privacy@pfundit.com</a>.
              </p>
              <p>
                We may update this notice from time to time. We will post the updated version on pfundit.com/hiring with a new effective date and, if the changes are significant, tell applicants whose applications are under review.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
