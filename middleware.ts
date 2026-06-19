import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const role = request.cookies.get('auth_role')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/shop', '/profile', '/orders', '/wishlist', '/checkout'];
  const adminRoutes = ['/admin'];
  const publicRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isRootRoute = pathname === '/';

  // If logged out and trying to access protected or admin routes
  if (!token && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login/register/root
  if (token && (isPublicRoute || isRootRoute)) {
    return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/shop?tab=home', request.url));
  }

  // If logged in as user, but trying to access admin
  if (token && role !== 'admin' && isAdminRoute) {
    return NextResponse.redirect(new URL('/shop', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|downloads|docs|about|contact).*)'],
};
