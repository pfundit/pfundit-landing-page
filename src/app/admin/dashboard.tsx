'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type TabKey = 'jobs' | 'applications' | 'contacts';

type Job = {
  id: string;
  title: string;
  type: string;
  category: string;
  tags: string[];
  description?: string;
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
  message: string;
  createdAt: string;
  status: string;
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
  { key: 'contacts', label: 'Contact Forms', description: 'Review inbound contact submissions.' },
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

  return (
    <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.5c0 5.247-4.477 9.5-10 9.5a10.95 10.95 0 0 1-3.1-.44L3 21l1.48-4.27A9.1 9.1 0 0 1 1 10.5C1 5.253 5.477 1 11 1s10 4.253 10 9.5Z" />
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
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#D4A437]">Pfundit Admin</p>
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
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D4A437]">{title}</p>
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
            <button type="button" onClick={() => setPreset('custom')} className={`${filterChipBaseClass} ${filter.preset === 'custom' ? 'bg-[#D4A437] text-white' : 'bg-[#F6F8FF] text-[#0f1b3d]/70 hover:bg-[#EEF3FF]'}`}>
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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [applicationDateFilter, setApplicationDateFilter] = useState<DateRangeFilterState>({ preset: 'all', from: '', to: '' });
  const [contactDateFilter, setContactDateFilter] = useState<DateRangeFilterState>({ preset: 'all', from: '', to: '' });
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication | null>(null);
  const [selectedContactSubmission, setSelectedContactSubmission] = useState<ContactSubmission | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobFormState>({});
  const [tagInput, setTagInput] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  const filteredJobApplications = jobApplications.filter((application) => {
    const submittedAt = new Date(application.createdAt).getTime();
    const { fromTime, toTime } = getDateRangeBounds(applicationDateFilter);
    return submittedAt >= fromTime && submittedAt <= toTime;
  });

  const filteredContactSubmissions = contactSubmissions.filter((submission) => {
    const submittedAt = new Date(submission.createdAt).getTime();
    const { fromTime, toTime } = getDateRangeBounds(contactDateFilter);
    return submittedAt >= fromTime && submittedAt <= toTime;
  });

  const loadDashboardData = async () => {
    const [jobsResponse, jobApplicationsResponse, contactResponse] = await Promise.all([
      fetch('/api/jobs'),
      fetch('/api/applications/jobs'),
      fetch('/api/applications/contact'),
    ]);

    if (jobsResponse.ok) {
      setJobs(await jobsResponse.json());
    }

    if (jobApplicationsResponse.ok) {
      setJobApplications(await jobApplicationsResponse.json());
    }

    if (contactResponse.ok) {
      setContactSubmissions(await contactResponse.json());
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadDashboardData();
      } catch (error) {
        console.error('Failed to load admin dashboard data', error);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const openCreateModal = () => {
    setCurrentJob({
      title: '',
      type: 'Full-Time',
      category: 'Technology',
      tags: [],
      description: '',
    });
    setTagInput('');
    setIsEditing(true);
  };

  const openEditModal = (job: Job) => {
    setCurrentJob({ ...job, tags: [...job.tags] });
    setTagInput(job.tags.join(', '));
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

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      await loadDashboardData();
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
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      await loadDashboardData();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the job posting.');
    }
  };

  const activeTabConfig = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F5FF] text-[#0f1b3d] lg:block">
      <aside className="border-b border-[#0f1b3d]/8 bg-white/92 px-3 py-3 backdrop-blur-xl lg:fixed lg:z-30 lg:flex lg:h-[calc(100vh)] lg:w-[15.5rem] lg:flex-col  lg:border lg:px-3 lg:py-3.5 lg:shadow-[0_18px_40px_rgba(15,27,61,0.06)]">
        <div className="flex items-start justify-between gap-3 lg:block">
          <div className="pb-2 lg:pb-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-[#0f1b3d]/38">Admin panel</p>
            <h2 className="mt-1 text-[1.15rem] font-semibold tracking-tight text-[#0f1b3d]">Pfundit</h2>
          </div>
        </div>

        <nav className="mt-3 grid flex-1 content-start gap-1.5 lg:mt-3.5 lg:gap-1.5">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const count = tab.key === 'jobs' ? jobs.length : tab.key === 'applications' ? jobApplications.length : contactSubmissions.length;

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
                  <span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-[0.625rem] font-semibold uppercase tracking-[0.16em] ${isActive ? 'bg-white/12 text-white' : 'bg-[#0f1b3d]/5 text-[#0f1b3d]/42'}`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-[#0f1b3d]/8 pt-2.5 lg:mt-3.5 lg:pt-3.5">
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
                        <th className="px-5 py-4 font-bold tracking-wider">Title</th>
                        <th className="px-5 py-4 font-bold tracking-wider">Category</th>
                        <th className="px-5 py-4 font-bold tracking-wider">Type</th>
                        <th className="px-5 py-4 font-bold tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0f1b3d]/5">
                      {jobs.map((job) => (
                        <tr key={job.id} className="transition-colors hover:bg-[#F6F8FF]">
                          <td className="px-5 py-4 font-mono text-[#D4A437]">{job.id}</td>
                          <td className="px-5 py-4 font-semibold">{job.title}</td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-[#0f1b3d]/5 px-2.5 py-1 text-xs font-semibold text-[#0f1b3d]/70">
                              {job.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#0f1b3d]/70">{job.type}</td>
                          <td className="px-5 py-4 text-right">
                            <button onClick={() => openEditModal(job)} className="mr-3 rounded-full bg-[#D4A437]/10 px-3 py-1.5 text-xs font-bold text-[#D4A437] transition-colors hover:bg-[#D4A437]/15">
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
                      className="group grid w-full gap-4 border-l-2 border-transparent px-5 py-4 text-left transition-colors hover:border-l-[#D4A437] hover:bg-[#F6F8FF] focus-visible:border-l-[#D4A437] focus-visible:bg-[#F6F8FF] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_10rem_10rem_2rem] lg:items-start lg:gap-4"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[1rem] font-bold tracking-tight text-[#0f1b3d]">{application.name}</h3>
                      </div>

                      <div className="min-w-0 text-sm text-[#0f1b3d]/70">{application.email}</div>

                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D4A437] lg:pt-0.5">{application.role}</div>

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
                        className="group grid w-full gap-4 border-l-2 border-transparent px-5 py-4 text-left transition-colors hover:border-l-[#D4A437] hover:bg-[#F6F8FF] focus-visible:border-l-[#D4A437] focus-visible:bg-[#F6F8FF] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(14rem,1.1fr)_10rem_10rem_2rem] lg:items-start lg:gap-4"
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
        </div>
      </main>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1b3d]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold tracking-tight text-[#0f1b3d]">
                {currentJob.id ? 'Edit Job Posting' : 'Create New Job'}
              </h2>
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

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Title</label>
                  <input
                    required
                    type="text"
                    value={currentJob.title || ''}
                    onChange={(event) => setCurrentJob({ ...currentJob, title: event.target.value })}
                    className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Category</label>
                  <select
                    required
                    value={currentJob.category || ''}
                    onChange={(event) => setCurrentJob({ ...currentJob, category: event.target.value })}
                    className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Type</label>
                  <select
                    required
                    value={currentJob.type || ''}
                    onChange={(event) => setCurrentJob({ ...currentJob, type: event.target.value })}
                    className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Tags (comma separated)</label>
                  <input
                    required
                    type="text"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-[#0f1b3d]/70">Description</label>
                <textarea
                  required
                  rows={5}
                  value={currentJob.description || ''}
                  onChange={(event) => setCurrentJob({ ...currentJob, description: event.target.value })}
                  className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-3 text-sm outline-none transition-colors focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-[#0f1b3d]/12 bg-white px-5 py-2.5 text-sm font-bold text-[#0f1b3d] transition-colors hover:bg-[#F0F5FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-full bg-[#0f1b3d] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0f1b3d]/90 disabled:opacity-70"
                >
                  {formLoading ? 'Saving...' : 'Save Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedContactSubmission && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f1b3d]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.5rem] bg-white shadow-2xl">
            <div className={detailModalHeaderClassName}>
              <div>
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D4A437]">Contact message</p>
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
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#D4A437]">Job application</p>
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
    </div>
  );
}
