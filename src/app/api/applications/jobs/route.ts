import { NextResponse, after } from 'next/server';
import { getJobApplicationsCollection, getJobsCollection } from '@/lib/db/collections';
import type { JobApplicationRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { uploadResumeToCloudinary } from '@/services/storage/cloudinary';
import { sendJobApplicationNotificationEmail } from '@/services/mail/resend';
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/require-admin';
import { listJobApplications } from '@/services/admin/records';

export const runtime = 'nodejs';

const allowedResumeExtensions = new Set(['pdf', 'doc', 'docx']);
const maxResumeBytes = 4 * 1024 * 1024; // 4 MB limit (stays safely below Vercel's 4.5 MB serverless limit)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFileExtension(fileName: string) {
  const parts = fileName.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    return NextResponse.json(await listJobApplications());
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
      return NextResponse.json({ error: 'Resume size must be 4 MB or less' }, { status: 400 });
    }

    const extension = getFileExtension(resume.name);
    if (!allowedResumeExtensions.has(extension)) {
      return NextResponse.json({ error: 'Unsupported resume format' }, { status: 400 });
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());

    // 1. Upload resume to Cloudinary and look up the job's category/type in parallel
    const [cloudinaryUpload, matchedJob] = await Promise.all([
      uploadResumeToCloudinary(resumeBuffer, resume.name),
      getJobsCollection().then((jobsCollection) =>
        jobsCollection.findOne({ title: role }, { projection: { _id: 0, category: 1, type: 1 } }),
      ),
    ]);

    const applicationId = createRecordId('jobapp');

    // 2. Create persistent record with Cloudinary URL
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
    await applicationsCollection.insertOne({ ...newApplication });

    // 3. Notify admins after the response is sent so the candidate isn't kept waiting
    after(async () => {
      try {
        await sendJobApplicationNotificationEmail(newApplication, cloudinaryUpload.secureUrl);
      } catch (emailErr) {
        console.error('Non-blocking: Failed to send application notification email:', emailErr);
      }
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json({ error: 'Failed to save job application' }, { status: 500 });
  }
}
