import { prisma } from "../src/lib/db";

/** Đồng bộ thông tin liên hệ TamvangHub vào SiteSettings khi deploy. */
async function main() {
  const data = {
    name: "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội – TamvangHub",
    shortName: "Tuệ Tĩnh · TamvangHub",
    tagline:
      "TamvangHub - Cổng tuyển sinh của Trường trung cấp y dược Tuệ Tĩnh Hà Nội.",
    phone: "Mr. Việt 0987000743 / Mr. Kiên 0988991688",
    address: "Số 12 Phố Hoàng Cầu, phường Ô Chợ Dừa, Hà Nội",
  };

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...data,
      email: "daotao@yduoctuetinh.edu.vn",
      facebook: "https://www.facebook.com/YDuocTueTinhHaNoi",
      youtube: "http://www.youtube.com/@yduoctuetinhhanoi",
      logoUrl: "/brand/logo.webp",
      logoIconUrl: "/brand/logo-icon.png",
      heroImageUrl: "/gallery/campus-1.webp",
      aboutImageUrl: "/gallery/campus-2.webp",
      admissionsImageUrl: "/gallery/admissions-banner.webp",
      aboutText:
        "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội – TamvangHub là cổng tuyển sinh trực tuyến. Địa chỉ: Số 12 Phố Hoàng Cầu, phường Ô Chợ Dừa, Hà Nội.",
    },
    update: data,
  });

  console.log("[update-contact] OK", data.shortName, data.address);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("[update-contact]", e);
  try {
    await prisma.$disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
