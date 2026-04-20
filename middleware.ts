import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = [
  "/dashboard",
  "/upload",
  "/repo",
  "/account",
  "/api/upload",
  "/api/analyses",
  "/api/chat",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
