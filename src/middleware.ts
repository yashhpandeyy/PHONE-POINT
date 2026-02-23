
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add routes to this array to protect them.
const PROTECTED_ROUTES: string[] = [];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Check if any cookie starts with the Appwrite session prefix 'a_session_'
    const hasSessionCookie = request.cookies.getAll().some(cookie => cookie.name.startsWith('a_session_'));

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (!hasSessionCookie && isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }

  } catch (error) {
    console.error('Error in middleware:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static assets in /public like images, manifest, etc.
     */
    '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)|manifest.json|sw.js).*)',
  ],
};
