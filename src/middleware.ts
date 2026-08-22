import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { pages } from '@/config/routing/pages.route';

const isPublicRoute = createRouteMatcher([
  pages.ROOT,
  `${pages.AUTH.SIGN_IN}(.*)`,
  `${pages.AUTH.SIGN_UP}(.*)`,
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  if (userId && isPublicRoute(req)) {
    let path: string = pages.DASHBOARD(userId);
    
    if (orgId) {
      path = pages.DASHBOARD(orgId);
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
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
