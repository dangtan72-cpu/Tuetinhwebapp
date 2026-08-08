import { NextResponse } from "next/server";
import { AUTH_COOKIE, encodeSession } from "@/lib/auth";
import { authenticateUser } from "@/lib/users";

export async function POST(request: Request) {
  const form = await request.formData();
  const login = String(form.get("login") ?? "").trim();
  const password = String(form.get("password") ?? "").trim();
  const nextPath = String(form.get("next") ?? "/portal");

  const user = await authenticateUser(login, password);
  if (!user) {
    const url = new URL("/dang-nhap", request.url);
    url.searchParams.set("error", "Sai tài khoản hoặc mật khẩu.");
    if (nextPath) url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url, 303);
  }

  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/portal";
  const reqUrl = new URL(request.url);
  const res = NextResponse.redirect(new URL(safeNext, request.url), 303);
  const isHttps = reqUrl.protocol === "https:";
  const host = reqUrl.hostname;
  // Share cookie across apex + www in production
  const cookieDomain =
    host.endsWith("yduoctuetinhhanoi.com.vn")
      ? ".yduoctuetinhhanoi.com.vn"
      : undefined;

  res.cookies.set(AUTH_COOKIE, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: isHttps,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });
  return res;
}
