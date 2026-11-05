import fs from 'fs/promises';
import path from 'path';
import {
  getContactSubmissionsCollection,
  getInvestorEnquiriesCollection,
  getJobApplicationsCollection,
  getJobsCollection,
} from '@/lib/db/collections';
import type {
  ContactSubmissionRecord,
  InvestorEnquiryRecord,
  JobApplicationRecord,
  JobRecord,
} from '@/lib/db/types';

const jobsSeedPath = path.join(process.cwd(), 'src', 'data', 'jobs.json');

// Per-instance memoization so we don't pay an extra DB roundtrip on every request.
let jobsSeedPromise: Promise<void> | null = null;
let indexesPromise: Promise<void> | null = null;

async function seedJobsIfEmpty() {
  const jobsCollection = await getJobsCollection();
  const existingCount = await jobsCollection.estimatedDocumentCount();
  if (existingCount > 0) return;

  const raw = await fs.readFile(jobsSeedPath, 'utf8');
  const seedData = JSON.parse(raw) as JobRecord[];
  if (seedData.length === 0) return;

  const now = new Date().toISOString();
  const cleanSeedData: JobRecord[] = seedData.map((job) => ({
    id: job.id,
    title: job.title.trim(),
    type: job.type.trim(),
    category: job.category,
    tags: Array.isArray(job.tags) ? job.tags.map((tag) => tag.trim()).filter(Boolean) : [],
    description: job.description?.trim(),
    cardBlurb: job.cardBlurb?.trim() || undefined,
    location: job.location?.trim() || undefined,
    jdUrl: job.jdUrl?.trim() || undefined,
    createdAt: job.createdAt || now,
    updatedAt: job.updatedAt || now,
  }));

  await jobsCollection.insertMany(cleanSeedData);
}

function ensureJobsSeeded() {
  if (!jobsSeedPromise) {
    jobsSeedPromise = seedJobsIfEmpty().catch((error) => {
      jobsSeedPromise = null;
      throw error;
    });
  }
  return jobsSeedPromise;
}

/** Creates the indexes used by admin list queries. Runs once per instance, in the background. */
function ensureIndexes() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const [jobs, applications, investors, contacts] = await Promise.all([
        getJobsCollection(),
        getJobApplicationsCollection(),
        getInvestorEnquiriesCollection(),
        getContactSubmissionsCollection(),
      ]);
      await Promise.all([
        jobs.createIndex({ id: 1 }),
        jobs.createIndex({ title: 1 }),
        applications.createIndex({ createdAt: -1 }),
        investors.createIndex({ createdAt: -1 }),
        contacts.createIndex({ createdAt: -1 }),
      ]);
    })().catch((error) => {
      indexesPromise = null;
      console.warn('Failed to ensure MongoDB indexes:', error);
    });
  }
  return indexesPromise;
}

export async function listJobs(): Promise<JobRecord[]> {
  void ensureIndexes();
  await ensureJobsSeeded();
  const jobsCollection = await getJobsCollection();
  return jobsCollection.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
}

export async function listJobApplications(): Promise<JobApplicationRecord[]> {
  void ensureIndexes();
  const collection = await getJobApplicationsCollection();
  return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

export async function listInvestorEnquiries(): Promise<InvestorEnquiryRecord[]> {
  void ensureIndexes();
  const collection = await getInvestorEnquiriesCollection();
  return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

export async function listContactSubmissions(): Promise<ContactSubmissionRecord[]> {
  void ensureIndexes();
  const collection = await getContactSubmissionsCollection();
  return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}
