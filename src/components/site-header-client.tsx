"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type NavItem = { href: string; label: string };

export function SiteHeaderClient({
  logo,
  shortName,
  nav,
}: {
  logo: string;
  shortName: string;
  nav: NavItem[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:gap-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={logo}
            alt={`Logo ${shortName}`}
            width={56}
            height={42}
            className="h-9 w-auto object-contain sm:h-10"
            priority
          />
          <span className="min-w-0">
            <span className="font-display block truncate text-[15px] font-semibold leading-tight text-brand-deep sm:text-base">
              {shortName}
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium tracking-wide text-muted sm:block">
              TamvangHub Admissions
            </span>
          </span>
        </Link>

        {/* Desktop nav — center */}
        <nav
          aria-label="Menu chính"
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-[13px] font-medium text-ink/75 transition hover:bg-brand-soft/70 hover:text-brand-deep xl:px-3.5 xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="ml-auto hidden items-center gap-2 sm:flex lg:ml-0">
          <Link
            href="/dang-nhap"
            className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 transition hover:text-brand-deep"
          >
            Đăng nhập
          </Link>
          <Link
            href="/tuyen-sinh/dang-ky"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            Đăng ký
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-brand-deep lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Đóng" : "Menu"}</span>
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 block h-0.5 w-4 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-4 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line bg-surface lg:hidden"
        >
          <nav aria-label="Menu điện thoại" className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <ul className="space-y-0.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 text-[15px] font-medium text-ink hover:bg-brand-soft"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              <Link
                href="/dang-nhap"
                className="rounded-md border border-line px-3 py-2.5 text-center text-sm font-medium text-brand-deep"
                onClick={() => setOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/tuyen-sinh/dang-ky"
                className="rounded-md bg-brand px-3 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
