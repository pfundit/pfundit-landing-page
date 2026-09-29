import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  getInvestorEnquiriesCollection,
  getContactSubmissionsCollection,
} from '@/lib/db/collections';
import type { InvestorEnquiryRecord, ContactSubmissionRecord } from '@/lib/db/types';
import { createRecordId } from '@/lib/server/ids';
import { buildInvestorEnquiryEmail, sendMail } from '@/lib/mail';
import { sendInvestorEnquiryNotificationEmail } from '@/services/mail/resend';

export const runtime = 'nodejs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const investorSeedPath = path.join(process.cwd(), 'src', 'data', 'investor-enquiries.json');

const VALID_INVESTOR_TYPES = [
  'Institutional investor',
  'Accredited investor',
  'Professional investor (other jurisdiction)',
  'Other',
];

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function ensureInvestorEnquiriesSeeded() {
  try {
    const enquiriesCollection = await getInvestorEnquiriesCollection();
    const existingCount = await enquiriesCollection.estimatedDocumentCount();
    if (existingCount > 0) return;

    try {
      const raw = await fs.readFile(investorSeedPath, 'utf8');
      const seedData = JSON.parse(raw) as InvestorEnquiryRecord[];
      if (Array.isArray(seedData) && seedData.length > 0) {
        await enquiriesCollection.insertMany(seedData);
      }
    } catch {
      // File may be empty or not exist yet
    }
  } catch (error) {
    console.warn('MongoDB query warning in ensureInvestorEnquiriesSeeded:', error);
  }
}

export async function GET() {
  try {
    await ensureInvestorEnquiriesSeeded();
    const enquiriesCollection = await getInvestorEnquiriesCollection();
    const enquiries = await enquiriesCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error reading investor enquiries from DB, falling back to local file:', error);
    try {
      const raw = await fs.readFile(investorSeedPath, 'utf8');
      const data = JSON.parse(raw);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json([], { status: 200 });
    }
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

    // 1. Save to investor collection
    try {
      const enquiriesCollection = await getInvestorEnquiriesCollection();
      await enquiriesCollection.insertOne(newEnquiry);
    } catch (dbErr) {
      console.warn('MongoDB insert warning for investor enquiry:', dbErr);
    }

    // 2. Persist to local JSON fallback
    try {
      let localData: InvestorEnquiryRecord[] = [];
      try {
        const raw = await fs.readFile(investorSeedPath, 'utf8');
        localData = JSON.parse(raw);
      } catch {
        localData = [];
      }
      localData.unshift(newEnquiry);
      await fs.writeFile(investorSeedPath, JSON.stringify(localData, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('File write error for investor enquiry seed:', fsErr);
    }

    // 3. Mirror into contact submissions so existing admin contact view captures it
    try {
      const mirroredContact: ContactSubmissionRecord = {
        id: createRecordId('contact'),
        name,
        email,
        company: organisation,
        subject: `Investor Enquiry (${investorType})`,
        message: `Investor Enquiry Details:\n- Role: ${role}\n- Country: ${country}\n- Investor Type: ${investorType}\n- Status: Confirmed Accredited/Institutional Investor`,
        createdAt: newEnquiry.createdAt,
        status: 'new',
      };
      const contactCollection = await getContactSubmissionsCollection();
      await contactCollection.insertOne(mirroredContact);
    } catch (mirrorErr) {
      console.warn('Failed to mirror investor enquiry into contact submissions:', mirrorErr);
    }

    // 4. Send email notification via Resend to admin recipients
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

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating investor enquiry:', error);
    return NextResponse.json({ error: 'Failed to process investor enquiry' }, { status: 500 });
  }
}
