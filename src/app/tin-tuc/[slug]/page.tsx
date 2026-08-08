import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, listPublishedNews } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) return { title: "Tin tức" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) notFound();

  const others = (await listPublishedNews())
    .filter((n) => n.slug !== article.slug)
    .slice(0, 3);
  const paragraphs = (article.body || article.excerpt)
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/tin-tuc" className="hover:text-brand">
          Tin tức
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{article.category}</span>
      </nav>

      <article className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand-deep">
              {article.category}
            </span>
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("vi-VN")}
            </time>
          </div>
          <h1 className="font-display mt-4 text-3xl font-semibold text-brand-deep sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-[15px] text-muted sm:text-base">
            {article.excerpt}
          </p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 60vw"
              priority
            />
          </div>

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/90 sm:text-base">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>

          {article.category === "Tuyển sinh" ? (
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/tuyen-sinh"
                className="inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
              >
                Xem thông tin tuyển sinh
              </Link>
              <Link
                href="/tuyen-sinh/dang-ky"
                className="inline-flex rounded-md border border-brand/30 bg-brand-soft px-5 py-3 text-sm font-semibold text-brand-deep hover:bg-brand hover:text-white"
              >
                Đăng ký online
              </Link>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-semibold text-ink">Tin khác</h2>
            <ul className="mt-4 space-y-4">
              {others.map((n) => (
                <li key={n.slug} className="border-t border-line pt-4">
                  <p className="text-xs text-muted">
                    {new Date(n.date).toLocaleDateString("vi-VN")}
                  </p>
                  <Link
                    href={`/tin-tuc/${n.slug}`}
                    className="mt-1 block text-sm font-medium text-ink hover:text-brand"
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tin-tuc"
              className="mt-5 inline-flex text-sm font-medium text-brand"
            >
              ← Tất cả tin tức
            </Link>
          </div>
        </aside>
      </article>
    </div>
  );
}
