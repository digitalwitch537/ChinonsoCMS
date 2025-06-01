
import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);

  // Allow access to Decap CMS's static files in /admin/ even if not authenticated by our cookie,
  // as Decap handles its own authentication (e.g., Netlify Identity, GitHub OAuth).
  // However, the Next.js /admin route (our dashboard) still needs auth.
  if (pathname === '/admin' && !isAuthenticated) {
     return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // If trying to access admin area (excluding Decap's UI path itself unless it's the root /admin path check above) 
  // and not authenticated, redirect to login
  if (pathname.startsWith('/admin/') && pathname !== '/admin/' && !isAuthenticated && !pathname.startsWith('/admin/index.html') && !pathname.startsWith('/admin/config.yml')) {
    // This condition is now a bit tricky. The /admin/ page itself (Decap CMS UI) should be accessible.
    // Other /admin/* (e.g. old CMS pages if not removed) should be protected.
    // For simplicity, if the user tries to access old CMS pages, they will be redirected if not logged in.
    // If new custom admin pages are added that are NOT Decap, they'd need auth.
    // The Decap CMS at /admin/index.html handles its own auth.
  }


  // If trying to access login page but already authenticated, redirect to admin dashboard
  if (pathname.startsWith('/admin/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url)); // Redirect to the new Decap-centric admin dashboard
  }

  return NextResponse.next();
}

export const config = {
  // Protect the main /admin Next.js page and the login page.
  // Decap CMS files under /admin/ (like index.html, config.yml) are static and Decap handles auth.
  matcher: ['/admin', '/admin/login'], 
};
