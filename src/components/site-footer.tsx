import Image from "next/image";
import Link from "next/link";
import { ContactLines } from "@/components/contact-lines";
import { getSchoolSettings } from "@/lib/cms";

const columns = [
  {
    title: "Đào tạo",
    links: [
      { href: "/nganh-dao-tao", label: "Ngành đào tạo" },
      { href: "/tuyen-sinh", label: "Thông tin tuyển sinh" },
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
    title: "Nhà trường",
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
        {/* Hàng thương hiệu + liên hệ full width để tên & địa chỉ giữ 1 dòng */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:gap-6">
          <Image
            src={school.logo}
            alt={`Logo ${school.shortName}`}
            width={140}
            height={105}
            className="h-12 w-auto shrink-0 rounded-md bg-white/95 object-contain p-1"
          />
          <div className="min-w-0 flex-1">
            <p
              className="font-display font-semibold leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(0.95rem, 2.1vw, 1.35rem)" }}
            >
              <span className="inline-block max-w-full whitespace-nowrap">
                {school.name}
              </span>
            </p>
            <p className="mt-2 text-sm text-white/65">{school.tagline}</p>
            <div className="mt-3">
              <ContactLines address={school.address} email={school.email} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold tracking-wide text-white/90">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
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
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {school.shortName}. Cổng tuyển sinh
        TamvangHub.
      </div>
    </footer>
  );
}
