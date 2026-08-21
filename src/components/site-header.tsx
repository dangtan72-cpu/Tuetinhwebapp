import { getSchoolSettings } from "@/lib/cms";
import { SiteHeaderClient } from "@/components/site-header-client";

const nav = [
  { href: "/nganh-dao-tao", label: "Ngành học" },
  { href: "/tuyen-sinh", label: "Tuyển sinh" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/van-bang", label: "Văn bằng" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

export async function SiteHeader() {
  const school = await getSchoolSettings();

  return (
    <SiteHeaderClient
      logo={school.logo}
      shortName={school.shortName}
      nav={nav}
    />
  );
}
