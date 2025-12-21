import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
    const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard") || 
                           request.nextUrl.pathname.startsWith("/accounts") ||
                           request.nextUrl.pathname.startsWith("/history") ||
                           request.nextUrl.pathname.startsWith("/stats") ||
                           request.nextUrl.pathname.startsWith("/insights");

    if (!sessionCookie && isProtectedPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (sessionCookie && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/accounts/:path*", "/history/:path*", "/stats/:path*", "/insights/:path*", "/login", "/register"],
};
