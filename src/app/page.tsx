import Image from "next/image";
import Link from "next/link";
import {
  audienceLinks,
  galleryHighlights,
  programs,
  whyChooseUs,
} from "@/lib/data";
import { getSchoolSettings, listPublishedNews } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const school = await getSchoolSettings();
  const news = await listPublishedNews().then((items) => items.slice(0, 3));

  return (
    <>
      {/* Hero — full-bleed, brand + 1 line + CTA */}
      <section className="relative isolate min-h-[min(88vh,820px)] overflow-hidden text-white">
        <Image
          src={school.heroImage}
          alt="Khuôn viên Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/90 via-brand-deep/70 to-brand-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/50 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[min(88vh,820px)] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:items-center lg:pb-0 lg:pt-8">
          <div className="max-w-2xl">
            <p className="reveal text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Admissions Portal
            </p>
            <h1 className="reveal reveal-delay-1 font-display mt-3 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {school.shortName}
            </h1>
            <p className="reveal reveal-delay-2 mt-4 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-base">
              {school.tagline}
            </p>
            <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/tuyen-sinh/dang-ky"
                className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Đăng ký xét tuyển
              </Link>
              <Link
                href="/nganh-dao-tao"
                className="inline-flex items-center rounded-md border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Xem ngành học
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick paths — compact, not card-heavy */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-deep">
                Bắt đầu tại đây
              </h2>
              <p className="mt-1 text-sm text-muted sm:text-[15px]">
                Lối vào nhanh theo nhu cầu của bạn.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {audienceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-surface px-5 py-5 transition hover:bg-brand-soft/50"
              >
                <p className="text-sm font-semibold text-brand-deep group-hover:text-brand">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-snug text-muted">
                  {item.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-accent">
                  Tiếp tục →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-[1.75rem]">
              Ngành đào tạo
            </h2>
            <p className="mt-1 text-sm text-muted sm:text-[15px]">
              Trung cấp và chứng chỉ ngắn hạn.
            </p>
          </div>
          <Link
            href="/nganh-dao-tao"
            className="shrink-0 text-sm font-semibold text-brand hover:text-brand-deep"
          >
            Tất cả ngành →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/nganh-dao-tao/${p.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-accent">
                Mã {p.code}
              </p>
              <h3 className="font-display mt-1 text-lg font-semibold text-ink group-hover:text-brand-deep">
                {p.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus */}
      <section className="bg-brand-deep text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-[1.75rem]">
              Không gian học tập
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-white/75">
              Thực hành tại lab, cơ sở dưỡng sinh và vườn thuốc nam — gắn đào tạo
              với thực tiễn nghề nghiệp.
            </p>
            <Link
              href="/gioi-thieu"
              className="mt-6 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              Tìm hiểu nhà trường →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {galleryHighlights.slice(0, 4).map((item) => (
              <div
                key={item.src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-[1.75rem]">
          Vì sao chọn Tuệ Tĩnh?
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => (
            <div key={item.title} className="border-t border-line pt-4">
              <p className="text-xs font-semibold text-accent">
                0{i + 1}
              </p>
              <h3 className="mt-2 text-base font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-[1.75rem]">
                Tin tức & thông báo
              </h2>
              <p className="mt-1 text-sm text-muted">Cập nhật mới nhất.</p>
            </div>
            <Link
              href="/tin-tuc"
              className="text-sm font-semibold text-brand hover:text-brand-deep"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {news.map((item) => (
              <Link key={item.slug} href={`/tin-tuc/${item.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-xs text-muted">
                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </time>
                  <span className="mx-1.5">·</span>
                  {item.category}
                </p>
                <h3 className="mt-1 text-base font-semibold text-ink group-hover:text-brand-deep">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-brand-deep sm:text-2xl">
              Sẵn sàng đăng ký?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Nộp hồ sơ online hoặc đăng nhập cổng học vụ.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tuyen-sinh/dang-ky"
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
            >
              Đăng ký xét tuyển
            </Link>
            <Link
              href="/dang-nhap"
              className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-brand-deep hover:bg-brand-soft"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
