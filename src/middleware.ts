// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoggedIn = !!req.auth;

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
