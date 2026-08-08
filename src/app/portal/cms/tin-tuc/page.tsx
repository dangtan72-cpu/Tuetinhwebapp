import Link from "next/link";
import { redirect } from "next/navigation";
import { listAllNews } from "@/lib/cms";
import { getSessionUser } from "@/lib/session";
import { isStaff } from "@/lib/auth";

export const metadata = { title: "CMS tin tức" };

export default async function CmsNewsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (!isStaff(user)) redirect("/portal");

  const articles = await listAllNews();

  return (
    <div>
      <Link href="/portal/cms" className="text-sm font-medium text-brand">
        ← CMS
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-deep">
            Quản lý tin tức
          </h1>
          <p className="mt-1 text-sm text-muted">{articles.length} bài viết</p>
        </div>
        <Link
          href="/portal/cms/tin-tuc/moi"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Thêm tin mới
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {articles.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand-deep">
                  {a.category}
                </span>
                <span>{a.date}</span>
                <span>{a.published ? "Đã xuất bản" : "Nháp"}</span>
              </div>
              <p className="mt-1 font-medium text-ink">{a.title}</p>
            </div>
            <Link
              href={`/portal/cms/tin-tuc/${a.id}`}
              className="rounded-md border border-brand/30 px-3 py-1.5 text-sm font-medium text-brand-deep hover:bg-brand-soft"
            >
              Sửa
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
