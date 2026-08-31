import React from 'react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(15,27,61,0.1)] bg-[#0f1b3d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8%] h-[22rem] w-[22rem] rounded-full bg-[#D4A437]/15 blur-[130px]" />
        <div className="absolute right-[-8%] top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#22396e]/40 blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="layout-shell editorial-container py-14 sm:py-16 lg:py-18 relative z-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] lg:gap-12">
          <div>
            <p className="text-[1.7rem] font-bold tracking-[-0.05em] text-white">Pfundit</p>
            <p className="mt-3 max-w-[32rem] text-[0.82rem] leading-[1.7] text-white/58">
              A Singapore-incorporated holding company building regulated, technology-enabled credit infrastructure for Asia's real economy.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#D4A437] shadow-[0_0_6px_rgba(212,164,55,0.7)]" />
              <span className="text-[0.65rem] text-white/40">Singapore · ACRA Registered</span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-3.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/32">Navigate</h4>
              <div className="space-y-2 text-[0.8rem] text-white/58">
                {[['#mission', 'Mission & Vision'], ['#thesis', 'What We Are Building'], ['#ai-edge', 'AI Edge'], ['#leadership', 'Founders'], ['#stakeholders', 'Stakeholders'], ['#governance', 'Governance'], ['#contact', 'Contact']].map(([href, label]) => (
                  <p key={label}><a href={href} className="transition-colors hover:text-[#D4A437]">{label}</a></p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/32">Registered Entity</h4>
              <div className="space-y-1.5 text-[0.78rem] text-white/55">
                <p>Pfundit Pte. Ltd.</p>
                <p>Singapore (ACRA) · Incorporated 2025</p>
                <p>UEN: 202544131H</p>
                <p>Registered office: Singapore</p>
                <p>info@pfundit.com</p>
              </div>
            </div>
            <div>
              <h4 className="mb-3.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/32">Legal & Policies</h4>
              <div className="space-y-2 text-[0.78rem] text-white/55">
                <p>Privacy Policy</p>
                <p>Terms of Use</p>
                <p>Cookie Notice</p>
                <p>Responsible Disclosure</p>
                <p>Code of Conduct</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <h4 className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/28">Regulatory Disclosure</h4>
          <div className="grid gap-3 text-[0.75rem] leading-[1.65] text-white/42">
            <p>
              Pfundit Pte. Ltd. (&quot;Pfundit&quot;, &quot;we&quot;) is a private limited company incorporated in Singapore in 2025 and registered with ACRA. Pfundit is in the process of incorporating a wholly-owned subsidiary in India, which intends to register with the Reserve Bank of India (RBI) as an NBFC-ND-ICC. NBFC application is in pre-application stage as of the date of this website no RBI registration has been granted, and no lending activity will commence until it is. Nothing on this website constitutes an offer or solicitation to buy or sell any security, an offer of credit, or investment, legal, tax or financial advice.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-[0.65rem] text-white/32 lg:flex-row lg:items-center lg:justify-between">
            <p>© 2026 Pfundit Pte. Ltd. · All Rights Reserved.</p>
            <p>Singapore HQ · India NBFC (in formation) · Pan-Asia Lending Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
