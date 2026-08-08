import { NextResponse } from "next/server";
import { AUTH_COOKIE, encodeSession } from "@/lib/auth";
import { authenticateUser } from "@/lib/users";

function cookieOptions(request: Request) {
  const reqUrl = new URL(request.url);
  const isHttps = reqUrl.protocol === "https:";
  // Host-only cookie (no Domain=) — tránh Safari/ITP từ chối cookie parent domain
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: isHttps,
  };
}

function fail(
  wantsJson: boolean,
  request: Request,
  nextPath: string,
  message: string,
  status = 401,
) {
  if (wantsJson) {
    return NextResponse.json({ ok: false, error: message }, { status });
  }
  const url = new URL("/dang-nhap", request.url);
  url.searchParams.set("error", message);
  if (nextPath) url.searchParams.set("next", nextPath);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  let login = "";
  let password = "";
  let nextPath = "/portal";
  let wantsJson = contentType.includes("application/json");

  try {
    if (wantsJson) {
      const body = (await request.json().catch(() => null)) as {
        login?: string;
        email?: string;
        password?: string;
        next?: string;
      } | null;
      login = String(body?.login ?? body?.email ?? "").trim();
      password = String(body?.password ?? "").trim();
      nextPath = String(body?.next ?? "/portal");
    } else {
      const form = await request.formData();
      login = String(form.get("login") ?? form.get("email") ?? "").trim();
      password = String(form.get("password") ?? "").trim();
      nextPath = String(form.get("next") ?? "/portal");
      wantsJson = (request.headers.get("accept") || "").includes(
        "application/json",
      );
    }

    if (!login || !password) {
      return fail(wantsJson, request, nextPath, "Nhập email và mật khẩu.");
    }

    const user = await authenticateUser(login, password);
    if (!user) {
      return fail(
        wantsJson,
        request,
        nextPath,
        "Sai tài khoản hoặc mật khẩu.",
      );
    }

    const safeNext =
      nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/portal";

    if (wantsJson) {
      const res = NextResponse.json({
        ok: true,
        next: safeNext,
        user: {
          fullName: user.fullName,
          role: user.role,
          email: user.email,
        },
      });
      res.cookies.set(
        AUTH_COOKIE,
        encodeSession(user.id),
        cookieOptions(request),
      );
      return res;
    }

    const res = NextResponse.redirect(new URL(safeNext, request.url), 303);
    res.cookies.set(
      AUTH_COOKIE,
      encodeSession(user.id),
      cookieOptions(request),
    );
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return fail(
      wantsJson,
      request,
      nextPath,
      "Lỗi máy chủ khi đăng nhập. Thử lại sau.",
      500,
    );
  }
}
