import Link from "next/link";
import {
  audienceLinks,
  news,
  programs,
  school,
  whyChooseUs,
} from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="botanical-bg relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
          <div>
            <p className="reveal text-sm font-medium uppercase tracking-[0.18em] text-white/70">
              {school.shortName}
            </p>
            <h1 className="reveal reveal-delay-1 font-display mt-3 max-w-2xl text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-6xl">
              {school.name}
            </h1>
            <p className="reveal reveal-delay-2 mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              {school.tagline}. Đăng ký xét tuyển online, theo dõi lịch học và
              tra cứu văn bằng trên một cổng số hóa.
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
                className="rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Khám phá ngành học
              </Link>
            </div>
          </div>

          <div className="reveal reveal-delay-2 float-soft relative min-h-[220px] overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm sm:min-h-[280px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                Hành trình học tập
              </p>
              <p className="font-display mt-3 text-3xl font-semibold leading-snug">
                Từ lớp học đến thực hành lâm sàng
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/85">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  Chương trình YHCT, Điều dưỡng, Châm cứu, Đông dược
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  Cổng học sinh: lịch học · điểm · hồ sơ
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  Tra cứu văn bằng – chứng chỉ công khai
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
                Bạn đang tìm gì?
              </h2>
              <p className="mt-1 text-muted">
                Lối vào nhanh theo đối tượng — như cổng trường hiện đại.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audienceLinks.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                style={{ animationDelay: `${i * 0.08}s` }}
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
              className="rounded-xl border border-line bg-surface p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {p.level}
              </p>
              <h3 className="font-display mt-2 text-xl font-semibold text-ink">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{p.summary}</p>
              <p className="mt-4 text-xs text-muted">Thời lượng: {p.duration}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-soft/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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
              className="rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand-deep">
                  {item.category}
                </span>
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString("vi-VN")}
                </time>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
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
