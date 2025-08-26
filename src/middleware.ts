import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;

  // Public routes that don't require role check
  const publicRoutes = ['/', '/sign-in', '/sign-up(.*)', '/role-select', '/find', '/tutor/(.*)'];


  // Protect tutor-dashboard for teachers only
  if (req.nextUrl.pathname.startsWith('/tutor-dashboard') && role !== 'teacher') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If no role and not on a public route, redirect to role-select
  if (!role && !publicRoutes.some(route => new RegExp(`^${route}$`).test(req.nextUrl.pathname))) {
    return NextResponse.redirect(new URL('/role-select', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/admin/(.*)',
  ],
};