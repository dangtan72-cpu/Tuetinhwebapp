import { NextResponse } from "next/server";
import { createNews, deleteNews, updateNews } from "@/lib/cms";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Chỉ giảng viên/admin" }, { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  if (action === "create") {
    await createNews({
      title: String(form.get("title") ?? "").trim(),
      category: String(form.get("category") ?? "").trim() || "Tin tức",
      excerpt: String(form.get("excerpt") ?? "").trim(),
      body: String(form.get("body") ?? "").trim(),
      imageUrl:
        String(form.get("imageUrl") ?? "").trim() || "/gallery/news-1.webp",
      published: form.getAll("published").includes("true"),
      publishedAt: String(form.get("publishedAt") ?? "") || undefined,
    });
    return NextResponse.redirect(new URL("/portal/cms/tin-tuc", request.url), 303);
  }

  if (action === "update") {
    const id = String(form.get("id") ?? "");
    await updateNews(id, {
      title: String(form.get("title") ?? "").trim(),
      category: String(form.get("category") ?? "").trim() || "Tin tức",
      excerpt: String(form.get("excerpt") ?? "").trim(),
      body: String(form.get("body") ?? "").trim(),
      imageUrl:
        String(form.get("imageUrl") ?? "").trim() || "/gallery/news-1.webp",
      published: form.getAll("published").includes("true"),
      publishedAt: String(form.get("publishedAt") ?? "") || undefined,
    });
    return NextResponse.redirect(
      new URL(`/portal/cms/tin-tuc/${id}?saved=1`, request.url),
      303,
    );
  }

  if (action === "delete") {
    const id = String(form.get("id") ?? "");
    await deleteNews(id);
    return NextResponse.redirect(new URL("/portal/cms/tin-tuc", request.url), 303);
  }

  return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 });
}
