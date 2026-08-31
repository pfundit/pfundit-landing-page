import { NextResponse } from 'next/server';
import { getJobsCollection } from '@/lib/db/collections';
import type { JobCategory } from '@/lib/db/types';

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

    const jobsCollection = await getJobsCollection();
    const updateResult = await jobsCollection.findOneAndUpdate(
      { id: params.id },
      { $set: parsedPayload },
      { returnDocument: 'after', projection: { _id: 0 } },
    );

    if (!updateResult) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(updateResult);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const jobsCollection = await getJobsCollection();
    const deleteResult = await jobsCollection.deleteOne({ id: params.id });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
