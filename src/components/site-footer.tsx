import Image from "next/image";
import Link from "next/link";
import { ContactLines } from "@/components/contact-lines";
import { getSchoolSettings } from "@/lib/cms";

const columns = [
  {
    title: "Đào tạo",
    links: [
      { href: "/nganh-dao-tao", label: "Ngành đào tạo" },
      { href: "/tuyen-sinh", label: "Tuyển sinh" },
      { href: "/tuyen-sinh/dang-ky", label: "Đăng ký xét tuyển" },
    ],
  },
  {
    title: "Học vụ",
    links: [
      { href: "/dang-nhap", label: "Cổng học sinh" },
      { href: "/van-bang", label: "Tra cứu văn bằng" },
      { href: "/huong-nghiep", label: "Hướng nghiệp" },
    ],
  },
  {
    title: "Thông tin",
    links: [
      { href: "/gioi-thieu", label: "Giới thiệu" },
      { href: "/tin-tuc", label: "Tin tức" },
      { href: "/lien-he", label: "Liên hệ" },
    ],
  },
];

export async function SiteFooter() {
  const school = await getSchoolSettings();

  return (
    <footer className="mt-auto border-t border-line bg-brand-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src={school.logo}
                alt={`Logo ${school.shortName}`}
                width={120}
                height={90}
                className="h-11 w-auto rounded-md bg-white/95 object-contain p-1"
              />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold leading-tight sm:text-xl">
                  {school.shortName}
                </p>
                <p className="mt-0.5 text-xs text-white/65">
                  Cổng tuyển sinh TamvangHub
                </p>
              </div>
            </div>
            <div className="mt-4">
              <ContactLines address={school.address} email={school.email} />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {col.title}
              </p>
              <ul className="mt-3 space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/45">
        © {new Date().getFullYear()} Tuệ Tĩnh Hà Nội – TamvangHub
      </div>
    </footer>
  );
}
