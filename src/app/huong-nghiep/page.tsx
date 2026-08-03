import Link from "next/link";

export const metadata = { title: "Hướng nghiệp – Tuyển dụng" };

const items = [
  {
    title: "Nghề Y sĩ YHCT",
    body: "Sứ mệnh chăm sóc sức khỏe cộng đồng trong thời đại mới.",
  },
  {
    title: "Xoa bóp bấm huyệt",
    body: "Nghề chữa lành bằng đôi tay và cơ hội phát triển phòng khám.",
  },
  {
    title: "Tuyển dụng kỹ thuật viên trị liệu Đông y",
    body: "Cơ hội việc làm tại Hà Nội dành cho học viên tốt nghiệp.",
  },
];

export default function CareerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Career
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Hướng nghiệp – Tuyển dụng
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Định hướng nghề nghiệp và cơ hội việc làm sau đào tạo tại Tuệ Tĩnh.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </article>
        ))}
      </div>
      <Link
        href="/tuyen-sinh"
        className="mt-10 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
      >
        Xem chương trình phù hợp
      </Link>
    </div>
  );
}
