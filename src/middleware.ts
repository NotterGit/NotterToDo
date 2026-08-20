import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { pages } from '@/config/routing/pages.route';

const isPublicRoute = createRouteMatcher([pages.ROOT]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId } = auth();

  if (userId && isPublicRoute(req)) {
    let path: string = pages.AUTH.SELECT_ORG;
    
    if (orgId) {
      path = pages.ORGANIZATION(orgId);
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!userId && !isPublicRoute(req)) {
    auth().protect();
  }

  if (userId && !orgId && req.nextUrl.pathname !== pages.AUTH.SELECT_ORG) {
    const orgSelection = new URL(pages.AUTH.SELECT_ORG, req.url);
    return NextResponse.redirect(orgSelection);
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
