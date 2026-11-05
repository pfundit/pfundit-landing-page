import { NextResponse } from 'next/server';
import {
  getAdminNotificationEmails,
  getDefaultAdminEmails,
  setAdminNotificationEmails,
} from '@/services/settings/notification-settings';
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/require-admin';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    const recipientEmails = await getAdminNotificationEmails();
    const defaultEmails = getDefaultAdminEmails();

    return NextResponse.json({
      recipientEmails,
      defaultEmails,
    });
  } catch (error) {
    console.error('Failed to get admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notification settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    const body = await request.json();
    const emails = Array.isArray(body?.recipientEmails) ? body.recipientEmails : [];

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one valid notification email address.' },
        { status: 400 }
      );
    }

    const updated = await setAdminNotificationEmails(emails);

    return NextResponse.json({
      success: true,
      recipientEmails: updated,
    });
  } catch (error: unknown) {
    console.error('Failed to update notification settings:', error);
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
