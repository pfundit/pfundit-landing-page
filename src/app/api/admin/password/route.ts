import { NextResponse } from 'next/server';
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/require-admin';
import { createAttemptLimiter, getClientIp } from '@/lib/auth/rate-limit';
import {
  getAdminPasswordInfo,
  setAdminPassword,
  validateNewPassword,
  verifyAdminPassword,
} from '@/services/auth/admin-credentials';

export const runtime = 'nodejs';

const changeLimiter = createAttemptLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });

export async function GET() {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    return NextResponse.json(await getAdminPasswordInfo());
  } catch (error) {
    console.error('Failed to read admin password info:', error);
    return NextResponse.json({ error: 'Failed to read password settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorizedResponse();

  try {
    const limiterKey = `password:${getClientIp(request)}`;
    const retryAfter = changeLimiter.blockedFor(limiterKey);
    if (retryAfter > 0) {
      return NextResponse.json(
        { error: `Too many incorrect attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required.' }, { status: 400 });
    }

    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ error: 'New password must be different from the current password.' }, { status: 400 });
    }

    const isCurrentValid = await verifyAdminPassword(currentPassword);
    if (!isCurrentValid) {
      changeLimiter.recordFailure(limiterKey);
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    changeLimiter.reset(limiterKey);
    const { updatedAt } = await setAdminPassword(newPassword);

    return NextResponse.json({ success: true, updatedAt });
  } catch (error) {
    console.error('Failed to change admin password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
