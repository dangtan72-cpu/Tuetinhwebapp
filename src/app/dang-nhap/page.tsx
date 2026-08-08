import Link from "next/link";
import { DEMO_PASSWORD } from "@/lib/auth";
import { DemoLoginFill } from "@/components/demo-login-fill";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Đăng nhập cổng học sinh",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const user = await getSessionUser();
  const params = await searchParams;
  if (user) redirect(params.next || "/portal");

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          Student Portal
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-brand-deep sm:text-4xl">
          Đăng nhập cổng học vụ
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Dùng đúng link có <strong>www</strong>:{" "}
          www.yduoctuetinhhanoi.com.vn/dang-nhap
        </p>
        <div className="mt-8 space-y-4 rounded-xl border border-line bg-surface p-5 text-sm text-muted">
          <div>
            <p className="font-medium text-ink">Admin / AI Orchestrator</p>
            <p className="mt-1">
              <code className="text-brand-deep">admin@tuetinh.edu</code> /{" "}
              <code className="text-brand-deep">{DEMO_PASSWORD}</code>
            </p>
            <DemoLoginFill
              email="admin@tuetinh.edu"
              password={DEMO_PASSWORD}
              label="admin"
            />
          </div>
          <div>
            <p className="font-medium text-ink">Giảng viên demo</p>
            <p className="mt-1">
              <code className="text-brand-deep">gv001@tuetinh.edu</code> /{" "}
              <code className="text-brand-deep">{DEMO_PASSWORD}</code>
            </p>
            <DemoLoginFill
              email="gv001@tuetinh.edu"
              password={DEMO_PASSWORD}
              label="GV"
            />
          </div>
          <div>
            <p className="font-medium text-ink">Học sinh demo</p>
            <p className="mt-1">
              <code className="text-brand-deep">sv001@tuetinh.edu</code> /{" "}
              <code className="text-brand-deep">{DEMO_PASSWORD}</code>
            </p>
            <DemoLoginFill
              email="sv001@tuetinh.edu"
              password={DEMO_PASSWORD}
              label="HS"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        {params.error ? (
          <p className="mb-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
            {params.error}
          </p>
        ) : null}
        <form
          id="login-form"
          action="/api/auth/login"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="next" value={params.next || "/portal"} />
          <label className="block">
            <span className="text-sm font-medium text-ink">Email hoặc MSSV</span>
            <input
              name="login"
              required
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
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
          >
            Đăng nhập
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/tuyen-sinh/dang-ky" className="font-medium text-brand">
            Đăng ký xét tuyển
          </Link>
        </p>
      </div>
    </div>
  );
}
