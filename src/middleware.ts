import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { pages } from '@/config/routing/pages.route';

import { COOKIE_KEYS } from '@/config/const/app.const';

const isAuthGuestOnlyRoute = createRouteMatcher([
  `${pages.AUTH.SIGN_IN}(.*)`,
  `${pages.AUTH.SIGN_UP}(.*)`,
]);

const isLandingRoute = createRouteMatcher([
  pages.ROOT,
]);

const isPublicRoute = createRouteMatcher([
  pages.ROOT,
  `${pages.AUTH.SIGN_IN}(.*)`,
  `${pages.AUTH.SIGN_UP}(.*)`,
  '/board/(.*)',
  '/api/cards/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  if (userId) {
    let shouldRedirect = false;

    if (isAuthGuestOnlyRoute(req)) {
      shouldRedirect = true;
    } else if (isLandingRoute(req)) {
      const redirectCookie = req.cookies.get(COOKIE_KEYS.LANDING_REDIRECT)?.value;
      shouldRedirect = redirectCookie !== 'false';
    }

    if (shouldRedirect) {
      let path: string = pages.DASHBOARD(userId);
      
      if (orgId) {
        path = pages.DASHBOARD(orgId);
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }
  }

  if (!userId && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
