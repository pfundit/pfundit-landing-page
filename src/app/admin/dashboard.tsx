'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { AdminPublic } from '@/lib/db/types';
import { AdminUsersPanel } from './admin-users-panel';

// The rich text editor (Tiptap) is heavy and only needed inside the job modal,
// so load it on demand instead of shipping it with the initial dashboard bundle.
const RichTextEditor = dynamic(
  () => import('@/components/editor/rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[220px] animate-pulse rounded-xl border border-[#0f1b3d]/10 bg-[#F8FAFF]" />
    ),
  },
);

// In-app resume viewer (pdf.js) for small screens, loaded only when first opened.
const ResumeViewer = dynamic(() => import('./resume-viewer').then((mod) => mod.ResumeViewer), { ssr: false });

/** Matches the dashboard's mobile layout (sidebar stacks below the `lg` breakpoint). */
const MOBILE_VIEWER_QUERY = '(max-width: 1023px)';

type TabKey = 'jobs' | 'applications' | 'investors' | 'contacts' | 'settings' | 'admins' | 'security';

type Job = {
  id: string;
  title: string;
  type: string;
  category: string;
  tags: string[];
  description?: string;
  cardBlurb?: string;
  location?: string;
  jdUrl?: string;
};

type JobFormState = Partial<Job>;

type JobApplication = {
  id: string;
  role: string;
  name: string;
  email: string;
  linkedin?: string;
  resumeName?: string;
  resumeUrl?: string;
  resumeLink?: string;
  whyPfundit: string;
  createdAt: string;
  status: string;
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: string;
};

type InvestorEnquiry = {
  id: string;
  name: string;
  organisation: string;
  role: string;
  email: string;
  country: string;
  investorType: string;
  confirmed: boolean;
  createdAt: string;
  status?: string;
};

export type AdminDashboardInitialData = {
  currentAdmin: AdminPublic;
  admins: AdminPublic[];
  jobs: Job[];
  jobApplications: JobApplication[];
  investorEnquiries: InvestorEnquiry[];
  contactSubmissions: ContactSubmission[];
  recipientEmails: string[];
};

type DateFilterPreset = 'all' | '7d' | '30d' | 'custom';

type DateRangeFilterState = {
  preset: DateFilterPreset;
  from: string;
  to: string;
};

const tabs: Array<{ key: TabKey; label: string; description: string }> = [
  { key: 'jobs', label: 'Job Posting', description: 'Create, update, or remove live roles.' },
  { key: 'applications', label: 'Job Applications', description: 'Review applications submitted through hiring.' },
  { key: 'investors', label: 'Investor Enquiries', description: 'Review prospective institutional & accredited investor access requests.' },
  { key: 'contacts', label: 'Contact Forms', description: 'Review inbound contact submissions.' },
  { key: 'settings', label: 'Email Notifications', description: 'Configure recipient emails for jobs, contacts, and investor enquiries.' },
  { key: 'admins', label: 'Admin Users', description: 'Add teammates, choose which tabs each one can access, reset passwords, or disable accounts.' },
  { key: 'security', label: 'My Account', description: 'Change the password you use to sign in to this dashboard.' },
];

function TabIcon({ tabKey, active }: { tabKey: TabKey; active: boolean }) {
  const className = active ? 'text-white' : 'text-[#0f1b3d]/55';

  if (tabKey === 'jobs') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M7 7V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V7m-8 0v11h6V7" />
      </svg>
    );
  }

  if (tabKey === 'applications') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 10h8M8 14h5m4 4H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l3 3v9a2 2 0 0 1-2 2Z" />
      </svg>
    );
  }

  if (tabKey === 'investors') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  }

  if (tabKey === 'admins') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    );
  }

  if (tabKey === 'security') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    );
  }

  if (tabKey === 'contacts') {
    return (
      <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.5c0 5.247-4.477 9.5-10 9.5a10.95 10.95 0 0 1-3.1-.44L3 21l1.48-4.27A9.1 9.1 0 0 1 1 10.5C1 5.253 5.477 1 11 1s10 4.253 10 9.5Z" />
      </svg>
    );
  }

  return (
    <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">Pfundit Admin</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0f1b3d] sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#0f1b3d]/60">{description}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#0f1b3d]/15 bg-white px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-[#0f1b3d]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#0f1b3d]/55">{description}</p>
    </div>
  );
}

const detailModalHeaderClassName = 'flex items-start justify-between border-b border-[#0f1b3d]/8 px-6 py-4';
const detailModalCloseButtonClassName = 'rounded-full p-2 text-[#0f1b3d]/50 hover:bg-[#F0F5FF] hover:text-[#0f1b3d]';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const filterChipBaseClass = 'rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors';

function getDateRangeBounds(filter: DateRangeFilterState) {
  const now = new Date();
  const end = filter.to ? new Date(`${filter.to}T23:59:59.999`) : now;

  if (filter.preset === 'all') {
    return { fromTime: 0, toTime: end.getTime() };
  }

  if (filter.preset === 'custom') {
    const fromTime = filter.from ? new Date(`${filter.from}T00:00:00.000`).getTime() : 0;
    const toTime = filter.to ? new Date(`${filter.to}T23:59:59.999`).getTime() : now.getTime();
    return { fromTime, toTime };
  }

  const days = filter.preset === '7d' ? 7 : 30;
  const fromTime = now.getTime() - days * 24 * 60 * 60 * 1000;
  return { fromTime, toTime: end.getTime() };
}

function DateRangeFilter({
  title,
  filter,
  onChange,
}: {
  title: string;
  filter: DateRangeFilterState;
  onChange: (next: DateRangeFilterState) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const setPreset = (preset: DateFilterPreset) => {
    onChange({
      preset,
      from: preset === 'custom' ? filter.from : '',
      to: preset === 'custom' ? filter.to : '',
    });
    if (preset !== 'custom') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative inline-flex justify-end">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] shadow-[0_8px_24px_rgba(15,27,61,0.04)] transition-colors ${
          isOpen ? 'border-[#0f1b3d] bg-[#0f1b3d] text-white' : 'border-[#0f1b3d]/10 bg-white text-[#0f1b3d]/70 hover:bg-[#F6F8FF]'
        }`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v4m8-4v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
        </svg>
        <span>Date range</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-[18rem] rounded-2xl border border-[#0f1b3d]/10 bg-white p-3 shadow-[0_16px_40px_rgba(15,27,61,0.12)] sm:w-[22rem]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">{title}</p>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1 text-[#0f1b3d]/45 hover:text-[#0f1b3d]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setPreset('all')} className={`${filterChipBaseClass} ${filter.preset === 'all' ? 'bg-[#0f1b3d] text-white' : 'bg-[#F6F8FF] text-[#0f1b3d]/70 hover:bg-[#EEF3FF]'}`}>
              All
            </button>
            <button type="button" onClick={() => setPreset('7d')} className={`${filterChipBaseClass} ${filter.preset === '7d' ? 'bg-[#0f1b3d] text-white' : 'bg-[#F6F8FF] text-[#0f1b3d]/70 hover:bg-[#EEF3FF]'}`}>
              7d
            </button>
            <button type="button" onClick={() => setPreset('30d')} className={`${filterChipBaseClass} ${filter.preset === '30d' ? 'bg-[#0f1b3d] text-white' : 'bg-[#F6F8FF] text-[#0f1b3d]/70 hover:bg-[#EEF3FF]'}`}>
              30d
            </button>
            <button type="button" onClick={() => setPreset('custom')} className={`${filterChipBaseClass} ${filter.preset === 'custom' ? 'bg-[#D3A337] text-white' : 'bg-[#F6F8FF] text-[#0f1b3d]/70 hover:bg-[#EEF3FF]'}`}>
              Range
            </button>
          </div>

          <div className="mt-3 grid gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-[#0f1b3d]/10 bg-[#F8FAFF] px-3 py-2">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0f1b3d]/50">From</span>
              <input
                type="date"
                value={filter.from}
                onChange={(event) => onChange({ ...filter, preset: 'custom', from: event.target.value })}
                className="min-w-0 bg-transparent text-xs font-semibold text-[#0f1b3d] outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-[#0f1b3d]/10 bg-[#F8FAFF] px-3 py-2">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0f1b3d]/50">To</span>
              <input
                type="date"
                value={filter.to}
                onChange={(event) => onChange({ ...filter, preset: 'custom', to: event.target.value })}
                className="min-w-0 bg-transparent text-xs font-semibold text-[#0f1b3d] outline-none"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard({ initialData }: { initialData: AdminDashboardInitialData }) {
  const currentAdmin = initialData.currentAdmin;
  // "My Account" is always available; every other tab requires its permission.
  const visibleTabs = tabs.filter(
    (tab) => tab.key === 'security' || currentAdmin.permissions.includes(tab.key),
  );
  const [activeTab, setActiveTab] = useState<TabKey>(visibleTabs[0].key);
  const [admins, setAdmins] = useState<AdminPublic[]>(initialData.admins);
  const [jobs, setJobs] = useState<Job[]>(initialData.jobs);
  const jobApplications = initialData.jobApplications;
  const investorEnquiries = initialData.investorEnquiries;
  const contactSubmissions = initialData.contactSubmissions;
  const [applicationDateFilter, setApplicationDateFilter] = useState<DateRangeFilterState>({ preset: 'all', from: '', to: '' });
  const [investorDateFilter, setInvestorDateFilter] = useState<DateRangeFilterState>({ preset: 'all', from: '', to: '' });
  const [contactDateFilter, setContactDateFilter] = useState<DateRangeFilterState>({ preset: 'all', from: '', to: '' });
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);
  const [resumePreview, setResumePreview] = useState<JobApplication | null>(null);
  const [selectedInvestorEnquiry, setSelectedInvestorEnquiry] = useState<InvestorEnquiry | null>(null);
  const [selectedContactSubmission, setSelectedContactSubmission] = useState<ContactSubmission | null>(null);
  const [recipientEmails, setRecipientEmails] = useState<string[]>(initialData.recipientEmails);
  const [savedRecipientEmails, setSavedRecipientEmails] = useState<string[]>(initialData.recipientEmails);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailInputError, setEmailInputError] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobFormState>({});
  const [tagInput, setTagInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [modalTab, setModalTab] = useState<'edit' | 'preview'>('edit');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visiblePasswordFields, setVisiblePasswordFields] = useState<Record<string, boolean>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const router = useRouter();

  const filteredJobApplications = useMemo(() => {
    const { fromTime, toTime } = getDateRangeBounds(applicationDateFilter);
    return jobApplications.filter((application) => {
      const submittedAt = new Date(application.createdAt).getTime();
      return submittedAt >= fromTime && submittedAt <= toTime;
    });
  }, [jobApplications, applicationDateFilter]);

  const filteredInvestorEnquiries = useMemo(() => {
    const { fromTime, toTime } = getDateRangeBounds(investorDateFilter);
    return investorEnquiries.filter((enquiry) => {
      const submittedAt = new Date(enquiry.createdAt).getTime();
      return submittedAt >= fromTime && submittedAt <= toTime;
    });
  }, [investorEnquiries, investorDateFilter]);

  const filteredContactSubmissions = useMemo(() => {
    const { fromTime, toTime } = getDateRangeBounds(contactDateFilter);
    return contactSubmissions.filter((submission) => {
      const submittedAt = new Date(submission.createdAt).getTime();
      return submittedAt >= fromTime && submittedAt <= toTime;
    });
  }, [contactSubmissions, contactDateFilter]);

  /**
   * 401: session expired / revoked -> back to login.
   * 403: access was changed by another admin -> refresh so the tabs reflect it.
   */
  const handleUnauthorized = (response: Response) => {
    if (response.status === 401) {
      router.replace('/admin/login');
      router.refresh();
      return true;
    }
    if (response.status === 403) {
      alert('You no longer have access to this section. The dashboard will refresh.');
      router.refresh();
      return true;
    }
    return false;
  };

  const reloadJobs = async () => {
    const response = await fetch('/api/jobs', { cache: 'no-store' });
    if (response.ok) {
      setJobs(await response.json());
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const openCreateModal = () => {
    setCurrentJob({
      title: '',
      type: 'Full-time',
      category: 'Leadership',
      location: 'Mumbai, India',
      tags: [],
      cardBlurb: '',
      description: '',
      jdUrl: '',
    });
    setTagInput('');
    setModalTab('edit');
    setIsEditing(true);
  };

  const openEditModal = (job: Job) => {
    setCurrentJob({ ...job, tags: [...job.tags] });
    setTagInput(job.tags.join(', '));
    setModalTab('edit');
    setIsEditing(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);

    const isNew = !currentJob.id;
    const endpoint = isNew ? '/api/jobs' : `/api/jobs/${currentJob.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const tags = tagInput.split(',').map((tag) => tag.trim()).filter(Boolean);

    const payload = {
      ...currentJob,
      tags,
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      await reloadJobs();
      setIsEditing(false);
      setCurrentJob({});
      setTagInput('');
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the job posting.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Delete this job posting?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (handleUnauthorized(response)) return;
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the job posting.');
    }
  };

  const hasPendingValidInput = useMemo(() => {
    if (!newEmailInput.trim()) return false;
    const parts = newEmailInput
      .split(/[,;\s]+/)
      .map((p) => p.trim().toLowerCase())
      .filter((p) => emailRegex.test(p));
    return parts.length > 0;
  }, [newEmailInput]);

  const isSettingsDirty = useMemo(() => {
    if (recipientEmails.length !== savedRecipientEmails.length) return true;
    const listChanged = recipientEmails.some((email, idx) => email !== savedRecipientEmails[idx]);
    return listChanged || hasPendingValidInput;
  }, [recipientEmails, savedRecipientEmails, hasPendingValidInput]);

  const canSaveSettings = isSettingsDirty && !settingsLoading && (recipientEmails.length > 0 || hasPendingValidInput);

  const handleAddEmail = () => {
    setEmailInputError('');
    const trimmed = newEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    const parts = trimmed
      .split(/[,;\s]+/)
      .map((p) => p.trim().toLowerCase())
      .filter((p) => emailRegex.test(p));

    if (parts.length === 0) {
      setEmailInputError('Please enter a valid email address.');
      return;
    }

    const next = Array.from(new Set([...recipientEmails, ...parts]));
    setRecipientEmails(next);
    setNewEmailInput('');
    setSettingsSavedMessage('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setRecipientEmails(recipientEmails.filter((e) => e !== emailToRemove));
    setSettingsSavedMessage('');
    setEmailInputError('');
  };

  const handleDiscardSettings = () => {
    setRecipientEmails(savedRecipientEmails);
    setNewEmailInput('');
    setEmailInputError('');
    setSettingsSavedMessage('');
  };

  const handleSaveSettings = async () => {
    setEmailInputError('');
    let emailsToSave = [...recipientEmails];

    if (newEmailInput.trim()) {
      const parts = newEmailInput
        .split(/[,;\s]+/)
        .map((p) => p.trim().toLowerCase())
        .filter((p) => emailRegex.test(p));
      if (parts.length > 0) {
        emailsToSave = Array.from(new Set([...emailsToSave, ...parts]));
        setRecipientEmails(emailsToSave);
        setNewEmailInput('');
      } else if (emailsToSave.length === 0) {
        setEmailInputError('Please enter a valid email address.');
        return;
      }
    }

    if (emailsToSave.length === 0) {
      setEmailInputError('At least one recipient email address is required.');
      return;
    }

    setSettingsLoading(true);
    setSettingsSavedMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmails: emailsToSave }),
      });
      if (handleUnauthorized(res)) return;
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }
      setRecipientEmails(data.recipientEmails);
      setSavedRecipientEmails(data.recipientEmails);
      setSettingsSavedMessage('Changes saved');
      setTimeout(() => setSettingsSavedMessage(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving settings';
      setEmailInputError(msg);
    } finally {
      setSettingsLoading(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', ok: newPassword.length >= 8 },
    { label: 'Contains a letter and a number', ok: /[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword) },
    { label: 'Matches confirmation', ok: newPassword.length > 0 && newPassword === confirmPassword },
  ];
  const canSubmitPassword =
    !passwordLoading && currentPassword.length > 0 && passwordChecks.every((check) => check.ok);

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (handleUnauthorized(res)) return;
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setVisiblePasswordFields({});
      setPasswordSuccess('Password updated. Other devices signed in as you have been signed out.');
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const activeTabConfig = visibleTabs.find((tab) => tab.key === activeTab) || visibleTabs[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F5FF] text-[#0f1b3d] lg:block">
      <aside className="border-b border-[#0f1b3d]/8 bg-white/92 px-3 py-3 backdrop-blur-xl lg:fixed lg:z-30 lg:flex lg:h-[calc(100vh)] lg:w-[15.5rem] lg:flex-col  lg:border lg:px-3 lg:py-3.5 lg:shadow-[0_18px_40px_rgba(15,27,61,0.06)]">
        <div className="flex items-start justify-between gap-3 lg:block">
          <div className="pb-2 lg:pb-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-[#0f1b3d]/38">Admin panel</p>
            <div className="mt-2 flex items-center">
              <Image
                src="/logo-main.svg"
                alt="Pfundit"
                width={2378}
                height={699}
                className="h-5 w-auto aspect-[2378/699] object-contain"
              />
            </div>
          </div>
        </div>

        <nav className="mt-3 grid flex-1 content-start gap-1.5 lg:mt-3.5 lg:gap-1.5">
          {visibleTabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const count =
              tab.key === 'jobs'
                ? jobs.length
                : tab.key === 'applications'
                ? jobApplications.length
                : tab.key === 'investors'
                ? investorEnquiries.length
                : tab.key === 'contacts'
                ? contactSubmissions.length
                : tab.key === 'settings'
                ? recipientEmails.length
                : tab.key === 'admins'
                ? admins.length
                : null;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[1.05rem] border px-2.5 py-2.5 text-left transition-all ${isActive
                  ? 'border-[#0f1b3d] bg-[#0f1b3d] text-white shadow-[0_10px_22px_rgba(15,27,61,0.14)]'
                  : 'border-[#0f1b3d]/8 bg-white/75 text-[#0f1b3d]/72 hover:border-[#0f1b3d]/12 hover:bg-white hover:text-[#0f1b3d] hover:shadow-[0_8px_18px_rgba(15,27,61,0.04)]'
                  }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${isActive ? 'bg-white/12 ring-white/12' : 'bg-[#0f1b3d]/5 ring-[#0f1b3d]/5'}`}>
                      <TabIcon tabKey={tab.key} active={isActive} />
                    </span>
                    <p className="truncate text-[0.82rem] font-medium tracking-tight sm:text-[0.85rem]">{tab.label}</p>
                  </div>
                  {count !== null && (
                    <span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-[0.625rem] font-semibold uppercase tracking-[0.16em] ${isActive ? 'bg-white/12 text-white' : 'bg-[#0f1b3d]/5 text-[#0f1b3d]/42'}`}>
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-[#0f1b3d]/8 pt-2.5 lg:mt-3.5 lg:pt-3.5">
          <div className="mb-2.5 flex items-center gap-2.5 px-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f1b3d] text-xs font-bold uppercase text-white">
              {(currentAdmin.name || currentAdmin.username).slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8rem] font-semibold text-[#0f1b3d]">{currentAdmin.name || currentAdmin.username}</p>
              <p className="truncate text-[0.68rem] text-[#0f1b3d]/50">@{currentAdmin.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#0f1b3d]/10 bg-[#F8FAFF] px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-[#0f1b3d]/55 transition-all hover:border-[#0f1b3d]/16 hover:bg-white hover:text-[#0f1b3d]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m0 0l4-4m-4 4 4 4m6-8v2a2 2 0 0 1-2 2h-1m3 4v2a2 2 0 0 1-2 2H7" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:pl-[17.75rem] lg:pr-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between">
            <SectionHeader
              title={activeTabConfig.label}
              description={activeTabConfig.description}
            />
            {activeTab === 'jobs' && (
              <button
                type="button"
                aria-label="Add New Job"
                onClick={openCreateModal}
                className="ml-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#0f1b3d] px-3 text-white shadow hover:bg-[#0f1b3d]/90"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-semibold">Add Job</span>
              </button>
            )}
          </div>

          {activeTab === 'jobs' && (
            <div className="space-y-4">

              <div className="overflow-hidden rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white shadow-[0_18px_60px_rgba(15,27,61,0.06)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#0f1b3d]">
                    <thead className="sticky top-0 bg-[#F6F8FF] text-xs uppercase text-[#0f1b3d]/55">
                      <tr>
                        <th className="px-5 py-4 font-bold tracking-wider">ID</th>
                        <th className="px-5 py-4 font-bold tracking-wider">Role &amp; Card Blurb</th>
                        <th className="px-5 py-4 font-bold tracking-wider">Category</th>
                        <th className="px-5 py-4 font-bold tracking-wider">Engagement / Location</th>
                        <th className="px-5 py-4 font-bold tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0f1b3d]/5">
                      {jobs.map((job) => (
                        <tr key={job.id} className="transition-colors hover:bg-[#F6F8FF]">
                          <td className="px-5 py-4 font-mono font-bold text-[#D3A337]">{job.id}</td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#0f1b3d]">{job.title}</div>
                            {job.cardBlurb && (
                              <div className="mt-1 line-clamp-1 max-w-lg text-xs text-[#0f1b3d]/60">
                                {job.cardBlurb}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-[#0f1b3d]/5 px-2.5 py-1 text-xs font-semibold text-[#0f1b3d]/70">
                              {job.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <span className="font-semibold text-[#0f1b3d]">{job.type}</span>
                            {job.location && (
                              <span className="block text-[11px] text-[#0f1b3d]/50 mt-0.5">{job.location}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button onClick={() => openEditModal(job)} className="mr-3 rounded-full bg-[#D3A337]/10 px-3 py-1.5 text-xs font-bold text-[#D3A337] transition-colors hover:bg-[#D3A337]/15">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(job.id)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-100">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                      {jobs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-[#0f1b3d]/50">
                            No jobs found. Create one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <div className="mb-4 flex justify-end">
                <DateRangeFilter title="Job applications" filter={applicationDateFilter} onChange={setApplicationDateFilter} />
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white shadow-[0_18px_60px_rgba(15,27,61,0.06)]">
              <div className="hidden border-b border-[#0f1b3d]/5 bg-[#F6F8FF] px-5 py-3 sm:px-6 lg:grid lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_10rem_10rem_2rem] lg:gap-4">
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Name</div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Email</div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Role</div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Submitted</div>
                <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45" />
              </div>
              {filteredJobApplications.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No job applications yet"
                    description="Applications submitted from the hiring page will appear here with candidate details and the role they applied for."
                  />
                </div>
              ) : (
                <div className="divide-y divide-[#0f1b3d]/5">
                  {filteredJobApplications.map((application) => (
                    <button
                      key={application.id}
                      type="button"
                      onClick={() => setSelectedJobApplication(application)}
                      className="group grid w-full gap-4 border-l-2 border-transparent px-5 py-4 text-left transition-colors hover:border-l-[#D3A337] hover:bg-[#F6F8FF] focus-visible:border-l-[#D3A337] focus-visible:bg-[#F6F8FF] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_10rem_10rem_2rem] lg:items-start lg:gap-4"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[1rem] font-bold tracking-tight text-[#0f1b3d]">{application.name}</h3>
                      </div>

                      <div className="min-w-0 text-sm text-[#0f1b3d]/70">{application.email}</div>

                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D3A337] lg:pt-0.5">{application.role}</div>

                      <div className="text-sm text-[#0f1b3d] lg:pt-0.5">{formatDate(application.createdAt)}</div>

                      <div className="flex items-center justify-start lg:justify-end">
                        <svg className="h-4 w-4 text-[#0f1b3d]/35 transition-colors group-hover:text-[#0f1b3d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}

          {activeTab === 'investors' && (
            <div>
              <div className="mb-4 flex justify-end">
                <DateRangeFilter title="Investor enquiries" filter={investorDateFilter} onChange={setInvestorDateFilter} />
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white shadow-[0_18px_60px_rgba(15,27,61,0.06)]">
                <div className="hidden border-b border-[#0f1b3d]/5 bg-[#F6F8FF] px-5 py-3 sm:px-6 lg:grid lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_12rem_10rem_2rem] lg:gap-4">
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Organisation &amp; Investor</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Email &amp; Role</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Classification</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Submitted</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45" />
                </div>

                {filteredInvestorEnquiries.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      title="No investor enquiries yet"
                      description="Inbound enquiries from institutional and accredited investors will appear here with organization details and regulatory confirmation."
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-[#0f1b3d]/5">
                    {filteredInvestorEnquiries.map((enquiry) => (
                      <button
                        key={enquiry.id}
                        type="button"
                        onClick={() => setSelectedInvestorEnquiry(enquiry)}
                        className="group grid w-full gap-4 border-l-2 border-transparent px-5 py-4 text-left transition-colors hover:border-l-[#D3A337] hover:bg-[#F6F8FF] focus-visible:border-l-[#D3A337] focus-visible:bg-[#F6F8FF] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_12rem_10rem_2rem] lg:items-start lg:gap-4 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <h3 className="text-[1rem] font-bold tracking-tight text-[#0f1b3d]">{enquiry.organisation}</h3>
                          <p className="mt-0.5 text-xs text-[#0f1b3d]/65 font-medium">{enquiry.name}</p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm text-[#0f1b3d]/80">{enquiry.email}</p>
                          <p className="mt-0.5 text-xs text-[#0f1b3d]/60">{enquiry.role} · {enquiry.country}</p>
                        </div>

                        <div className="lg:pt-0.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D3A337]/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#D3A337]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
                            {enquiry.investorType}
                          </span>
                        </div>

                        <div className="text-sm text-[#0f1b3d] lg:pt-0.5">{formatDate(enquiry.createdAt)}</div>

                        <div className="flex items-center justify-start lg:justify-end">
                          <svg className="h-4 w-4 text-[#0f1b3d]/35 transition-colors group-hover:text-[#0f1b3d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="mb-4 flex justify-end">
                <DateRangeFilter title="Contact submissions" filter={contactDateFilter} onChange={setContactDateFilter} />
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white shadow-[0_18px_60px_rgba(15,27,61,0.06)]">
                <div className="hidden border-b border-[#0f1b3d]/5 bg-[#F6F8FF] px-5 py-3 sm:px-6 lg:grid lg:grid-cols-[minmax(14rem,1.1fr)_10rem_10rem_2rem] lg:gap-4">
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Contact</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Mail</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45">Submitted</div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#0f1b3d]/45" />
                </div>

                {filteredContactSubmissions.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      title="No contact submissions yet"
                      description="Messages submitted from the contact form will appear here so the team can review inbound interest centrally."
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-[#0f1b3d]/5">
                    {filteredContactSubmissions.map((submission) => (
                      <button
                        key={submission.id}
                        type="button"
                        onClick={() => setSelectedContactSubmission(submission)}
                        className="group grid w-full gap-4 border-l-2 border-transparent px-5 py-4 text-left transition-colors hover:border-l-[#D3A337] hover:bg-[#F6F8FF] focus-visible:border-l-[#D3A337] focus-visible:bg-[#F6F8FF] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(14rem,1.1fr)_10rem_10rem_2rem] lg:items-start lg:gap-4"
                      >
                        <div className="min-w-0">
                          <h3 className="text-[1rem] font-bold tracking-tight text-[#0f1b3d]">{submission.name}</h3>
                        </div>

                        <div className="min-w-0 text-sm text-[#0f1b3d]/70">{submission.email}</div>

                        <div className="text-sm text-[#0f1b3d] lg:pt-0.5">{formatDate(submission.createdAt)}</div>

                        <div className="flex items-center justify-start lg:justify-end">
                          <svg className="h-4 w-4 text-[#0f1b3d]/35 transition-colors group-hover:text-[#0f1b3d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-6">
              <div className="rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white p-6 sm:p-8 shadow-[0_18px_60px_rgba(15,27,61,0.06)]">
                <div className="border-b border-[#0f1b3d]/10 pb-5">
                  <h2 className="text-lg font-bold tracking-tight text-[#0f1b3d] sm:text-xl">
                    Admin Notification Recipients
                  </h2>
                  <p className="mt-1 text-xs text-[#0f1b3d]/65 sm:text-sm">
                    Configure which email addresses receive notification alerts whenever a job application, contact message, or investor enquiry is submitted.
                  </p>
                </div>

                {/* Email Badges List */}
                <div className="mt-6">
                  <div className="mb-2.5 flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/70">
                      Active Recipients ({recipientEmails.length})
                    </label>
                    {isSettingsDirty && (
                      <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#D3A337]">
                        • Unsaved Changes
                      </span>
                    )}
                  </div>

                  {recipientEmails.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#0f1b3d]/15 bg-[#F6F8FF] p-4 text-xs font-medium text-[#0f1b3d]/70">
                      No recipient emails configured yet. Add at least one email address below to receive notifications.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {recipientEmails.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-2 rounded-full border border-[#0f1b3d]/15 bg-[#F0F5FF] px-3.5 py-1.5 text-xs font-semibold text-[#0f1b3d] shadow-sm transition-all hover:border-[#D3A337]/40"
                        >
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(email)}
                            className="rounded-full p-0.5 text-[#0f1b3d]/40 transition-colors hover:bg-red-100 hover:text-red-700"
                            title={`Remove ${email}`}
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Email Form */}
                <div className="mt-6 border-t border-[#0f1b3d]/10 pt-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/70">
                    Add Recipient Email Address
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="email"
                      value={newEmailInput}
                      onChange={(e) => {
                        setNewEmailInput(e.target.value);
                        if (emailInputError) setEmailInputError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                      placeholder="e.g. founder@pfundit.com or comma-separated emails"
                      className="flex-1 rounded-xl border border-[#0f1b3d]/15 bg-white px-4 py-2.5 text-sm text-[#0f1b3d] placeholder:text-[#0f1b3d]/40 focus:border-[#D3A337] focus:outline-none focus:ring-1 focus:ring-[#D3A337]"
                    />
                    <button
                      type="button"
                      onClick={handleAddEmail}
                      disabled={!newEmailInput.trim()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0f1b3d]/20 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0f1b3d] transition-all hover:bg-[#F0F5FF] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + Add to List
                    </button>
                  </div>
                  {emailInputError ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {emailInputError}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[0.72rem] text-[#0f1b3d]/50">
                      Supports multiple emails separated by commas. Hit Enter or click &quot;+ Add to List&quot;.
                    </p>
                  )}
                </div>

                {/* Save and Discard Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#0f1b3d]/10 pt-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={!canSaveSettings}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0f1b3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#0f1b3d]/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {settingsLoading ? (
                        <>
                          <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Email Recipients'
                      )}
                    </button>

                    {isSettingsDirty && !settingsLoading && (
                      <button
                        type="button"
                        onClick={handleDiscardSettings}
                        className="rounded-full px-4 py-2 text-xs font-semibold text-[#0f1b3d]/60 transition-colors hover:bg-[#0f1b3d]/5 hover:text-[#0f1b3d]"
                      >
                        Discard Changes
                      </button>
                    )}

                    {settingsSavedMessage && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        ✓ {settingsSavedMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && currentAdmin.permissions.includes('admins') && (
            <AdminUsersPanel
              currentAdmin={currentAdmin}
              admins={admins}
              setAdmins={setAdmins}
              handleAuthError={handleUnauthorized}
            />
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <form
                onSubmit={handleChangePassword}
                className="rounded-[1.5rem] border border-[#0f1b3d]/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,27,61,0.06)] sm:p-8"
              >
                <div className="border-b border-[#0f1b3d]/10 pb-5">
                  <h2 className="text-lg font-bold tracking-tight text-[#0f1b3d] sm:text-xl">Change Your Password</h2>
                  <p className="mt-1 text-xs text-[#0f1b3d]/65 sm:text-sm">
                    Updates the password for <span className="font-semibold text-[#0f1b3d]">@{currentAdmin.username}</span> only.
                    You stay signed in here; any other devices signed in as you will be signed out.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { id: 'current-password', label: 'Current Password', value: currentPassword, setter: setCurrentPassword, autoComplete: 'current-password' },
                    { id: 'new-password', label: 'New Password', value: newPassword, setter: setNewPassword, autoComplete: 'new-password' },
                    { id: 'confirm-password', label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, autoComplete: 'new-password' },
                  ].map((field) => {
                    const isVisible = Boolean(visiblePasswordFields[field.id]);
                    return (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#0f1b3d]/70">
                        {field.label}
                      </label>
                      <div className="relative">
                      <input
                        id={field.id}
                        type={isVisible ? 'text' : 'password'}
                        autoComplete={field.autoComplete}
                        value={field.value}
                        onChange={(event) => {
                          field.setter(event.target.value);
                          if (passwordError) setPasswordError('');
                          if (passwordSuccess) setPasswordSuccess('');
                        }}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-white py-2.5 pl-4 pr-11 text-sm text-[#0f1b3d] focus:border-[#D3A337] focus:outline-none focus:ring-1 focus:ring-[#D3A337]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setVisiblePasswordFields((current) => ({ ...current, [field.id]: !current[field.id] }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#0f1b3d]/40 transition-colors hover:text-[#0f1b3d] focus:outline-none focus-visible:text-[#0f1b3d]"
                        aria-label={isVisible ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
                      >
                        {isVisible ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                      </div>
                    </div>
                    );
                  })}
                </div>

                <ul className="mt-4 grid gap-1.5">
                  {passwordChecks.map((check) => (
                    <li
                      key={check.label}
                      className={`flex items-center gap-2 text-xs font-medium ${check.ok ? 'text-emerald-600' : 'text-[#0f1b3d]/45'}`}
                    >
                      <span aria-hidden="true">{check.ok ? '✓' : '○'}</span>
                      {check.label}
                    </li>
                  ))}
                </ul>

                {passwordError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {passwordSuccess}
                  </div>
                )}

                <div className="mt-6 border-t border-[#0f1b3d]/10 pt-5">
                  <button
                    type="submit"
                    disabled={!canSubmitPassword}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0f1b3d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#0f1b3d]/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-[1.75rem] bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#0f1b3d]/10 bg-[#F8FAFF] px-6 py-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold tracking-tight text-[#0f1b3d]">
                  {currentJob.id ? `Edit Job #${currentJob.id}` : 'Create New Job'}
                </h2>
                {/* Edit / Preview Tabs */}
                <div className="flex rounded-full bg-white p-1 border border-[#0f1b3d]/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalTab('edit')}
                    className={`rounded-full px-3 py-1 font-bold transition-colors ${modalTab === 'edit' ? 'bg-[#0f1b3d] text-white' : 'text-[#0f1b3d]/60 hover:text-[#0f1b3d]'}`}
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('preview')}
                    className={`rounded-full px-3 py-1 font-bold transition-colors ${modalTab === 'preview' ? 'bg-[#0f1b3d] text-white' : 'text-[#0f1b3d]/60 hover:text-[#0f1b3d]'}`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full p-2 text-[#0f1b3d]/50 hover:bg-[#F0F5FF] hover:text-[#0f1b3d]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {modalTab === 'edit' ? (
                <form id="job-edit-form" onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Role Title *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Head of Credit / Credit Manager"
                        value={currentJob.title || ''}
                        onChange={(event) => setCurrentJob({ ...currentJob, title: event.target.value })}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Category *</label>
                      <select
                        required
                        value={currentJob.category || 'Leadership'}
                        onChange={(event) => setCurrentJob({ ...currentJob, category: event.target.value })}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                      >
                        <option value="Leadership">Leadership</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Engagement Type *</label>
                      <input
                        required
                        type="text"
                        placeholder="Full-time, Advisory, etc."
                        value={currentJob.type || ''}
                        onChange={(event) => setCurrentJob({ ...currentJob, type: event.target.value })}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India · Hybrid"
                        value={currentJob.location || ''}
                        onChange={(event) => setCurrentJob({ ...currentJob, location: event.target.value })}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Tags (comma separated) *</label>
                      <input
                        required
                        type="text"
                        placeholder="Credit & Risk, Underwriting"
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">
                      Card Version Blurb (Short summary shown on careers card)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Build the credit engine of a new-generation, AI-native NBFC, from the first policy to the first disbursement."
                      value={currentJob.cardBlurb || ''}
                      onChange={(event) => setCurrentJob({ ...currentJob, cardBlurb: event.target.value })}
                      className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">
                      Full Job Description Link (Optional URL to PDF, Google Doc, or Notion)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={currentJob.jdUrl || ''}
                      onChange={(event) => setCurrentJob({ ...currentJob, jdUrl: event.target.value })}
                      className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D3A337] focus:bg-white focus:ring-1 focus:ring-[#D3A337]"
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-[#0f1b3d]/70">
                        Page Version / Detailed Description (Rich Text Editor) *
                      </label>
                      <span className="text-[11px] text-[#0f1b3d]/50">Rich text toolbar + HTML toggle</span>
                    </div>
                    <RichTextEditor
                      value={currentJob.description || ''}
                      onChange={(html) => setCurrentJob({ ...currentJob, description: html })}
                      placeholder="Write the full role description, what the candidate will build, requirements, and contact details..."
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Card Preview */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#D3A337]">Card Version Preview</p>
                    <div className="rounded-2xl border border-[#0f1b3d]/10 bg-[#F0F5FF]/40 p-5">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#D3A337]">{currentJob.id || 'NEW'}</span>
                          <h3 className="text-base font-bold text-[#0f1b3d]">{currentJob.title || 'Untitled Role'}</h3>
                        </div>
                        <span className="rounded-full bg-[#D3A337]/10 px-2.5 py-0.5 text-xs font-bold text-[#D3A337]">
                          {currentJob.type || 'Full-time'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#0f1b3d]/75">
                        {currentJob.cardBlurb || currentJob.description?.replace(/<[^>]+>/g, '') || 'No card blurb provided.'}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tagInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                          <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#0f1b3d]/60 border border-[#0f1b3d]/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Page Description Preview */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#D3A337]">Page Version / Detailed View Preview</p>
                    <div className="rounded-2xl border border-[#0f1b3d]/10 bg-white p-6 shadow-sm">
                      <h2 className="text-xl font-bold text-[#0f1b3d] mb-1">{currentJob.title || 'Untitled Role'}</h2>
                      <div className="flex items-center gap-3 text-xs text-[#0f1b3d]/60 mb-4">
                        <span>{currentJob.category}</span>
                        <span>·</span>
                        <span>{currentJob.type}</span>
                        {currentJob.location && (
                          <>
                            <span>·</span>
                            <span>{currentJob.location}</span>
                          </>
                        )}
                      </div>
                      <div
                        className="rich-text-content prose prose-sm max-w-none text-sm text-[#0f1b3d]/80 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: currentJob.description || '<p>No description entered yet.</p>' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#0f1b3d]/10 bg-[#F8FAFF] px-6 py-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-[#0f1b3d]/12 bg-white px-5 py-2 text-sm font-bold text-[#0f1b3d] transition-colors hover:bg-[#F0F5FF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="job-edit-form"
                disabled={formLoading}
                className="rounded-full bg-[#0f1b3d] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#0f1b3d]/90 disabled:opacity-70"
              >
                {formLoading ? 'Saving...' : 'Save Job Posting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvestorEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white shadow-2xl overflow-hidden border border-[#0f1b3d]/10">
            <div className={detailModalHeaderClassName}>
              <div>
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">Investor Enquiry</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0f1b3d]">{selectedInvestorEnquiry.organisation}</h2>
                <p className="mt-1 text-sm text-[#0f1b3d]/60">{selectedInvestorEnquiry.name} · {selectedInvestorEnquiry.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvestorEnquiry(null)}
                className={detailModalCloseButtonClassName}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Email</p>
                  <p className="mt-1 text-sm font-semibold text-[#0f1b3d] break-all">{selectedInvestorEnquiry.email}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Submitted</p>
                  <p className="mt-1 text-sm font-semibold text-[#0f1b3d]">{formatDate(selectedInvestorEnquiry.createdAt)}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Country / Jurisdiction</p>
                  <p className="mt-1 text-sm font-semibold text-[#0f1b3d]">{selectedInvestorEnquiry.country}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Investor Classification</p>
                  <p className="mt-1 text-sm font-semibold text-[#D3A337]">{selectedInvestorEnquiry.investorType}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#FBF9F4] border border-[#D3A337]/35 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#D3A337]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]">
                    Accredited / Institutional Status
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">
                  {selectedInvestorEnquiry.confirmed
                    ? 'Confirmed: Self-certified as an institutional or accredited investor (Securities and Futures Act 2001 of Singapore or equivalent). Investor materials shared only under confidentiality agreement.'
                    : 'Unconfirmed'}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#0f1b3d]/10">
                <a
                  href={`mailto:${selectedInvestorEnquiry.email}?subject=Pfundit%20Investor%20Enquiry%20-%20${encodeURIComponent(selectedInvestorEnquiry.organisation)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0f1b3d] px-5 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#162752] cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Reply to Investor
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedContactSubmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white shadow-2xl">
            <div className={detailModalHeaderClassName}>
              <div>
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">Contact message</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0f1b3d]">{selectedContactSubmission.name}</h2>
                <p className="mt-1 text-sm text-[#0f1b3d]/60">{selectedContactSubmission.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContactSubmission(null)}
                className={detailModalCloseButtonClassName}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Submitted</p>
                  <p className="mt-1 text-sm text-[#0f1b3d]">{formatDate(selectedContactSubmission.createdAt)}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Mail</p>
                  <p className="mt-1 text-sm text-[#0f1b3d]">{selectedContactSubmission.email}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#F0F5FF] p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#0f1b3d]/80">{selectedContactSubmission.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedJobApplication && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white shadow-2xl">
            <div className={detailModalHeaderClassName}>
              <div>
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D3A337]">Job application</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0f1b3d]">{selectedJobApplication.name}</h2>
                <p className="mt-1 text-sm text-[#0f1b3d]/60">{selectedJobApplication.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobApplication(null)}
                className={detailModalCloseButtonClassName}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Role</p>
                  <p className="mt-1 text-sm text-[#0f1b3d]">{selectedJobApplication.role}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Submitted</p>
                  <p className="mt-1 text-sm text-[#0f1b3d]">{formatDate(selectedJobApplication.createdAt)}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">LinkedIn</p>
                  <p className="mt-1 break-all text-sm text-[#0f1b3d]">{selectedJobApplication.linkedin || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl bg-[#F6F8FF] p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Resume</p>
                  {selectedJobApplication.resumeUrl || selectedJobApplication.resumeLink ? (
                    <a
                      href={selectedJobApplication.resumeUrl || selectedJobApplication.resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => {
                        // Phones/tablets: preview inside the dashboard so "back" returns here.
                        // Desktop keeps opening the file in a new tab.
                        if (!window.matchMedia(MOBILE_VIEWER_QUERY).matches) return;
                        event.preventDefault();
                        setResumePreview(selectedJobApplication);
                      }}
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f1b3d] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#17264f]"
                    >
                      View Resume
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h6m0 0v6m0-6L10 16l-4-4-3 3" />
                      </svg>
                    </a>
                  ) : (
                    <p className="mt-1 break-all text-sm text-[#0f1b3d]">Not provided</p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#F0F5FF] p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/45">Why Pfundit</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#0f1b3d]/80">{selectedJobApplication.whyPfundit}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {resumePreview && (resumePreview.resumeUrl || resumePreview.resumeLink) && (
        <ResumeViewer
          url={(resumePreview.resumeUrl || resumePreview.resumeLink) as string}
          fileName={resumePreview.resumeName}
          title={resumePreview.name}
          onClose={() => setResumePreview(null)}
        />
      )}
    </div>
  );
}
