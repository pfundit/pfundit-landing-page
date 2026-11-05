import { NextResponse } from 'next/server';
import { setAdminSessionCookie } from '@/lib/auth/session-cookie';
import { createAttemptLimiter, getClientIp } from '@/lib/auth/rate-limit';
import { authenticateAdmin, isAdminAuthConfigured } from '@/services/auth/admin-users';

export const runtime = 'nodejs';

const loginLimiter = createAttemptLimiter({ maxAttempts: 10, windowMs: 15 * 60 * 1000 });

export async function POST(request: Request) {
  try {
    const limiterKey = `login:${getClientIp(request)}`;
    const retryAfter = loginLimiter.blockedFor(limiterKey);
    if (retryAfter > 0) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!isAdminAuthConfigured()) {
      return NextResponse.json({ error: 'Admin auth environment is not configured on server' }, { status: 500 });
    }

    const result = await authenticateAdmin(username, password);
    if (!result.ok) {
      if (result.reason === 'disabled') {
        // Only reachable with the correct password, so this doesn't leak account existence.
        return NextResponse.json(
          { error: 'This admin account has been disabled. Contact another admin.' },
          { status: 403 },
        );
      }
      loginLimiter.recordFailure(limiterKey);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    loginLimiter.reset(limiterKey);
    return setAdminSessionCookie(NextResponse.json({ success: true }), result.admin.id, result.admin.sessionVersion);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
