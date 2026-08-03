import Image from "next/image";
import Link from "next/link";
import { programs } from "@/lib/data";

export const metadata = { title: "Ngành đào tạo" };

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Courses
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Ngành đào tạo
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Khám phá các chương trình dài hạn và chứng chỉ ngắn hạn tại Trường
        Trung cấp Y Dược Tuệ Tĩnh Hà Nội.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {programs.map((p) => (
          <article
            key={p.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {p.level} · {p.duration}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
                {p.name}
              </h2>
              <p className="mt-3 flex-1 text-sm text-muted">{p.summary}</p>
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
              <Link
                href="/tuyen-sinh/dang-ky"
                className="mt-6 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Đăng ký ngành này →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
