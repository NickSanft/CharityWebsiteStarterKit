import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isSetupPage = req.nextUrl.pathname === '/admin/setup';
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // Allow auth API routes and public pages
  if (isApiAuthRoute || (!isAdminRoute)) {
    return NextResponse.next();
  }

  // Allow login and setup pages without auth
  if (isLoginPage || isSetupPage) {
    return NextResponse.next();
  }

  // Require auth for all other admin routes
  if (!req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|uploads).*)'],
};
