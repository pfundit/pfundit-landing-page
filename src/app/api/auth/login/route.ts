import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/auth/session';
import { createAttemptLimiter, getClientIp } from '@/lib/auth/rate-limit';
import { isAdminAuthConfigured, verifyAdminCredentials } from '@/services/auth/admin-credentials';

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

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      loginLimiter.recordFailure(limiterKey);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    loginLimiter.reset(limiterKey);
    const sessionToken = await createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
