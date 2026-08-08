"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMOS = [
  {
    key: "admin",
    label: "Admin",
    email: "admin@tuetinh.edu",
    password: "demo1234",
  },
  {
    key: "gv",
    label: "Giảng viên",
    email: "gv001@tuetinh.edu",
    password: "demo1234",
  },
  {
    key: "hs",
    label: "Học sinh",
    email: "sv001@tuetinh.edu",
    password: "demo1234",
  },
] as const;

export function LoginForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError || "");
  const [loading, setLoading] = useState(false);

  async function doLogin(email: string, pass: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          login: email.trim(),
          password: pass.trim(),
          next: nextPath || "/portal",
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        next?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Sai tài khoản hoặc mật khẩu.");
        setLoading(false);
        return;
      }

      window.location.href = data.next || "/portal";
    } catch {
      setError("Không kết nối được máy chủ. Thử lại.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          {error}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3">
        {DEMOS.map((d) => (
          <button
            key={d.key}
            type="button"
            disabled={loading}
            onClick={() => {
              setLogin(d.email);
              setPassword(d.password);
              void doLogin(d.email, d.password);
            }}
            className="rounded-md border border-brand/30 bg-brand-soft/40 px-3 py-2.5 text-sm font-semibold text-brand-deep hover:bg-brand-soft disabled:opacity-60"
          >
            Vào nhanh {d.label}
          </button>
        ))}
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void doLogin(login, password);
        }}
      >
        <label className="block">
          <span className="text-sm font-medium text-ink">Email hoặc MSSV</span>
          <input
            name="login"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="admin@tuetinh.edu"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Mật khẩu</span>
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
      <p className="text-center text-xs text-muted">
        Gợi ý: bấm <strong>Vào nhanh Admin</strong> — không cần gõ tay.
      </p>
    </div>
  );
}
