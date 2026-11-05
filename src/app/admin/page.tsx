import { redirect } from 'next/navigation';
import { AdminDashboard, type AdminDashboardInitialData } from './dashboard';
import { isAdminRequest } from '@/lib/auth/require-admin';
import {
  listContactSubmissions,
  listInvestorEnquiries,
  listJobApplications,
  listJobs,
} from '@/services/admin/records';
import { getAdminNotificationEmails } from '@/services/settings/notification-settings';

async function settle<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`Admin dashboard: failed to load ${label}:`, error);
    return fallback;
  }
}

export default async function AdminPage() {
  if (!(await isAdminRequest())) {
    redirect('/admin/login');
  }

  // Fetch everything server-side in parallel, in a single request, so the
  // dashboard renders with data instead of waiting on 5 client round-trips.
  const [jobs, jobApplications, investorEnquiries, contactSubmissions, recipientEmails] = await Promise.all([
    settle('jobs', listJobs(), []),
    settle('job applications', listJobApplications(), []),
    settle('investor enquiries', listInvestorEnquiries(), []),
    settle('contact submissions', listContactSubmissions(), []),
    settle('notification settings', getAdminNotificationEmails(), [] as string[]),
  ]);

  const initialData: AdminDashboardInitialData = {
    jobs,
    jobApplications,
    investorEnquiries,
    contactSubmissions,
    recipientEmails,
  };

  return <AdminDashboard initialData={initialData} />;
}
