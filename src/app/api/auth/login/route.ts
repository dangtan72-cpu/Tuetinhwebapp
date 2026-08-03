import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  DEMO_PASSWORD,
  encodeSession,
  findUserByLogin,
} from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const login = String(form.get("login") ?? "");
  const password = String(form.get("password") ?? "");
  const nextPath = String(form.get("next") ?? "/portal");

  const user = findUserByLogin(login);
  if (!user || password !== DEMO_PASSWORD) {
    const url = new URL("/dang-nhap", request.url);
    url.searchParams.set("error", "Sai tài khoản hoặc mật khẩu.");
    if (nextPath) url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url, 303);
  }

  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/portal";
  const res = NextResponse.redirect(new URL(safeNext, request.url), 303);
  res.cookies.set(AUTH_COOKIE, encodeSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
