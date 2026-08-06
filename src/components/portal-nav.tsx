import Link from "next/link";
import type { DemoUser } from "@/lib/auth";

export function PortalNav({
  user,
  pathname,
}: {
  user: DemoUser;
  pathname: string;
}) {
  const links =
    user.role === "teacher"
      ? [
          { href: "/portal", label: "Tổng quan" },
          { href: "/portal/giang-day", label: "Lớp giảng dạy" },
          { href: "/portal/bai-tap", label: "Bài tập" },
          { href: "/portal/ho-so-tuyen-sinh", label: "Hồ sơ tuyển sinh" },
          { href: "/portal/cms", label: "CMS nội dung" },
          { href: "/portal/ho-so", label: "Hồ sơ" },
        ]
      : [
          { href: "/portal", label: "Tổng quan" },
          { href: "/portal/lop-hoc", label: "Lớp học online" },
          { href: "/portal/bai-tap", label: "Bài tập" },
          { href: "/portal/lich-hoc", label: "Lịch học" },
          { href: "/portal/diem", label: "Kết quả học tập" },
          { href: "/portal/ho-so", label: "Hồ sơ" },
        ];

  return (
    <aside className="border-b border-line bg-surface md:border-b-0 md:border-r">
      <div className="px-4 py-5 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {user.role === "teacher" ? "Cổng giảng viên" : "Cổng học sinh"}
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-brand-deep">
          {user.fullName}
        </p>
        <p className="text-sm text-muted">
          {user.studentId} · {user.className}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-6">
        {links.map((link) => {
          const active =
            link.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-brand text-white"
                  : "text-ink/80 hover:bg-brand-soft hover:text-brand-deep"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <form action="/api/auth/logout" method="POST" className="md:mt-4">
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-accent transition hover:bg-accent-soft"
          >
            Đăng xuất
          </button>
        </form>
      </nav>
    </aside>
  );
}
