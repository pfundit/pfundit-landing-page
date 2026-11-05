import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { AdminRuleError, createAdmin, listAdmins } from '@/services/auth/admin-users';

export const runtime = 'nodejs';

export async function GET() {
  const auth = await requireAdmin('admins');
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json(await listAdmins());
  } catch (error) {
    console.error('Failed to list admins:', error);
    return NextResponse.json({ error: 'Failed to load admins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin('admins');
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const admin = await createAdmin({
      username: body.username,
      name: body.name,
      password: body.password,
      permissions: body.permissions,
      createdBy: auth.admin.username,
    });
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    if (error instanceof AdminRuleError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Failed to create admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
