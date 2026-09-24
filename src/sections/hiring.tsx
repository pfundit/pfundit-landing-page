'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';

/* ─────────────────── data ─────────────────── */
const categories = ['All Roles', 'Leadership', 'Technology', 'Business'] as const;
type Category = typeof categories[number];

export type Role = {
  id: string;
  title: string;
  type: string;
  category: Category;
  tags: string[];
  description?: string;
  cardBlurb?: string;
  location?: string;
  jdUrl?: string;
};

/* ─────────────────── helpers ─────────────────── */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
      <path d="M4 10h12M10 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="skeleton-card relative rounded-[1.25rem] border border-[#0f1b3d]/10 bg-white/75 p-5 sm:p-6 mb-3.5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
        <div className="min-w-0">
          {/* Header Skeleton: ID, Title, Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3">
            <div className="h-4 w-6 rounded bg-[#D4A437]/35" />
            <div className="h-5 sm:h-6 w-52 sm:w-64 rounded-md bg-[#0f1b3d]/16" />
            <div className="h-5 w-16 rounded-full bg-[#D4A437]/20" />
            <div className="h-5 w-20 rounded-full bg-[#0f1b3d]/12" />
            <div className="h-4 w-20 rounded bg-[#0f1b3d]/12" />
          </div>

          {/* Blurb Skeleton */}
          <div className="space-y-2 max-w-2xl mt-2">
            <div className="h-3.5 w-full rounded bg-[#0f1b3d]/12" />
            <div className="h-3.5 w-3/4 rounded bg-[#0f1b3d]/10" />
          </div>

          {/* Tags Skeleton */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <div className="h-5 w-20 rounded-full bg-[#0f1b3d]/12" />
            <div className="h-5 w-24 rounded-full bg-[#0f1b3d]/12" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 lg:mt-0 lg:flex-nowrap shrink-0">
          <div className="h-8 w-28 rounded-full bg-[#0f1b3d]/14" />
          <div className="h-8 w-24 rounded-full bg-[#0f1b3d]/22" />
        </div>
      </div>
    </div>
  );
}

export function HiringNotice() {
  return (
    <div className="w-full mt-14 pt-8 border-t border-[#0f1b3d]/12 space-y-4 text-[13px] sm:text-[13.5px] text-[#0f1b3d]/70 leading-[1.68]">
      <div>
        <h5 className="font-bold text-[#0f1b3d] mb-1 text-[13.5px] sm:text-[14px]">Important notice</h5>
        <p>
          Pfundit Capital Private Ltd. (CIN: U64910KA2026FTC227353; registered office: Prestige Central, 36 ,Infantry Road, M.G. Road, Bangalore – 560001, India) is a subsidiary of Pfundit Pte. Ltd., Singapore. The company is at a pre-application stage for registration with the Reserve Bank of India as a Non-Banking Financial Company. It does not hold a Certificate of Registration from the RBI and does not currently offer loans or carry on any lending or other financial business. The roles on this page are to build the company’s capabilities ahead of, and subject to, registration. Nothing on this page is an offer of credit or of any financial product or service.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-[#0f1b3d] mb-1 text-[13.5px] sm:text-[14px]">No recruitment fees</h5>
        <p>
          Pfundit does not charge candidates any fee at any stage of recruitment, and does not authorise any agent to do so. Please report any such request to{' '}
          <a href="mailto:careers@pfundit.com" className="font-medium text-[#0f1b3d] underline hover:text-[#D4A437]">
            careers@pfundit.com
          </a>.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-[#0f1b3d] mb-1 text-[13.5px] sm:text-[14px]">Your personal data</h5>
        <p>
          We use the information you share only to assess your application and contact you about roles at Pfundit, in line with the Digital Personal Data Protection Act, 2023. Your data may be accessed by our parent company, Pfundit Pte. Ltd., Singapore, for hiring decisions. See our{' '}
          <Link href="/hiring/privacy" className="font-semibold text-[#D4A437] underline hover:text-[#b49050]">
            privacy notice
          </Link>{' '}
          to learn how to access, correct or withdraw your data.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-[#0f1b3d] mb-1 text-[13.5px] sm:text-[14px]">No offer of employment</h5>
        <p>
          The roles on this page are described for information only and are not offers of employment. Pfundit may change, pause or close any role at its discretion. Please read the Important Information for Applicants in each downloadable job description before applying.
        </p>
      </div>

      <div>
        <h5 className="font-bold text-[#0f1b3d] mb-1 text-[13.5px] sm:text-[14px]">Equal opportunity</h5>
        <p>
          Pfundit is an equal-opportunity employer. We welcome applications from all qualified candidates, including persons with disabilities.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── component ─────────────────── */
export function Hiring({ initialRoles = [] }: { initialRoles?: Role[] } = {}) {
  const [activeCategory, setActiveCategory] = useState<Category>('All Roles');
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isLoadingRoles, setIsLoadingRoles] = useState(initialRoles.length === 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [detailedRole, setDetailedRole] = useState<Role | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  // If initialRoles was empty or on client-side navigation, fetch strictly from database endpoint
  useEffect(() => {
    if (initialRoles.length === 0) {
      setIsLoadingRoles(true);
      fetch('/api/jobs')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setRoles(data);
          }
        })
        .catch((error) => console.error('Failed to fetch roles from database:', error))
        .finally(() => setIsLoadingRoles(false));
    }
  }, [initialRoles.length]);

  const handleApplyClick = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setFormStatus('idle');
    setIsModalOpen(true);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/applications/jobs', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormStatus('success');
        setTimeout(() => setIsModalOpen(false), 3000);
      } else {
        console.error('Error submitting application');
        setFormStatus('error');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  const filtered = activeCategory === 'All Roles'
    ? roles
    : roles.filter((r) => r.category === activeCategory);

  return (
    <section
      id="hiring"
      className="relative overflow-hidden bg-[#F0F5FF]"
    >
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-[-6%] top-32 h-72 w-72 rounded-full bg-gold/8 blur-[120px]" />
        <div className="absolute right-[-4%] top-1/3 h-80 w-80 rounded-full bg-navy/5 blur-[150px]" />
      </div>

      <div className="layout-shell editorial-container relative z-10" style={{ paddingTop: '5.5rem', paddingBottom: '4rem' }}>

        {/* ── category filter nav ── */}
        <div data-hr="filter-nav" className="w-full mb-8">
          <div className="grid w-full gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
              {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  borderRadius: 999,
                  padding: '0.5rem 1.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  border: isActive
                    ? '1px solid rgba(15,27,61,0.85)'
                    : '1px solid rgba(15,27,61,0.12)',
                  background: isActive
                    ? '#0f1b3d'
                    : 'rgba(255,255,255,0.55)',
                  color: isActive ? '#ffffff' : 'rgba(15,27,61,0.7)',
                  boxShadow: isActive
                    ? '0 8px 24px rgba(15,27,61,0.14)'
                    : '0 2px 8px rgba(15,27,61,0.04)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  outline: 'none',
                  width: '100%'
                }}
              >
                {cat}
                {cat !== 'All Roles' && (
                  <span style={{
                    marginLeft: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(15,27,61,0.45)',
                  }}>
                    {roles.filter(r => r.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
            </div>
            {/* count pill */}
            <div className="justify-self-start lg:justify-self-end">
              <div style={{
                padding: '0.4rem 1rem',
                borderRadius: 999,
                background: 'rgba(212,164,55,0.1)',
                border: '1px solid rgba(212,164,55,0.25)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#D4A437',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}>
                {filtered.length} open
              </div>
            </div>
          </div>
        </div>

        {/* ── role list ── */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {isLoadingRoles ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-[#0f1b3d]/50">
                No roles found in this category.
              </div>
            ) : filtered.map((role) => (
              <div
                key={role.id}
                className="group relative rounded-[1.25rem] border border-[#0f1b3d]/10 bg-white/80 p-5 sm:p-6 backdrop-blur-sm hover:border-[#D4A437]/50 hover:shadow-md mb-3.5"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="min-w-0">
                    {/* Header: ID + Title + Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="font-mono text-xs font-bold tracking-widest text-[#D4A437]">
                        {role.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0f1b3d] leading-snug">
                        {role.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A437]/10 px-2.5 py-0.5 text-[0.7rem] font-bold text-[#D4A437]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
                        {role.type}
                      </span>
                      <span className="rounded-full bg-[#0f1b3d]/5 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#0f1b3d]/65">
                        {role.category}
                      </span>
                      {role.location && (
                        <span className="text-[0.72rem] font-medium text-[#0f1b3d]/55 flex items-center gap-1">
                          📍 {role.location}
                        </span>
                      )}
                    </div>

                    {/* Card Blurb */}
                    <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#0f1b3d]/70 max-w-2xl mt-1">
                      {role.cardBlurb || role.description?.replace(/<[^>]+>/g, '').slice(0, 160) + '...'}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {role.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#0f1b3d]/10 bg-[#F0F5FF]/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-[#0f1b3d]/65"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2.5 lg:mt-0 lg:flex-nowrap shrink-0">
                    <button
                      type="button"
                      onClick={() => setDetailedRole(role)}
                      className="inline-flex items-center justify-center rounded-full border border-[#0f1b3d]/15 bg-white px-4 py-2 text-xs font-bold tracking-wider text-[#0f1b3d] transition-all hover:bg-[#F0F5FF] hover:border-[#0f1b3d]/30"
                    >
                      View Role Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyClick(role.title)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0f1b3d] px-5 py-2 text-xs font-bold tracking-wider text-white transition-all hover:bg-[#0f1b3d]/90 shadow-sm"
                    >
                      Apply Now
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hiring-page notice (place once, at the foot of the page) ── */}
        <HiringNotice />

      </div>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0f1b3d]/60 p-4 backdrop-blur-sm sm:p-6 md:p-8">
          <div className="relative flex max-h-[90vh] w-full max-w-[58rem] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl md:rounded-[2rem]">
            <div className="shrink-0 border-b border-[#0f1b3d]/10 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 md:px-8">
              <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="pr-4 text-[1.35rem] font-bold tracking-tight text-[#0f1b3d] sm:text-[1.6rem] md:text-[1.8rem]">Application Form</h3>
                    <p className="mt-1 text-[0.9rem] text-[#0f1b3d]/60 sm:text-[0.95rem]">
                      Applying for: <span className="font-bold text-[#D4A437]">{selectedRole}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#0f1b3d]/10 bg-white px-2 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/60 transition-colors hover:border-[#0f1b3d]/20 hover:text-[#0f1b3d] sm:px-2.5 sm:py-2.5"
                    aria-label="Close application form"
                    type="button"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid flex-1 min-h-0 gap-0 overflow-hidden lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]">
                <aside className="border-b border-[#0f1b3d]/10 bg-[#F0F5FF]/45 px-5 py-5 sm:px-6 sm:py-6 lg:border-b-0 lg:border-r lg:px-7 lg:py-7 overflow-y-auto">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4A437]">Role Overview</p>
                  <h4 className="mt-2 text-[1rem] font-bold tracking-tight text-[#0f1b3d] sm:text-[1.1rem]">What we are hiring for</h4>

                  {(() => {
                    const current = roles.find((r) => r.title === selectedRole);
                    if (!current) return null;
                    return (
                      <div className="mt-4 rounded-2xl border border-[#0f1b3d]/10 bg-white/90 p-4 sm:p-5 shadow-[0_8px_24px_rgba(15,27,61,0.04)]">
                        {current.cardBlurb && (
                          <p className="mb-3 text-xs font-semibold text-[#0f1b3d] border-b border-[#0f1b3d]/10 pb-2.5 leading-relaxed">
                            {current.cardBlurb}
                          </p>
                        )}
                        <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/70">Role Details</h4>
                        <div
                          className="prose prose-sm text-xs leading-relaxed text-[#0f1b3d]/80 space-y-2 prose-headings:text-[#0f1b3d] prose-headings:font-bold prose-headings:text-xs prose-headings:mt-3 prose-headings:mb-1 prose-ul:list-disc prose-ul:pl-4 prose-a:text-[#D4A437] prose-a:underline font-normal"
                          dangerouslySetInnerHTML={{ __html: current.description || '' }}
                        />
                        {current.jdUrl && (
                          <div className="mt-4 pt-3 border-t border-[#0f1b3d]/10">
                            <a
                              href={current.jdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A437] underline hover:text-[#b49050]"
                            >
                              📄 View Full Job Description&rarr;
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </aside>

                <div className="flex min-h-0 flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                    {formStatus === 'success' ? (
                      <div className="flex flex-col items-center py-10 text-center sm:py-12">
                        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-16 sm:w-16">
                          <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="mb-2 text-[1.2rem] font-bold text-[#0f1b3d] sm:text-[1.4rem]">Application Received</h4>
                        <p className="text-[0.9rem] text-[#0f1b3d]/70 sm:text-[0.95rem]">Thank you for applying. We will be in touch shortly.</p>
                      </div>
                    ) : (
                      <form id="application-form" onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-4.5">
                        <input type="hidden" name="subject" value={`New Application for ${selectedRole}`} />
                        <input type="hidden" name="Role" value={selectedRole} />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/75">Full Name</label>
                            <input required type="text" name="Name" className="w-full rounded-xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/60 px-4 py-2.5 text-[0.95rem] text-[#0f1b3d] transition-colors focus:border-[#D4A437] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4A437]" placeholder="Jane Doe" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/75">Email</label>
                            <input required type="email" name="Email" className="w-full rounded-xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/60 px-4 py-2.5 text-[0.95rem] text-[#0f1b3d] transition-colors focus:border-[#D4A437] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4A437]" placeholder="jane@example.com" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/75">LinkedIn Profile (Optional)</label>
                            <input type="url" name="LinkedIn" className="w-full rounded-xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/60 px-4 py-2.5 text-[0.95rem] text-[#0f1b3d] transition-colors focus:border-[#D4A437] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4A437]" placeholder="https://linkedin.com/in/..." />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/75">Resume Upload (Required)</label>
                            <input required type="file" name="Resume" accept=".pdf,.doc,.docx" className="w-full rounded-xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/60 px-4 py-2.5 text-[0.9rem] text-[#0f1b3d] file:mr-4 file:rounded-full file:border-0 file:bg-[#0f1b3d] file:px-4 file:py-2 file:text-[0.78rem] file:font-bold file:text-white transition-colors focus:border-[#D4A437] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4A437]" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/75">Why Pfundit?</label>
                          <textarea required name="Why Pfundit" rows={3} className="w-full resize-none rounded-xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/60 px-4 py-2.5 text-[0.95rem] text-[#0f1b3d] transition-colors focus:border-[#D4A437] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4A437]" placeholder="Tell us why you are a great fit..." />
                        </div>

                        {/* Privacy & Talent Pool Consents */}
                        <div className="flex flex-col gap-2.5 pt-1">
                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0f1b3d]/80 leading-relaxed select-none">
                            <input required type="checkbox" name="privacyConsent" className="mt-0.5 h-4 w-4 rounded border-[#0f1b3d]/25 text-[#0f1b3d] focus:ring-[#D4A437] accent-[#0f1b3d]" />
                            <span>
                              I have read the{' '}
                              <Link href="/hiring/privacy" target="_blank" className="font-semibold text-[#0f1b3d] underline hover:text-[#D4A437]">
                                Applicant Privacy Notice
                              </Link>{' '}
                              and consent to Pfundit processing my personal data as described. <span className="text-red-500">*</span>
                            </span>
                          </label>

                          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0f1b3d]/70 leading-relaxed select-none">
                            <input type="checkbox" name="talentPoolConsent" className="mt-0.5 h-4 w-4 rounded border-[#0f1b3d]/25 text-[#0f1b3d] focus:ring-[#D4A437] accent-[#0f1b3d]" />
                            <span>
                              Keep my application on file for up to 24 months to consider me for future opportunities.
                            </span>
                          </label>
                        </div>

                        {formStatus === 'error' && (
                          <p className="text-sm font-medium text-red-500">Something went wrong. Please check your access key or try again.</p>
                        )}
                      </form>
                    )}
                  </div>

                  {formStatus !== 'success' && (
                    <div className="shrink-0 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 lg:px-7">
                      <button
                        type="submit"
                        form="application-form"
                        disabled={formStatus === 'submitting'}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0f1b3d] py-3 text-[0.9rem] font-bold text-white transition-all hover:bg-[#0f1b3d]/90 hover:shadow-lg disabled:opacity-70 sm:py-3.5 sm:text-[0.95rem]"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <svg className="h-5 w-5 animate-spin text-white/70" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                            Submitting...
                          </>
                        ) : 'Submit Application'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Role Details Modal ── */}
      {detailedRole && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0f1b3d]/60 p-4 backdrop-blur-sm sm:p-6 md:p-8">
          <div className="relative flex max-h-[90vh] w-full max-w-[50rem] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="shrink-0 border-b border-[#0f1b3d]/10 bg-[#F8FAFF] px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4A437] uppercase tracking-[0.2em] mb-1">
                    <span>Role {detailedRole.id}</span>
                    <span>·</span>
                    <span>{detailedRole.category}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1b3d]">
                    {detailedRole.title}
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs text-[#0f1b3d]/65 font-medium">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4A437]/10 px-2.5 py-0.5 font-bold text-[#D4A437]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
                      {detailedRole.type}
                    </span>
                    {detailedRole.location && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0f1b3d]/5 px-2.5 py-0.5 text-[#0f1b3d]/70">
                        📍 {detailedRole.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setDetailedRole(null)}
                  className="rounded-full border border-[#0f1b3d]/10 bg-white p-2.5 text-[#0f1b3d]/60 transition-colors hover:bg-[#F0F5FF] hover:text-[#0f1b3d]"
                  type="button"
                  aria-label="Close role details"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {detailedRole.cardBlurb && (
                <div className="mb-6 rounded-2xl border border-[#D4A437]/20 bg-[#D4A437]/5 p-4 sm:p-5 text-sm font-semibold leading-relaxed text-[#0f1b3d]">
                  {detailedRole.cardBlurb}
                </div>
              )}

              {/* Rich Description */}
              <div
                className="prose prose-sm max-w-none text-[0.92rem] leading-relaxed text-[#0f1b3d]/85 space-y-3 prose-headings:text-[#0f1b3d] prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1.5 prose-a:text-[#D4A437] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#b49050]"
                dangerouslySetInnerHTML={{ __html: detailedRole.description || '' }}
              />

              {/* JD Document Link directly below description */}
              {detailedRole.jdUrl && (
                <div className="mt-4">
                  <a
                    href={detailedRole.jdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#D4A437] hover:text-[#b49050] hover:underline transition-colors"
                  >
                    View Full Job Description Document &rarr;
                  </a>
                </div>
              )}

              {/* Tags moved to bottom */}
              {detailedRole.tags && detailedRole.tags.length > 0 && (
                <div className="mt-6 pt-4 pb-2 border-t border-[#0f1b3d]/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {detailedRole.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#0f1b3d]/10 bg-[#F0F5FF] px-2.5 py-1 text-xs font-semibold text-[#0f1b3d]/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#0f1b3d]/10 bg-[#F8FAFF] px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setDetailedRole(null)}
                className="rounded-full border border-[#0f1b3d]/12 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0f1b3d] transition-colors hover:bg-[#F0F5FF]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = detailedRole.title;
                  setDetailedRole(null);
                  handleApplyClick(title);
                }}
                className="rounded-full bg-[#0f1b3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0f1b3d]/90 shadow-md"
              >
                Apply for this Position &rarr;
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
