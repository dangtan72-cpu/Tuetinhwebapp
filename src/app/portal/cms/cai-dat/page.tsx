import Link from "next/link";
import { redirect } from "next/navigation";
import { getSchoolSettings } from "@/lib/cms";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Cài đặt trường" };

export default async function CmsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal");

  const school = await getSchoolSettings();
  const params = await searchParams;

  return (
    <div>
      <Link href="/portal/cms" className="text-sm font-medium text-brand">
        ← CMS
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Cài đặt trường
      </h1>
      <p className="mt-1 text-sm text-muted">
        Đường dẫn ảnh: dùng file trong <code>/public</code> (VD:{" "}
        <code>/brand/logo.webp</code>) hoặc URL tuyệt đối.
      </p>
      {params.saved ? (
        <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          Đã lưu cài đặt.
        </p>
      ) : null}

      <form
        action="/api/cms/settings"
        method="POST"
        className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["name", "Tên đầy đủ", school.name],
              ["shortName", "Tên ngắn", school.shortName],
              ["tagline", "Tagline", school.tagline],
              ["phone", "Điện thoại", school.phone],
              ["email", "Email", school.email],
              ["address", "Địa chỉ", school.address],
              ["facebook", "Facebook", school.facebook],
              ["youtube", "YouTube", school.youtube],
              ["logo", "Logo URL", school.logo],
              ["logoIcon", "Logo icon URL", school.logoIcon],
              ["heroImage", "Ảnh hero", school.heroImage],
              ["aboutImage", "Ảnh giới thiệu", school.aboutImage],
              ["admissionsImage", "Ảnh tuyển sinh", school.admissionsImage],
            ] as const
          ).map(([name, label, value]) => (
            <label key={name} className="block text-sm">
              <span className="font-medium text-ink">{label}</span>
              <input
                name={name}
                defaultValue={value}
                required={name === "name" || name === "shortName"}
                className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
              />
            </label>
          ))}
        </div>
        <label className="block text-sm">
          <span className="font-medium text-ink">Giới thiệu (đoạn văn)</span>
          <textarea
            name="aboutText"
            rows={5}
            defaultValue={school.aboutText}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Lưu cài đặt
        </button>
      </form>
    </div>
  );
}
