import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getContactSubmissionsCollection } from '@/lib/db/collections';
import type { ContactSubmissionRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { buildContactSubmissionEmail, sendMail } from '@/lib/mail';

export const runtime = 'nodejs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactSeedPath = path.join(process.cwd(), 'src', 'data', 'contact-submissions.json');

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

async function ensureContactSeeded() {
  const submissionsCollection = await getContactSubmissionsCollection();
  const existingCount = await submissionsCollection.estimatedDocumentCount();
  if (existingCount > 0) return;

  const raw = await fs.readFile(contactSeedPath, 'utf8');
  const seedData = JSON.parse(raw) as ContactSubmissionRecord[];
  if (seedData.length === 0) return;

  const normalizedSeed = seedData.map((entry) => ({
    id: entry.id || createRecordId('contact'),
    name: normalizeString(entry.name),
    email: normalizeString(entry.email).toLowerCase(),
    company: normalizeString(entry.company) || undefined,
    subject: normalizeString(entry.subject) || undefined,
    message: normalizeString(entry.message),
    createdAt: entry.createdAt || new Date().toISOString(),
    status: 'new' as const,
  }));

  if (normalizedSeed.length > 0) {
    await submissionsCollection.insertMany(normalizedSeed);
  }
}

export async function GET() {
  try {
    await ensureContactSeeded();
    const submissionsCollection = await getContactSubmissionsCollection();
    const submissions = await submissionsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error reading contact submissions:', error);
    return NextResponse.json({ error: 'Failed to read contact submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = normalizeString(body.name);
    const email = normalizeString(body.email).toLowerCase();
    const company = normalizeString(body.company);
    const subject = normalizeString(body.subject);
    const message = normalizeString(body.message);

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const newSubmission: ContactSubmissionRecord = {
      id: createRecordId('contact'),
      name,
      email,
      company: company || undefined,
      subject: subject || undefined,
      message,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const submissionsCollection = await getContactSubmissionsCollection();
    await submissionsCollection.insertOne(newSubmission);

    const emailPayload = buildContactSubmissionEmail(newSubmission);
    await sendMail({
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
      replyTo: newSubmission.email,
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json({ error: 'Failed to save contact submission' }, { status: 500 });
  }
}
