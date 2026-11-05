import { NextResponse, after } from 'next/server';
import { getInvestorEnquiriesCollection } from '@/lib/db/collections';
import type { InvestorEnquiryRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { buildInvestorEnquiryEmail, sendMail } from '@/lib/mail';
import { sendInvestorEnquiryNotificationEmail } from '@/services/mail/resend';
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/require-admin';
import { listInvestorEnquiries } from '@/services/admin/records';

export const runtime = 'nodejs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_INVESTOR_TYPES = [
  'Institutional investor',
  'Accredited investor',
  'Professional investor (other jurisdiction)',
  'Other',
];

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function GET() {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    return NextResponse.json(await listInvestorEnquiries());
  } catch (error) {
    console.error('Error reading investor enquiries:', error);
    return NextResponse.json({ error: 'Failed to read investor enquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = normalizeString(body.name);
    const organisation = normalizeString(body.organisation || body.organization);
    const role = normalizeString(body.role);
    const email = normalizeString(body.email).toLowerCase();
    const country = normalizeString(body.country);
    const investorType = normalizeString(body.investorType);
    const confirmed = Boolean(body.confirmed);

    if (!name || !organisation || !role || !email || !country || !investorType) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in name, organisation, role, email, country, and investor type.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!VALID_INVESTOR_TYPES.includes(investorType)) {
      return NextResponse.json(
        { error: 'Please select a valid investor type.' },
        { status: 400 }
      );
    }

    if (!confirmed) {
      return NextResponse.json(
        { error: 'You must confirm that you are, or represent, an institutional or accredited investor.' },
        { status: 400 }
      );
    }

    const newEnquiry: InvestorEnquiryRecord = {
      id: createRecordId('investor'),
      name,
      organisation,
      role,
      email,
      country,
      investorType,
      confirmed: true,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const enquiriesCollection = await getInvestorEnquiriesCollection();
    await enquiriesCollection.insertOne({ ...newEnquiry });

    // Send notifications after the response so the visitor isn't kept waiting on email delivery.
    after(async () => {
      try {
        const resendResult = await sendInvestorEnquiryNotificationEmail(newEnquiry);
        if (!resendResult || !resendResult.success) {
          // Fallback to SMTP sendMail if configured
          const emailPayload = buildInvestorEnquiryEmail(newEnquiry);
          await sendMail({
            subject: emailPayload.subject,
            text: emailPayload.text,
            html: emailPayload.html,
            replyTo: newEnquiry.email,
          });
        }
      } catch (mailErr) {
        console.error('Failed to send investor enquiry email notification:', mailErr);
      }
    });

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating investor enquiry:', error);
    return NextResponse.json({ error: 'Failed to process investor enquiry' }, { status: 500 });
  }
}
