import { NextResponse } from "next/server";
import { auth } from "./auth";

export const proxy = auth((request) => {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const signInUrl = new URL("/auth/login", request.nextUrl.origin);
    signInUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
