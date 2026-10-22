import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/&" || path === "/$" || /["“”]/.test(path)) {
    return NextResponse.redirect(new URL("/", request.url), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/&", "/$", "/((?!_next/static|_next/image|favicon.ico|assets/|brand/|home/).*)"],
};
