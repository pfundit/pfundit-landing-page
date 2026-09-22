import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getJobsCollection } from '@/lib/db/collections';
import type { JobCategory, JobRecord } from '@/lib/db/types';

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

async function ensureJobsSeeded() {
  const jobsCollection = await getJobsCollection();
  const raw = await fs.readFile(jobsSeedPath, 'utf8');
  const seedData = JSON.parse(raw) as JobRecord[];
  if (seedData.length === 0) return;

  const now = new Date().toISOString();
  for (const job of seedData) {
    const existing = await jobsCollection.findOne({ title: job.title.trim() });
    if (!existing) {
      await jobsCollection.insertOne({
        ...job,
        title: job.title.trim(),
        type: job.type.trim(),
        category: job.category,
        tags: Array.isArray(job.tags) ? job.tags.map((tag) => tag.trim()).filter(Boolean) : [],
        description: job.description?.trim(),
        cardBlurb: job.cardBlurb?.trim() || undefined,
        location: job.location?.trim() || undefined,
        jdUrl: job.jdUrl?.trim() || undefined,
        createdAt: job.createdAt || now,
        updatedAt: now,
      });
    } else {
      await jobsCollection.updateOne(
        { _id: existing._id },
        {
          $set: {
            id: job.id,
            cardBlurb: existing.cardBlurb || job.cardBlurb?.trim(),
            location: existing.location || job.location?.trim(),
            description: existing.description || job.description?.trim(),
            updatedAt: now,
          },
        }
      );
    }
  }
}

export async function GET() {
  try {
    await ensureJobsSeeded();
    const jobsCollection = await getJobsCollection();
    const jobs = await jobsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();

    if (jobs && jobs.length > 0) {
      return NextResponse.json(jobs);
    }
  } catch (error: any) {
    console.warn('MongoDB query warning in /api/jobs, serving from jobs.json:', error?.message || error);
  }

  // Resilient fallback to jobs.json so job postings never fail to display
  try {
    const raw = await fs.readFile(jobsSeedPath, 'utf8');
    const fallbackJobs = JSON.parse(raw);
    return NextResponse.json(fallbackJobs);
  } catch (fallbackError) {
    console.error('Error reading fallback jobs:', fallbackError);
    return NextResponse.json({ error: 'Failed to read jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    try {
      await jobsCollection.insertOne(newJob);
    } catch (dbErr: any) {
      console.warn('MongoDB insert warning in POST /api/jobs:', dbErr?.message || dbErr);
    }

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job', details: error?.message || String(error) }, { status: 500 });
  }
}
