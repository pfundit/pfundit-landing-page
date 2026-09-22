import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getJobApplicationsCollection, getJobsCollection } from '@/lib/db/collections';
import type { JobApplicationRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { uploadResumeToCloudinary } from '@/services/storage/cloudinary';
import { sendJobApplicationNotificationEmail } from '@/services/mail/resend';

export const runtime = 'nodejs';

const applicationsSeedPath = path.join(process.cwd(), 'src', 'data', 'job-applications.json');
const allowedResumeExtensions = new Set(['pdf', 'doc', 'docx']);
const maxResumeBytes = 10 * 1024 * 1024;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function getFileExtension(fileName: string) {
  const parts = fileName.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

async function ensureJobApplicationsSeeded() {
  const applicationsCollection = await getJobApplicationsCollection();
  const existingCount = await applicationsCollection.estimatedDocumentCount();
  if (existingCount > 0) return;

  const raw = await fs.readFile(applicationsSeedPath, 'utf8');
  const seedData = JSON.parse(raw) as JobApplicationRecord[];
  if (seedData.length === 0) return;

  const normalizedSeed = seedData.map((entry) => ({
    id: entry.id || createRecordId('jobapp'),
    role: String(entry.role || '').trim(),
    category: typeof entry.category === 'string' ? entry.category.trim() : undefined,
    type: typeof entry.type === 'string' ? entry.type.trim() : undefined,
    name: String(entry.name || '').trim(),
    email: String(entry.email || '').trim().toLowerCase(),
    linkedin: typeof entry.linkedin === 'string' ? entry.linkedin.trim() : undefined,
    resumeName: typeof entry.resumeName === 'string' ? entry.resumeName.trim() : undefined,
    resumeUrl: typeof entry.resumeUrl === 'string' ? entry.resumeUrl.trim() : undefined,
    resumeLink: typeof entry.resumeLink === 'string' ? entry.resumeLink.trim() : undefined,
    whyPfundit: String(entry.whyPfundit || '').trim(),
    createdAt: entry.createdAt || new Date().toISOString(),
    status: 'new' as const,
  }));

  if (normalizedSeed.length > 0) {
    await applicationsCollection.insertMany(normalizedSeed);
  }
}

export async function GET() {
  try {
    await ensureJobApplicationsSeeded();
    const applicationsCollection = await getJobApplicationsCollection();
    const applications = await applicationsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error reading job applications:', error);
    return NextResponse.json({ error: 'Failed to read job applications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const role = String(formData.get('Role') || '').trim();
    const name = String(formData.get('Name') || '').trim();
    const email = String(formData.get('Email') || '').trim().toLowerCase();
    const linkedin = String(formData.get('LinkedIn') || '').trim();
    const whyPfundit = String(formData.get('Why Pfundit') || '').trim();
    const resume = formData.get('Resume');

    if (!role || !name || !email || !whyPfundit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: 'Resume upload is required' }, { status: 400 });
    }

    if (resume.size > maxResumeBytes) {
      return NextResponse.json({ error: 'Resume size must be 10 MB or less' }, { status: 400 });
    }

    const extension = getFileExtension(resume.name);
    if (!allowedResumeExtensions.has(extension)) {
      return NextResponse.json({ error: 'Unsupported resume format' }, { status: 400 });
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    
    // 1. Upload resume directly to Cloudinary CDN
    const cloudinaryUpload = await uploadResumeToCloudinary(resumeBuffer, resume.name);

    // 2. Query matching job category / type
    const jobsCollection = await getJobsCollection();
    const matchedJob = await jobsCollection.findOne(
      { title: role },
      { projection: { _id: 0, category: 1, type: 1 } },
    );

    const applicationId = createRecordId('jobapp');

    // 3. Create persistent record with Cloudinary URL
    const newApplication: JobApplicationRecord = {
      role,
      category: matchedJob?.category,
      type: matchedJob?.type,
      name,
      email,
      linkedin,
      resumeName: resume.name,
      resumeUrl: cloudinaryUpload.secureUrl,
      whyPfundit,
      id: applicationId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const applicationsCollection = await getJobApplicationsCollection();
    await applicationsCollection.insertOne(newApplication);

    // 4. Send plain-text notification email to configured admin recipients via Resend
    try {
      await sendJobApplicationNotificationEmail(newApplication, cloudinaryUpload.secureUrl);
    } catch (emailErr) {
      console.error('Non-blocking: Failed to send application notification email:', emailErr);
    }

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json({ error: 'Failed to save job application' }, { status: 500 });
  }
}
