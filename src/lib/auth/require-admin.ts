import { cache } from 'react';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/auth/session';
import type { AdminPermission, AdminPublic } from '@/lib/db/types';
import { getAdminById, toPublicAdmin } from '@/services/auth/admin-users';

/**
 * Resolves the signed-in admin from the session cookie. Checks the signature, then
 * that the account still exists, is active, and the session hasn't been revoked.
 * Deduplicated per request.
 */
export const getCurrentAdmin = cache(async (): Promise<AdminPublic | null> => {
  const cookieStore = await cookies();
  const payload = await verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!payload) return null;

  try {
    const record = await getAdminById(payload.sub);
    if (!record || record.active === false || record.sessionVersion !== payload.v) return null;
    return toPublicAdmin(record);
  } catch (error) {
    console.error('Failed to resolve admin session:', error);
    return null;
  }
});

export function hasPermission(admin: AdminPublic, permission: AdminPermission) {
  return admin.permissions.includes(permission);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: 'You don’t have permission to do that.' }, { status: 403 });
}

type RequireAdminResult = { ok: true; admin: AdminPublic } | { ok: false; response: NextResponse };

/**
 * Route-handler guard. With no permission it only requires a valid session.
 *
 *   const auth = await requireAdmin('jobs');
 *   if (!auth.ok) return auth.response;
 */
export async function requireAdmin(permission?: AdminPermission): Promise<RequireAdminResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, response: unauthorizedResponse() };
  if (permission && !hasPermission(admin, permission)) return { ok: false, response: forbiddenResponse() };
  return { ok: true, admin };
}
