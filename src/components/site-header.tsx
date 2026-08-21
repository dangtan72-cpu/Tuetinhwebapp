import Image from "next/image";
import Link from "next/link";
import { getSchoolSettings } from "@/lib/cms";

const nav = [
  { href: "/nganh-dao-tao", label: "Ngành đào tạo" },
  { href: "/tuyen-sinh", label: "Tuyển sinh" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/van-bang", label: "Tra cứu văn bằng" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

export async function SiteHeader() {
  const school = await getSchoolSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <Image
            src={school.logo}
            alt={`Logo ${school.shortName}`}
            width={48}
            height={36}
            className="h-9 w-auto object-contain sm:h-10"
            priority
          />
            <span className="min-w-0">
            <span className="font-display block truncate text-base font-semibold leading-tight text-brand-deep sm:text-lg">
              {school.shortName}
            </span>
            <span className="hidden text-xs text-muted sm:block">
              Cổng tuyển sinh TamvangHub
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-ink/80 transition hover:bg-brand-soft hover:text-brand-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tuyen-sinh/dang-ky"
            className="hidden rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:brightness-95 sm:inline-flex"
          >
            Đăng ký xét tuyển
          </Link>
          <Link
            href="/dang-nhap"
            className="rounded-md border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-medium text-brand-deep transition hover:bg-brand hover:text-white"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-line/60 px-4 py-2 lg:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-paper px-3 py-1.5 text-xs text-ink/80"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
