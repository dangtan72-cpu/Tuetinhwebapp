import Image from "next/image";
import Link from "next/link";
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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image
            src={school.logo}
            alt={`Logo ${school.shortName}`}
            width={160}
            height={120}
            className="h-14 w-auto rounded-md bg-white/95 object-contain p-1.5"
          />
          <p className="font-display mt-4 text-2xl font-semibold">
            {school.shortName}
          </p>
          <p className="mt-2 max-w-sm text-[15px] text-white/75">{school.name}</p>
          <p className="mt-4 text-sm text-white/65">{school.tagline}</p>
          <div className="mt-5 space-y-1 text-sm text-white/80">
            <p>{school.address}</p>
            <p>{school.phone}</p>
            <p>{school.email}</p>
          </div>
        </div>

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
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {school.name}. Demo webapp cổng trường.
      </div>
    </footer>
  );
}
