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
  const tags = normalizeTags(payload.tags);

  if (!title || !type || !description || tags.length === 0 || !allowedCategories.has(category)) {
    return null;
  }

  return { title, type, category, description, tags };
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
  const existingCount = await jobsCollection.estimatedDocumentCount();
  if (existingCount > 0) return;

  const raw = await fs.readFile(jobsSeedPath, 'utf8');
  const seedData = JSON.parse(raw) as JobRecord[];
  if (seedData.length === 0) return;

  const now = new Date().toISOString();
  const normalizedSeed = seedData.map((job) => ({
    ...job,
    title: job.title.trim(),
    type: job.type.trim(),
    category: job.category,
    tags: Array.isArray(job.tags) ? job.tags.map((tag) => tag.trim()).filter(Boolean) : [],
    description: job.description?.trim(),
    createdAt: job.createdAt || now,
    updatedAt: now,
  }));

  await jobsCollection.insertMany(normalizedSeed);
}

export async function GET() {
  try {
    await ensureJobsSeeded();
    const jobsCollection = await getJobsCollection();
    const jobs = await jobsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error reading jobs:', error);
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
    await jobsCollection.insertOne(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
