import Image from "next/image";
import Link from "next/link";
import { programs } from "@/lib/data";

export const metadata = { title: "Ngành đào tạo" };

export default function ProgramsPage() {
  const longTerm = programs.filter((p) => p.category === "trung-cap");
  const shortTerm = programs.filter((p) => p.category === "ngan-han");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Courses
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Ngành đào tạo
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Chọn mã ngành để xem chi tiết đối tượng, thời gian, học phí và hồ sơ
        đăng ký. Chương trình trung cấp và chứng chỉ ngắn hạn tại Trường Trung
        cấp Y Dược Tuệ Tĩnh Hà Nội.
      </p>

      <ProgramGroup title="Trung cấp (hệ chính quy)" items={longTerm} />
      <ProgramGroup title="Mã ngành ngắn hạn / sơ cấp" items={shortTerm} />
    </div>
  );
}

function ProgramGroup({
  title,
  items,
}: {
  title: string;
  items: typeof programs;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
        {title}
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map((p) => (
          <article
            key={p.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <Link
              href={`/nganh-dao-tao/${p.slug}`}
              className="relative aspect-[16/9] block"
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition duration-300 hover:scale-[1.02]"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </Link>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Mã {p.code} · {p.level} · {p.duration}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-ink">
                <Link
                  href={`/nganh-dao-tao/${p.slug}`}
                  className="hover:text-brand-deep"
                >
                  {p.name}
                </Link>
              </h3>
              <p className="mt-3 flex-1 text-sm text-muted">{p.summary}</p>
              {p.tuition ? (
                <p className="mt-3 text-sm font-medium text-ink">
                  Học phí: {p.tuition}
                </p>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-deep"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href={`/nganh-dao-tao/${p.slug}`}
                  className="inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
                >
                  Xem chi tiết mã ngành →
                </Link>
                <Link
                  href={`/tuyen-sinh/dang-ky?nganh=${p.slug}`}
                  className="inline-flex text-sm font-medium text-muted hover:text-brand"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
