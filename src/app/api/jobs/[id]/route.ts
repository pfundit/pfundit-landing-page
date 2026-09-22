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

function parseJobUpdatePayload(body: unknown) {
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
    cardBlurb,
    location,
    jdUrl,
    updatedAt: new Date().toISOString(),
  };
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const parsedPayload = parseJobUpdatePayload(body);

    if (!parsedPayload) {
      return NextResponse.json({ error: 'Invalid job payload' }, { status: 400 });
    }

    let updatedRecord: JobRecord | null = null;

    // 1. Persist directly to jobs.json so edits are never lost
    try {
      const raw = await fs.readFile(jobsSeedPath, 'utf8');
      const seedJobs = JSON.parse(raw) as JobRecord[];
      const index = seedJobs.findIndex((j) => j.id === params.id);
      if (index !== -1) {
        seedJobs[index] = {
          ...seedJobs[index],
          ...parsedPayload,
          id: params.id,
        };
        updatedRecord = seedJobs[index];
        await fs.writeFile(jobsSeedPath, JSON.stringify(seedJobs, null, 2), 'utf8');
      }
    } catch (fileErr) {
      console.warn('Warning updating jobs.json on PUT:', fileErr);
    }

    // 2. Sync to MongoDB (resilient to connection/timeout drops)
    try {
      const jobsCollection = await getJobsCollection();
      const dbResult = await jobsCollection.findOneAndUpdate(
        { id: params.id },
        { $set: parsedPayload },
        { returnDocument: 'after', projection: { _id: 0 } }
      );
      if (dbResult) {
        updatedRecord = dbResult;
      }
    } catch (dbErr: any) {
      console.warn('MongoDB sync notice in PUT /api/jobs/[id]:', dbErr?.message || dbErr);
    }

    if (!updatedRecord) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job', details: error?.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;

    // 1. Remove from jobs.json
    try {
      const raw = await fs.readFile(jobsSeedPath, 'utf8');
      const seedJobs = JSON.parse(raw) as JobRecord[];
      const filtered = seedJobs.filter((j) => j.id !== params.id);
      await fs.writeFile(jobsSeedPath, JSON.stringify(filtered, null, 2), 'utf8');
    } catch (fileErr) {
      console.warn('Warning deleting from jobs.json:', fileErr);
    }

    // 2. Remove from MongoDB
    try {
      const jobsCollection = await getJobsCollection();
      await jobsCollection.deleteOne({ id: params.id });
    } catch (dbErr: any) {
      console.warn('MongoDB delete warning:', dbErr?.message || dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
