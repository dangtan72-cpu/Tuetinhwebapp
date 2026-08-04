import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "CMS nội dung" };

export default async function CmsHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal");

  const cards = [
    {
      href: "/portal/cms/cai-dat",
      title: "Cài đặt trường",
      body: "Tên, tagline, liên hệ, đường dẫn logo & ảnh hero.",
    },
    {
      href: "/portal/cms/tin-tuc",
      title: "Quản lý tin tức",
      body: "Thêm / sửa / ẩn bài viết hiển thị trên trang chủ.",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        CMS nội dung
      </h1>
      <p className="mt-1 text-muted">
        Chỉnh sửa nội dung marketing lưu trên PostgreSQL.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-line bg-paper p-5 transition hover:border-brand/40"
          >
            <h2 className="font-semibold text-brand-deep">{c.title}</h2>
            <p className="mt-2 text-sm text-muted">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
