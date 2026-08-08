import Image from "next/image";
import Link from "next/link";
import { listPublishedNews } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tin tức" };

export default async function NewsPage() {
  const news = await listPublishedNews();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        News
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Tin tức & hoạt động
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Thông báo tuyển sinh, hoạt động đào tạo và cộng đồng của nhà trường.
        Bấm vào từng tin để xem chi tiết.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {news.map((item) => (
          <article
            key={item.slug}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <Link
              href={`/tin-tuc/${item.slug}`}
              className="relative block aspect-[16/9]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover transition duration-300 hover:scale-[1.02]"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand-deep">
                  {item.category}
                </span>
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString("vi-VN")}
                </time>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ink">
                <Link
                  href={`/tin-tuc/${item.slug}`}
                  className="hover:text-brand-deep"
                >
                  {item.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              <Link
                href={`/tin-tuc/${item.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Đọc chi tiết →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
