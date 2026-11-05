import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createAttemptLimiter, getClientIp } from '@/lib/auth/rate-limit';
import { setAdminSessionCookie } from '@/lib/auth/session-cookie';
import { changeOwnPassword, validateNewPassword } from '@/services/auth/admin-users';

export const runtime = 'nodejs';

const changeLimiter = createAttemptLimiter({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });

/** Changes the signed-in admin's own password. Any signed-in admin may do this. */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const limiterKey = `password:${auth.admin.id}:${getClientIp(request)}`;
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

    const result = await changeOwnPassword(auth.admin.id, currentPassword, newPassword);
    if (!result.ok) {
      changeLimiter.recordFailure(limiterKey);
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    changeLimiter.reset(limiterKey);
    // Other sessions for this account are revoked; keep this one signed in with a fresh cookie.
    return setAdminSessionCookie(
      NextResponse.json({ success: true, updatedAt: result.updatedAt }),
      auth.admin.id,
      result.sessionVersion,
    );
  } catch (error) {
    console.error('Failed to change admin password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
