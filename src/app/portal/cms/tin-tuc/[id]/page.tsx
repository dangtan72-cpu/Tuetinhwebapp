import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getNewsById } from "@/lib/cms";
import { getSessionUser } from "@/lib/session";
import { isStaff } from "@/lib/auth";

export default async function CmsNewsEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (!isStaff(user)) redirect("/portal");

  const { id } = await params;
  const article = await getNewsById(id);
  if (!article) notFound();
  const sp = await searchParams;

  return (
    <div>
      <Link href="/portal/cms/tin-tuc" className="text-sm font-medium text-brand">
        ← Tin tức
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Sửa tin tức
      </h1>
      {sp.saved ? (
        <p className="mt-3 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          Đã lưu bài viết.
        </p>
      ) : null}

      <form
        action="/api/cms/news"
        method="POST"
        className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5"
      >
        <input type="hidden" name="action" value="update" />
        <input type="hidden" name="id" value={article.id} />
        <label className="block text-sm">
          Tiêu đề
          <input
            name="title"
            required
            defaultValue={article.title}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            Chuyên mục
            <input
              name="category"
              defaultValue={article.category}
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Ngày đăng
            <input
              type="date"
              name="publishedAt"
              defaultValue={article.date}
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
            defaultValue={article.excerpt}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          Nội dung
          <textarea
            name="body"
            rows={6}
            defaultValue={article.body}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          Ảnh
          <input
            name="imageUrl"
            defaultValue={article.image}
            className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={article.published}
          />
          Xuất bản
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
          >
            Lưu
          </button>
        </div>
      </form>

      <form action="/api/cms/news" method="POST" className="mt-4">
        <input type="hidden" name="action" value="delete" />
        <input type="hidden" name="id" value={article.id} />
        <button
          type="submit"
          className="rounded-md border border-accent/40 px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
        >
          Xóa bài viết
        </button>
      </form>
    </div>
  );
}
