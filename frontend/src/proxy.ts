import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');

  // Define protected routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal');

  // Redirect to login if accessing protected route without session
  if ((isDashboardRoute || isPortalRoute) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Parse session to enforce role-based routing
  if (session) {
    try {
      const userData = JSON.parse(session.value);

      // ADMIN should not access portal, redirect to dashboard
      if (isPortalRoute && userData.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // CLIENT should not access dashboard, redirect to portal
      if (isDashboardRoute && userData.role === 'CLIENT') {
        return NextResponse.redirect(new URL('/portal', request.url));
      }
    } catch {
      // If session cookie is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*'],
};
