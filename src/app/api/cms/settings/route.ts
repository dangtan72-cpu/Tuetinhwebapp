import { NextResponse } from "next/server";
import { upsertSchoolSettings } from "@/lib/cms";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Chỉ giảng viên/admin" }, { status: 403 });
  }

  const form = await request.formData();
  await upsertSchoolSettings({
    name: String(form.get("name") ?? "").trim(),
    shortName: String(form.get("shortName") ?? "").trim(),
    tagline: String(form.get("tagline") ?? "").trim(),
    phone: String(form.get("phone") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    address: String(form.get("address") ?? "").trim(),
    facebook: String(form.get("facebook") ?? "").trim(),
    youtube: String(form.get("youtube") ?? "").trim(),
    logo: String(form.get("logo") ?? "").trim() || "/brand/logo.webp",
    logoIcon: String(form.get("logoIcon") ?? "").trim() || "/brand/logo-icon.png",
    heroImage: String(form.get("heroImage") ?? "").trim() || "/gallery/campus-1.webp",
    aboutImage: String(form.get("aboutImage") ?? "").trim() || "/gallery/campus-2.webp",
    admissionsImage:
      String(form.get("admissionsImage") ?? "").trim() ||
      "/gallery/admissions-banner.webp",
    aboutText: String(form.get("aboutText") ?? "").trim(),
  });

  return NextResponse.redirect(
    new URL("/portal/cms/cai-dat?saved=1", request.url),
    303,
  );
}
