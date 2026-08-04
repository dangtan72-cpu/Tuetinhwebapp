import Image from "next/image";
import Link from "next/link";
import {
  audienceLinks,
  galleryHighlights,
  programs,
  whyChooseUs,
} from "@/lib/data";
import { getSchoolSettings, listPublishedNews } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const school = await getSchoolSettings();
  const news = await listPublishedNews();
  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden text-white">
        <Image
          src={school.heroImage}
          alt="Khuôn viên Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/92 via-brand-deep/72 to-brand-deep/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 sm:pb-20">
          <div className="reveal mb-5 inline-flex items-center gap-3">
            <Image
              src={school.logo}
              alt=""
              width={72}
              height={54}
              className="h-12 w-auto rounded bg-white/95 object-contain p-1 sm:h-14"
              priority
            />
          </div>
          <p className="reveal reveal-delay-1 font-display text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {school.shortName}
          </p>
          <h1 className="reveal reveal-delay-2 mt-3 max-w-2xl text-lg font-medium text-white/90 sm:text-2xl">
            {school.name}
          </h1>
          <p className="reveal reveal-delay-2 mt-4 max-w-xl text-base text-white/80 sm:text-lg">
            {school.tagline}
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/tuyen-sinh/dang-ky"
              className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Đăng ký xét tuyển
            </Link>
            <Link
              href="/nganh-dao-tao"
              className="rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Khám phá ngành học
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
            Bạn đang tìm gì?
          </h2>
          <p className="mt-1 text-muted">
            Lối vào nhanh theo đối tượng — như cổng trường hiện đại.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audienceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <p className="font-semibold text-brand-deep group-hover:text-brand">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-accent">
                  Vào ngay →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
              Ngành đào tạo nổi bật
            </h2>
            <p className="mt-1 text-muted">
              Chương trình dài hạn và chứng chỉ ngắn hạn.
            </p>
          </div>
          <Link
            href="/nganh-dao-tao"
            className="hidden text-sm font-medium text-brand sm:inline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.slice(0, 6).map((p) => (
            <article
              key={p.slug}
              className="overflow-hidden rounded-xl border border-line bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {p.level}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold text-ink">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-soft/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
            Hình ảnh nhà trường
          </h2>
          <p className="mt-1 text-muted">
            Không gian học tập và hoạt động thực tiễn của sinh viên.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryHighlights.map((item, i) => (
              <div
                key={item.src}
                className={`relative overflow-hidden rounded-xl ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2 min-h-[220px]" : "min-h-[160px]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 100vw, 40vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
          Vì sao chọn Tuệ Tĩnh?
        </h2>
        <p className="mt-1 max-w-2xl text-muted">
          Một hành trình học tập rõ ràng — từ nhập học đến hành nghề.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="rounded-xl bg-surface p-5 shadow-sm">
              <h3 className="font-semibold text-brand-deep">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
                Tin hoạt động
              </h2>
              <p className="mt-1 text-muted">Cập nhật từ nhà trường.</p>
            </div>
            <Link href="/tin-tuc" className="text-sm font-medium text-brand">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-xl border border-line bg-paper"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand-deep">
                      {item.category}
                    </span>
                    <time dateTime={item.date}>
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </time>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-deep">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="mt-1 text-muted">
              Đăng ký xét tuyển hoặc đăng nhập cổng học sinh ngay hôm nay.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tuyen-sinh/dang-ky"
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
            >
              Đăng ký xét tuyển
            </Link>
            <Link
              href="/dang-nhap"
              className="rounded-md border border-brand/30 px-5 py-3 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
            >
              Đăng nhập học sinh
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
