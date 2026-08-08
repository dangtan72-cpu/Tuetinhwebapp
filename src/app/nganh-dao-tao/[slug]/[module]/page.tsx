import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProgramBySlug,
  getProgramModule,
  programs,
} from "@/lib/data";

export function generateStaticParams() {
  return programs.flatMap((p) =>
    p.modules.map((m) => ({ slug: p.slug, module: m.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; module: string }>;
}) {
  const { slug, module: moduleSlug } = await params;
  const found = getProgramModule(slug, moduleSlug);
  if (!found) return { title: "Mục đào tạo" };
  return {
    title: `${found.module.title} · ${found.program.name}`,
    description: found.module.summary,
  };
}

export default async function ProgramModulePage({
  params,
}: {
  params: Promise<{ slug: string; module: string }>;
}) {
  const { slug, module: moduleSlug } = await params;
  const found = getProgramModule(slug, moduleSlug);
  if (!found) notFound();

  const { program, module } = found;
  const related = module.relatedProgramSlug
    ? getProgramBySlug(module.relatedProgramSlug)
    : null;
  const siblings = program.modules.filter((m) => m.slug !== module.slug);
  const image = module.image || program.image;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/nganh-dao-tao" className="hover:text-brand">
          Ngành đào tạo
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/nganh-dao-tao/${program.slug}`}
          className="hover:text-brand"
        >
          {program.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{module.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Mục trong mã {program.code}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
            {module.title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">{module.summary}</p>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Nội dung mục này
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] text-muted sm:text-base">
              {module.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {related ? (
            <section className="mt-10 rounded-2xl border border-line bg-brand-soft/40 p-5">
              <h2 className="font-display text-lg font-semibold text-ink">
                Mã ngành liên quan
              </h2>
              <p className="mt-2 text-sm text-muted">
                {related.name} · Mã {related.code} · {related.duration}
              </p>
              <Link
                href={`/nganh-dao-tao/${related.slug}`}
                className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Xem mã ngành liên quan →
              </Link>
            </section>
          ) : null}

          {siblings.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold text-ink">
                Các mục khác trong ngành
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {siblings.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/nganh-dao-tao/${program.slug}/${m.slug}`}
                      className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand-deep transition hover:bg-brand hover:text-white"
                    >
                      {m.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt={module.title}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
              priority
            />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Thuộc {program.name}
            </p>
            <p className="mt-2 text-sm text-muted">
              Đăng ký toàn bộ mã ngành {program.code} để học mục này trong chương
              trình chính thức.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/tuyen-sinh/dang-ky?nganh=${program.slug}`}
                className="inline-flex justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                Đăng ký mã {program.code}
              </Link>
              <Link
                href={`/nganh-dao-tao/${program.slug}`}
                className="inline-flex justify-center rounded-md border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm font-medium text-brand-deep hover:bg-brand hover:text-white"
              >
                ← Về chi tiết ngành
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
