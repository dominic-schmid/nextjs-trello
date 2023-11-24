import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  afterAuth(auth, req) {
    // If user is authenticated and on public route
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org"; // by default, redirect to org selection

      // If user has already selected an org, redirect to that org
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    // Non-authenticated user tried to access a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      // Make them log in and then redirect them back to their original request
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If user is logged in but has no org, we force them to create one first
    // Except if they are already on the selector page
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
