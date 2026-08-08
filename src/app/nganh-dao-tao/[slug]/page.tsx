import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramBySlug, programs } from "@/lib/data";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: "Ngành đào tạo" };
  return {
    title: `${program.name} · Mã ${program.code}`,
    description: program.summary,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/nganh-dao-tao" className="hover:text-brand">
          Ngành đào tạo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{program.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Mã ngành {program.code}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
            {program.name}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">{program.summary}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-wide text-muted">
                Trình độ
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">
                {program.level}
              </dd>
            </div>
            <div className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-wide text-muted">
                Thời gian
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">
                {program.duration}
              </dd>
            </div>
            <div className="border-t border-line pt-3">
              <dt className="text-xs uppercase tracking-wide text-muted">
                Học phí
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">
                {program.tuition || "Theo thông báo tuyển sinh"}
              </dd>
            </div>
          </dl>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Đối tượng tuyển sinh
            </h2>
            <p className="mt-2 text-[15px] text-muted sm:text-base">
              {program.audience}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Mục tiêu đào tạo
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-muted sm:text-base">
              {program.objectives.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Nội dung chính
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] text-muted sm:text-base">
              {program.curriculum.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Cơ hội sau tốt nghiệp
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-muted sm:text-base">
              {program.careers.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Hồ sơ cần chuẩn bị
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-muted sm:text-base">
              {program.documents.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={program.image}
              alt={program.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
              priority
            />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Đăng ký mã {program.code}
            </p>
            <p className="mt-2 text-sm text-muted">
              Nộp hồ sơ online, thanh toán lệ phí và tra cứu tiến độ xét tuyển.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/tuyen-sinh/dang-ky?nganh=${program.slug}`}
                className="inline-flex justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                Đăng ký ngành này
              </Link>
              <Link
                href="/nganh-dao-tao"
                className="inline-flex justify-center rounded-md border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm font-medium text-brand-deep hover:bg-brand hover:text-white"
              >
                ← Tất cả mã ngành
              </Link>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {program.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-brand-deep"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
