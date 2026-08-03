import Image from "next/image";
import Link from "next/link";
import { news, programs, school } from "@/lib/data";

export const metadata = { title: "Tuyển sinh" };

export default function AdmissionsPage() {
  const notices = news.filter((n) => n.category === "Tuyển sinh");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative mb-10 h-48 overflow-hidden rounded-2xl sm:h-64">
        <Image
          src={school.admissionsImage}
          alt="Tuyển sinh Tuệ Tĩnh Hà Nội"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-brand-deep/45" />
        <div className="absolute inset-0 flex items-end p-6">
          <p className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Tuyển sinh năm học 2026–2027
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Admissions
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
            Thông tin tuyển sinh
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Năm học 2026–2027: xét tuyển các hệ ngắn hạn, trung cấp, liên thông.
            Đăng ký trực tuyến và theo dõi trạng hồ sơ trên cổng.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Đào tạo dài hạn",
                body: "YHCT, Điều dưỡng, VLTL–PHCN theo lộ trình trung cấp.",
              },
              {
                title: "Chứng chỉ ngắn hạn",
                body: "Châm cứu, xoa bóp bấm huyệt, bào chế đông dược.",
              },
              {
                title: "Hồ sơ xét tuyển",
                body: "CCCD, học bạ/bằng tốt nghiệp, ảnh thẻ theo thông báo.",
              },
              {
                title: "Hỗ trợ hướng nghiệp",
                body: "Tư vấn ngành phù hợp và cơ hội việc làm sau tốt nghiệp.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line bg-surface p-5"
              >
                <h2 className="font-semibold text-brand-deep">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-ink">Ngành đang tuyển</h2>
            <ul className="mt-4 space-y-2">
              {programs.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm"
                >
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="text-muted">{p.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-brand-deep p-6 text-white">
            <h2 className="font-display text-2xl font-semibold">
              Đăng ký xét tuyển online
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Điền form trong vài phút. Nhà trường sẽ liên hệ xác nhận hồ sơ.
            </p>
            <Link
              href="/tuyen-sinh/dang-ky"
              className="mt-5 inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
            >
              Bắt đầu đăng ký
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-semibold text-ink">Thông báo mới</h2>
            <ul className="mt-4 space-y-4">
              {(notices.length ? notices : news.slice(0, 2)).map((n) => (
                <li key={n.slug}>
                  <p className="text-xs text-muted">
                    {new Date(n.date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">{n.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
