import type { Collection } from 'mongodb';
import { getDatabase } from '@/lib/db/client';
import type { ContactSubmissionRecord, JobApplicationRecord, JobRecord, NotificationSettingsRecord } from '@/lib/db/types';

const COLLECTIONS = {
  jobs: 'jobs',
  jobApplications: 'jobApplications',
  contactSubmissions: 'contactSubmissions',
  settings: 'settings',
} as const;

export async function getJobsCollection(): Promise<Collection<JobRecord>> {
  const db = await getDatabase();
  return db.collection<JobRecord>(COLLECTIONS.jobs);
}

export async function getJobApplicationsCollection(): Promise<Collection<JobApplicationRecord>> {
  const db = await getDatabase();
  return db.collection<JobApplicationRecord>(COLLECTIONS.jobApplications);
}

export async function getContactSubmissionsCollection(): Promise<Collection<ContactSubmissionRecord>> {
  const db = await getDatabase();
  return db.collection<ContactSubmissionRecord>(COLLECTIONS.contactSubmissions);
}

export async function getSettingsCollection(): Promise<Collection<NotificationSettingsRecord>> {
  const db = await getDatabase();
  return db.collection<NotificationSettingsRecord>(COLLECTIONS.settings);
}
