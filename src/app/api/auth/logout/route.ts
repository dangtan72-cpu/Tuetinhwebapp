import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const reqUrl = new URL(request.url);
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  const host = reqUrl.hostname;
  const cookieDomain = host.endsWith("yduoctuetinhhanoi.com.vn")
    ? ".yduoctuetinhhanoi.com.vn"
    : undefined;

  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: reqUrl.protocol === "https:",
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });
  return res;
}
