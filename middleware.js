import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (pathname.startsWith("/administrator")) {
    if (!token) {
      return NextResponse.json(
        { error: "No token, redirect to login" },
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default-secret"
      );
      const { payload } = await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      const res = NextResponse.json(
        { error: "Token invalid or expired" },
        { status: 403 }
      );
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/administrator/:path*"],
};
