import Link from "next/link";
import { careerTracks } from "@/lib/info-content";

export const metadata = { title: "Hướng nghiệp – Tuyển dụng" };

export default function CareerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Career
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Hướng nghiệp – Tuyển dụng
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted sm:text-base">
        Định hướng nghề nghiệp sau đào tạo tại Tuệ Tĩnh: YHCT, điều dưỡng, trị
        liệu không dùng thuốc và bào chế đông dược. Bấm từng hướng để xem mã
        ngành liên quan.
      </p>

      <section className="mt-10 space-y-4">
        {careerTracks.map((item) => (
          <article key={item.title} className="border-t border-line pt-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-display text-xl font-semibold text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-[15px] text-muted sm:text-base">
                  {item.body}
                </p>
              </div>
              <Link
                href={item.href}
                className="shrink-0 text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Xem mã ngành →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          Cơ hội việc làm & hợp tác
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Nhà trường đồng hành tư vấn hướng nghiệp, kết nối cơ sở y tế / dưỡng
          sinh và thông báo tuyển dụng kỹ thuật viên trị liệu Đông y khi có đối
          tác.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-brand">•</span>
            Tư vấn chọn ngành theo năng lực và nguyện vọng
          </li>
          <li className="flex gap-2">
            <span className="text-brand">•</span>
            Giới thiệu việc làm sau tốt nghiệp (theo đợt)
          </li>
          <li className="flex gap-2">
            <span className="text-brand">•</span>
            Hỗ trợ lộ trình liên thông CĐ / ĐH
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tuyen-sinh"
            className="inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
          >
            Xem chương trình phù hợp
          </Link>
          <Link
            href="/lien-he"
            className="inline-flex rounded-md border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-paper"
          >
            Liên hệ tư vấn
          </Link>
        </div>
      </section>
    </div>
  );
}
