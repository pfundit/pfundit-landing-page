import type { Collection } from 'mongodb';
import { getDatabase } from '@/lib/db/client';
import type { ContactSubmissionRecord, JobApplicationRecord, JobRecord } from '@/lib/db/types';

const COLLECTIONS = {
  jobs: 'jobs',
  jobApplications: 'jobApplications',
  contactSubmissions: 'contactSubmissions',
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
