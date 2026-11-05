import type { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, createAdminSessionToken } from '@/lib/auth/session';

/** Signs a session for the admin and attaches it to the response as an httpOnly cookie. */
export async function setAdminSessionCookie(response: NextResponse, adminId: string, sessionVersion: number) {
  const token = await createAdminSessionToken(adminId, sessionVersion);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return response;
}
