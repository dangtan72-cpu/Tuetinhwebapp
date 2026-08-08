import Link from "next/link";
import { DEMO_PASSWORD } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
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
          Mở đúng:{" "}
          <a
            className="font-medium text-brand underline"
            href="https://www.yduoctuetinhhanoi.com.vn/dang-nhap"
          >
            www.yduoctuetinhhanoi.com.vn/dang-nhap
          </a>
        </p>
        <div className="mt-8 space-y-3 rounded-xl border border-line bg-surface p-5 text-sm text-muted">
          <p className="font-medium text-ink">Tài khoản demo</p>
          <p>
            Admin: <code className="text-brand-deep">admin@tuetinh.edu</code> /{" "}
            <code className="text-brand-deep">{DEMO_PASSWORD}</code>
          </p>
          <p>
            GV: <code className="text-brand-deep">gv001@tuetinh.edu</code> /{" "}
            <code className="text-brand-deep">{DEMO_PASSWORD}</code>
          </p>
          <p>
            HS: <code className="text-brand-deep">sv001@tuetinh.edu</code> /{" "}
            <code className="text-brand-deep">{DEMO_PASSWORD}</code>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <LoginForm
          nextPath={params.next || "/portal"}
          initialError={params.error}
        />
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
