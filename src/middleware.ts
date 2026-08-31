import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
    const isValidSession = await verifyAdminSessionToken(sessionCookie?.value);
    
    if (!isValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Redirect authenticated users away from the login page
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
    const isValidSession = await verifyAdminSessionToken(sessionCookie?.value);
    if (isValidSession) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
