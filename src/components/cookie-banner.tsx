'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CookiePreferences {
  strictlyNecessary: boolean;
  functional: boolean;
  analytics: boolean;
  consentId: string;
  timestamp: string;
  version: string;
}

const COOKIE_STORAGE_KEY = 'pfundit_cookie_consent';
const NOTICE_VERSION = '1.0';

export function CookieBanner() {
  const [hasDecided, setHasDecided] = useState<boolean | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        // Check if consent has expired (12 months = 365 days)
        const consentDate = new Date(parsed.timestamp).getTime();
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - consentDate < oneYear && parsed.version === NOTICE_VERSION) {
          setHasDecided(true);
          setPreferences({
            functional: parsed.functional,
            analytics: parsed.analytics,
          });
          return;
        }
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    setHasDecided(false);
  }, []);

  const saveConsent = (functional: boolean, analytics: boolean) => {
    const consentRecord: CookiePreferences = {
      strictlyNecessary: true,
      functional,
      analytics,
      consentId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      version: NOTICE_VERSION,
    };

    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consentRecord));
      // Also set cookie so backend / edge can detect if needed
      document.cookie = `${COOKIE_STORAGE_KEY}=${encodeURIComponent(
        JSON.stringify({ functional, analytics, v: NOTICE_VERSION })
      )}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

      if (!analytics) {
        // Clear any analytics cookies
        document.cookie = '_va_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      }
    } catch {
      // ignore
    }

    setPreferences({ functional, analytics });
    setHasDecided(true);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectAll = () => {
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences.functional, preferences.analytics);
  };

  // Re-open banner
  const handleOpenSettings = () => {
    setHasDecided(false);
    setShowPreferences(true);
  };

  if (hasDecided === null) {
    return null;
  }

  return (
    <>
      {/* Floating button to change cookie choices anytime */}
      {hasDecided && (
        <button
          onClick={handleOpenSettings}
          className="fixed bottom-4 left-4 z-40 rounded-full border border-[#0f1b3d]/15 bg-white/95 px-3 py-1.5 text-[11px] font-medium text-[#0f1b3d]/80 shadow-md backdrop-blur-md transition-all hover:border-[#D3A337] hover:text-[#0f1b3d]"
          aria-label="Cookie Settings"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
            Cookie Settings
          </span>
        </button>
      )}

      {/* Main Consent Banner */}
      {!hasDecided && (
        <aside
          aria-label="Cookie Consent Banner"
          role="dialog"
          aria-modal="false"
          className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#0f1b3d]/12 bg-[#FCFBF8]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all">
            <div className="flex flex-col gap-4">
              {/* Header & text */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3A337]" />
                  <h3 className="text-sm sm:text-base font-bold text-[#0f1b3d]">
                    Your Cookie Choices
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#0f1b3d]/75">
                  We use strictly necessary cookies to ensure our site operates securely. With your consent, we also use optional functional and analytics cookies to help us improve the site. In accordance with India&rsquo;s DPDP Act and Singapore&rsquo;s PDPA, no optional cookies are set until you actively choose to accept them. Read our{' '}
                  <Link href="/cookies" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">
                    Cookie Notice
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#D3A337] font-semibold underline hover:text-[#b49050]">
                    Website Privacy Notice
                  </Link>.
                </p>
              </div>

              {/* Category Preferences Drawer / Accordion */}
              {showPreferences && (
                <div className="rounded-xl border border-[#0f1b3d]/10 bg-white/80 p-4 space-y-3.5 my-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#0f1b3d]">Strictly Necessary</span>
                      <p className="text-[11px] sm:text-xs text-[#0f1b3d]/60">
                        Essential for security, load balancing, and remembering your privacy choices.
                      </p>
                    </div>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase">
                      Always Active
                    </span>
                  </div>

                  <div className="border-t border-[#0f1b3d]/5 pt-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#0f1b3d]">Functional</span>
                      <p className="text-[11px] sm:text-xs text-[#0f1b3d]/60">
                        Remembers your preferences, such as language or region.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences((prev) => ({ ...prev, functional: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#0f1b3d]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D3A337]" />
                    </label>
                  </div>

                  <div className="border-t border-[#0f1b3d]/5 pt-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#0f1b3d]">Analytics</span>
                      <p className="text-[11px] sm:text-xs text-[#0f1b3d]/60">
                        Anonymous, aggregated usage metrics (Vercel) to measure and improve performance.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#0f1b3d]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D3A337]" />
                    </label>
                  </div>
                </div>
              )}

              {/* Action buttons: Equal prominence for Accept all and Reject all */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPreferences((prev) => !prev)}
                  className="text-left text-xs font-semibold text-[#D3A337] underline hover:text-[#b49050]"
                >
                  {showPreferences ? 'Hide category choices' : 'Customize by category'}
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {showPreferences && (
                    <button
                      type="button"
                      onClick={handleSaveCustom}
                      className="rounded-lg border border-[#0f1b3d]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0f1b3d] shadow-sm hover:bg-[#0f1b3d]/5 transition-colors"
                    >
                      Save Preferences
                    </button>
                  )}
                  {/* Equal prominence buttons */}
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="flex-1 sm:flex-initial rounded-lg border border-[#0f1b3d]/20 bg-[#0f1b3d]/5 hover:bg-[#0f1b3d]/10 px-5 py-2 text-xs font-bold text-[#0f1b3d] shadow-sm transition-colors text-center"
                  >
                    Reject all
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-initial rounded-lg border border-[#0f1b3d] bg-[#0f1b3d] hover:bg-[#172a58] px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors text-center"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
