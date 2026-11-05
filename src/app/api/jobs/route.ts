import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getJobsCollection } from '@/lib/db/collections';
import type { JobCategory, JobRecord } from '@/lib/db/types';
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/require-admin';
import { listJobs } from '@/services/admin/records';

const jobsSeedPath = path.join(process.cwd(), 'src', 'data', 'jobs.json');
const allowedCategories = new Set<JobCategory>(['Leadership', 'Technology', 'Business']);

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean);
}

function parseJobPayload(body: unknown) {
  if (!body || typeof body !== 'object') return null;

  const payload = body as Record<string, unknown>;
  const title = normalizeString(payload.title);
  const type = normalizeString(payload.type);
  const category = normalizeString(payload.category) as JobCategory;
  const description = normalizeString(payload.description);
  const cardBlurb = normalizeString(payload.cardBlurb);
  const location = normalizeString(payload.location);
  const jdUrl = normalizeString(payload.jdUrl);
  const tags = normalizeTags(payload.tags);

  if (!title || !type || !description || tags.length === 0 || !allowedCategories.has(category)) {
    return null;
  }

  return {
    title,
    type,
    category,
    description,
    tags,
    ...(cardBlurb ? { cardBlurb } : {}),
    ...(location ? { location } : {}),
    ...(jdUrl ? { jdUrl } : {}),
  };
}

async function getNextJobId() {
  const jobsCollection = await getJobsCollection();
  const ids = await jobsCollection.find({}, { projection: { _id: 0, id: 1 } }).toArray();
  const maxId = ids.reduce((currentMax, record) => {
    const parsed = Number.parseInt(record.id, 10);
    return Number.isFinite(parsed) ? Math.max(currentMax, parsed) : currentMax;
  }, 0);

  return String(maxId + 1).padStart(2, '0');
}

export async function GET() {
  try {
    const jobs = await listJobs();
    if (jobs.length > 0) {
      return NextResponse.json(jobs);
    }
  } catch (error: unknown) {
    console.warn('MongoDB query warning in /api/jobs, serving from jobs.json:', error instanceof Error ? error.message : error);
  }

  // Resilient fallback to jobs.json so job postings never fail to display
  try {
    const raw = await fs.readFile(jobsSeedPath, 'utf8');
    return NextResponse.json(JSON.parse(raw));
  } catch (fallbackError) {
    console.error('Error reading fallback jobs:', fallbackError);
    return NextResponse.json({ error: 'Failed to read jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsedPayload = parseJobPayload(body);

    if (!parsedPayload) {
      return NextResponse.json({ error: 'Invalid job payload' }, { status: 400 });
    }

    const id = await getNextJobId();
    const now = new Date().toISOString();
    const newJob: JobRecord = {
      ...parsedPayload,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const jobsCollection = await getJobsCollection();
    
    // 1. Persist to jobs.json
    try {
      const raw = await fs.readFile(jobsSeedPath, 'utf8');
      const seedJobs = JSON.parse(raw) as JobRecord[];
      seedJobs.push(newJob);
      await fs.writeFile(jobsSeedPath, JSON.stringify(seedJobs, null, 2), 'utf8');
    } catch (fileErr) {
      console.warn('Warning saving to jobs.json:', fileErr);
    }

    // 2. Sync to MongoDB
    await jobsCollection.insertOne({ ...newJob });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
