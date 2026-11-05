import { redirect } from 'next/navigation';
import { AdminDashboard, type AdminDashboardInitialData } from './dashboard';
import { getCurrentAdmin, hasPermission } from '@/lib/auth/require-admin';
import type { AdminPermission } from '@/lib/db/types';
import {
  listContactSubmissions,
  listInvestorEnquiries,
  listJobApplications,
  listJobs,
} from '@/services/admin/records';
import { listAdmins } from '@/services/auth/admin-users';
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
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  // Only load what this admin is allowed to see. Everything runs in parallel,
  // server-side, so the dashboard renders with data instead of client round-trips.
  const allowed = (permission: AdminPermission) => hasPermission(admin, permission);
  const none = <T,>(value: T) => Promise.resolve(value);

  const [jobs, jobApplications, investorEnquiries, contactSubmissions, recipientEmails, admins] = await Promise.all([
    allowed('jobs') ? settle('jobs', listJobs(), []) : none([]),
    allowed('applications') ? settle('job applications', listJobApplications(), []) : none([]),
    allowed('investors') ? settle('investor enquiries', listInvestorEnquiries(), []) : none([]),
    allowed('contacts') ? settle('contact submissions', listContactSubmissions(), []) : none([]),
    allowed('settings') ? settle('notification settings', getAdminNotificationEmails(), [] as string[]) : none([] as string[]),
    allowed('admins') ? settle('admins', listAdmins(), []) : none([]),
  ]);

  const initialData: AdminDashboardInitialData = {
    currentAdmin: admin,
    jobs,
    jobApplications,
    investorEnquiries,
    contactSubmissions,
    recipientEmails,
    admins,
  };

  return <AdminDashboard initialData={initialData} />;
}
