import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Thêm tin tức" };

export default async function CmsNewsCreatePage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal");

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <Link href="/portal/cms/tin-tuc" className="text-sm font-medium text-brand">
        ← Tin tức
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Thêm tin mới
      </h1>

      <form
        action="/api/cms/news"
        method="POST"
        className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5"
      >
        <input type="hidden" name="action" value="create" />
        <label className="block text-sm">
          Tiêu đề
          <input
            name="title"
            required
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            Chuyên mục
            <input
              name="category"
              defaultValue="Hoạt động"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Ngày đăng
            <input
              type="date"
              name="publishedAt"
              defaultValue={today}
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          Tóm tắt
          <textarea
            name="excerpt"
            required
            rows={3}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          Nội dung
          <textarea
            name="body"
            rows={6}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          Ảnh (path /public hoặc URL)
          <input
            name="imageUrl"
            defaultValue="/gallery/news-1.webp"
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" value="true" defaultChecked />
          Xuất bản ngay
        </label>
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Tạo bài viết
        </button>
      </form>
    </div>
  );
}
