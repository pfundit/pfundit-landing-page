import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { AdminRuleError, deleteAdmin, updateAdmin } from '@/services/auth/admin-users';

export const runtime = 'nodejs';

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof AdminRuleError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(`${fallback}:`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/** Partial update: any of { name, permissions, active, password }. */
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin('admins');
  if (!auth.ok) return auth.response;

  try {
    const { id } = await props.params;
    const body = (await request.json()) as Record<string, unknown>;
    const admin = await updateAdmin(id, auth.admin.id, {
      name: body.name,
      permissions: body.permissions,
      active: body.active,
      password: body.password,
    });
    return NextResponse.json(admin);
  } catch (error) {
    return errorResponse(error, 'Failed to update admin');
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin('admins');
  if (!auth.ok) return auth.response;

  try {
    const { id } = await props.params;
    await deleteAdmin(id, auth.admin.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, 'Failed to delete admin');
  }
}
