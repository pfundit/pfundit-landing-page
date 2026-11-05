import { NextResponse, after } from 'next/server';
import { getContactSubmissionsCollection } from '@/lib/db/collections';
import type { ContactSubmissionRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { buildContactSubmissionEmail, sendMail } from '@/lib/mail';
import { sendContactSubmissionNotificationEmail } from '@/services/mail/resend';
import { requireAdmin } from '@/lib/auth/require-admin';
import { listContactSubmissions } from '@/services/admin/records';

export const runtime = 'nodejs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function GET() {
  const auth = await requireAdmin('contacts');
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json(await listContactSubmissions());
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
    await submissionsCollection.insertOne({ ...newSubmission });

    // Send notifications after the response so the visitor isn't kept waiting on email delivery.
    after(async () => {
      try {
        const resendResult = await sendContactSubmissionNotificationEmail(newSubmission);
        if (!resendResult || !resendResult.success) {
          const emailPayload = buildContactSubmissionEmail(newSubmission);
          await sendMail({
            subject: emailPayload.subject,
            text: emailPayload.text,
            html: emailPayload.html,
            replyTo: newSubmission.email,
          });
        }
      } catch (mailErr) {
        console.error('Failed to send contact submission notification:', mailErr);
      }
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json({ error: 'Failed to save contact submission' }, { status: 500 });
  }
}
