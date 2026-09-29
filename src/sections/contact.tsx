"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TalkToUsButton } from "@/components/button";

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showContactModal || showInvestorModal) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowContactModal(false);
          setShowInvestorModal(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [showContactModal, showInvestorModal]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const runFromTo = (selector: string, fromVars: any, toVars: any) => {
        const els = section.querySelectorAll(selector);
        if (!els || els.length === 0) return;
        gsap.fromTo(els as any, fromVars, toVars);
      };

      runFromTo(
        "[data-contact-reveal]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-20 bg-[#F4F3EF]"
      id="contact"
    >
      <div className="layout-shell editorial-container relative z-10 px-4 sm:px-8">
        <div className="mx-auto max-w-[80rem] px-8 py-20 sm:px-12 md:py-24 relative bg-tier-anchor rounded-[2.5rem] overflow-hidden shadow-xl border border-white/10">

          {/* Arc illustration as background decor */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <circle cx="600" cy="300" r="380" fill="none" stroke="#d3a337" strokeWidth="1.5" opacity="0.18" />
              <circle cx="600" cy="300" r="300" fill="none" stroke="#d3a337" strokeWidth="1.5" opacity="0.12" />
              <circle cx="600" cy="300" r="220" fill="none" stroke="#d3a337" strokeWidth="1.5" opacity="0.08" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div data-contact-reveal className="header-group">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
                <span className="section-label">LET'S HAVE A CONVERSATION</span>
              </div>
              <h2
                className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-white header-heading"
              >
                The right conversations shape the institution.
              </h2>
              <p className="mx-auto max-w-[52rem] typo-body text-white/65">
                Pfundit is at the stage where early relationships define the platform. We welcome conversations with institutional investors, family offices, venture capital, debt providers, banking counterparties, technology partners and senior advisors who want to engage at the ground floor.
              </p>
            </div>

            {/* Action Buttons: Stacked & Centered */}
            <div
              data-contact-reveal
              className="mt-10 flex flex-col items-center justify-center md:mt-12"
            >
              <div className="flex flex-col items-center gap-3.5 w-full max-w-sm">
                <TalkToUsButton
                  onClick={() => setShowContactModal(true)}
                  className="w-full sm:w-[280px]"
                />

                <motion.button
                  type="button"
                  onClick={() => setShowInvestorModal(true)}
                  className="typo-button inline-flex w-full sm:w-[280px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-[0.92rem] font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/40 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] cursor-pointer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
                  <span>Investor Enquiries</span>
                </motion.button>

                <p className="mt-1 max-w-[340px] text-center text-[11.5px] sm:text-xs leading-relaxed text-white/55">
                  For institutional and accredited investors only. Nothing on this website is an offer of securities.
                </p>
              </div>
            </div>

            {/* General Contact Modal ("Write to Us") */}
            {showContactModal && mounted && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto text-left">
                <div
                  className="fixed inset-0 z-[999998] bg-[#091024]/80 backdrop-blur-md transition-opacity"
                  onClick={() => setShowContactModal(false)}
                  aria-hidden="true"
                />
                <div className="relative z-[999999] w-full max-w-2xl my-auto">
                  <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_25px_70px_rgba(11,19,43,0.35)] border border-slate-200/90">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4.5 sm:px-7 shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D3A337] ring-4 ring-[#D3A337]/20" />
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-[#0f1b3d]">Write to Us</h3>
                          <p className="text-xs font-medium text-slate-500">Get in touch with the Pfundit team</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowContactModal(false)}
                        className="rounded-full p-2 text-slate-400 hover:text-[#0f1b3d] hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close modal"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7">
                      <ContactForm onClose={() => setShowContactModal(false)} />
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* Investor Enquiries Modal */}
            {showInvestorModal && mounted && typeof document !== 'undefined' && createPortal(
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto text-left">
                <div
                  className="fixed inset-0 z-[999998] bg-[#091024]/80 backdrop-blur-md transition-opacity"
                  onClick={() => setShowInvestorModal(false)}
                  aria-hidden="true"
                />
                <div className="relative z-[999999] w-full max-w-2xl my-auto">
                  <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_25px_70px_rgba(11,19,43,0.35)] border border-slate-200/90">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4.5 sm:px-7 shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D3A337] ring-4 ring-[#D3A337]/20" />
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-[#0f1b3d]">Investor Enquiries</h3>
                          <p className="text-xs font-medium text-slate-500">Institutional &amp; Accredited Investor Access</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowInvestorModal(false)}
                        className="rounded-full p-2 text-slate-400 hover:text-[#0f1b3d] hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Close modal"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7">
                      <InvestorEnquiryForm onClose={() => setShowInvestorModal(false)} />
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const validate = () => {
    const next: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!email.trim()) next.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email";
    if (!message.trim()) next.message = "Please enter a message";
    return next;
  };

  const focusFirstError = (err: typeof errors) => {
    if (err.name) nameRef.current?.focus();
    else if (err.email) emailRef.current?.focus();
    else if (err.message) messageRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Failed to submit the form. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success && onClose) {
      const t = setTimeout(() => onClose(), 900);
      return () => clearTimeout(t);
    }
  }, [success, onClose]);

  return (
    <div>
      {success ? (
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 sm:p-8 text-center text-[#0f1b3d]">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-lg font-bold">Thanks — your message has been received.</div>
          <p className="mt-2 text-sm text-slate-600">We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-none bg-transparent p-0">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">Name</label>
              <input
                ref={nameRef}
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">Email</label>
              <input
                ref={emailRef}
                required
                placeholder="jane@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">Message</label>
            <textarea
              ref={messageRef}
              required
              rows={5}
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.message ? "border-red-500 ring-1 ring-red-500" : ""}`}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          <div className="shrink-0 pt-1">
            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0f1b3d] py-3.5 text-[0.95rem] font-bold text-white shadow-lg shadow-[#0f1b3d]/20 transition-all hover:bg-[#162752] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function InvestorEnquiryForm({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef<HTMLInputElement | null>(null);
  const orgRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const checkRef = useRef<HTMLInputElement | null>(null);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!organisation.trim()) next.organisation = "Please enter your organisation";
    if (!role.trim()) next.role = "Please enter your role";
    if (!email.trim()) next.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address";
    if (!country.trim()) next.country = "Please enter your country";
    if (!investorType) next.investorType = "Please select an investor type";
    if (!confirmed) next.confirmed = "Confirmation is required to submit an enquiry";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.organisation) orgRef.current?.focus();
      else if (nextErrors.role) roleRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.country) countryRef.current?.focus();
      else if (nextErrors.investorType) selectRef.current?.focus();
      else if (nextErrors.confirmed) checkRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications/investor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          organisation: organisation.trim(),
          role: role.trim(),
          email: email.trim(),
          country: country.trim(),
          investorType,
          confirmed,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to submit enquiry");
      }

      setSuccess(true);
      setName("");
      setOrganisation("");
      setRole("");
      setEmail("");
      setCountry("");
      setInvestorType("");
      setConfirmed(false);
      setErrors({});
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to submit your enquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success ? (
        <div className="flex flex-col items-center rounded-2xl bg-white p-6 sm:p-8 text-center text-[#0f1b3d]">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D3A337]/15 text-[#D3A337]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold tracking-tight text-[#0f1b3d]">Request Received</h4>
          <p className="mt-3 max-w-lg text-[0.92rem] leading-relaxed text-slate-600">
            Thank you. Our team will review your request and contact you. Investor materials are shared only after review and under a confidentiality agreement.
          </p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#0f1b3d] px-7 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#162752] cursor-pointer shadow-md"
            >
              Done
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Opening Statement */}
          <div className="rounded-xl border border-[#D3A337]/50 bg-[#FBF9F4] p-4 text-[#0f1b3d] shadow-sm">
            <div className="mb-1.5 flex items-center gap-2">
              <svg className="h-4 w-4 text-[#D3A337] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#0f1b3d]">
                Notice to Prospective Investors
              </span>
            </div>
            <p className="text-[0.82rem] sm:text-[0.85rem] leading-relaxed text-slate-700">
              Investor materials are available only to institutional investors and accredited investors (as defined in the Securities and Futures Act 2001 of Singapore) and equivalent professional investors in other jurisdictions, and only where lawful. Requests are reviewed individually and materials are shared only under a confidentiality agreement. Any investment would be made only on the basis of definitive documents, not the Site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Name & Email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Name <span className="text-[#D3A337]">*</span>
                </label>
                <input
                  ref={nameRef}
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Email <span className="text-[#D3A337]">*</span>
                </label>
                <input
                  ref={emailRef}
                  required
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Organisation & Role */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Organisation <span className="text-[#D3A337]">*</span>
                </label>
                <input
                  ref={orgRef}
                  required
                  placeholder="Acme Capital Management"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.organisation ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.organisation && <p className="mt-1 text-xs text-red-500">{errors.organisation}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Role <span className="text-[#D3A337]">*</span>
                </label>
                <input
                  ref={roleRef}
                  required
                  placeholder="Managing Director / Partner"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.role ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
              </div>
            </div>

            {/* Country & Investor Type */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Country <span className="text-[#D3A337]">*</span>
                </label>
                <input
                  ref={countryRef}
                  required
                  placeholder="e.g. Singapore"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] placeholder:text-slate-400 placeholder:font-normal transition-all focus:border-[#0f1b3d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 ${errors.country ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0f1b3d]">
                  Investor Type <span className="text-[#D3A337]">*</span>
                </label>
                <select
                  ref={selectRef}
                  required
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-medium text-[#0f1b3d] transition-all focus:border-[#0f1b3d] focus:outline-none focus:ring-2 focus:ring-[#0f1b3d]/10 hover:border-slate-400 cursor-pointer ${errors.investorType ? "border-red-500 ring-1 ring-red-500" : ""}`}
                >
                  <option value="" disabled className="text-slate-400 font-normal">Select investor type...</option>
                  <option value="Institutional investor" className="text-[#0f1b3d]">Institutional investor</option>
                  <option value="Accredited investor" className="text-[#0f1b3d]">Accredited investor</option>
                  <option value="Professional investor (other jurisdiction)" className="text-[#0f1b3d]">Professional investor (other jurisdiction)</option>
                  <option value="Other" className="text-[#0f1b3d]">Other</option>
                </select>
                {errors.investorType && <p className="mt-1 text-xs text-red-500">{errors.investorType}</p>}
              </div>
            </div>

            {/* Required Checkbox */}
            <div className="pt-2">
              <label className={`flex items-start gap-3 cursor-pointer select-none rounded-xl border p-3.5 transition-colors ${errors.confirmed ? "border-red-400 bg-red-50/50" : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"}`}>
                <input
                  ref={checkRef}
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0f1b3d] focus:ring-[#D3A337] accent-[#0f1b3d]"
                />
                <span className="text-left text-[0.8rem] sm:text-[0.84rem] leading-relaxed text-slate-700">
                  I confirm that I am, or represent, an institutional or accredited investor (or equivalent professional investor in my jurisdiction). I understand that nothing on this website is an offer of securities, and that any materials will be shared only after review and under a confidentiality agreement.
                </span>
              </label>
              {errors.confirmed && <p className="mt-1 text-xs text-red-500">{errors.confirmed}</p>}
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0f1b3d] py-3.5 text-[0.95rem] font-bold text-white shadow-lg shadow-[#0f1b3d]/20 transition-all hover:bg-[#162752] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting Enquiry...
                  </>
                ) : (
                  "Submit Investor Enquiry"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

