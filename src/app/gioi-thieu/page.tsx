import Image from "next/image";
import Link from "next/link";
import { aboutMilestones, aboutSections } from "@/lib/info-content";
import { getSchoolSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Giới thiệu" };

export default async function AboutPage() {
  const school = await getSchoolSettings();
  const paragraphs = school.aboutText.split("\n").filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            About
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-brand-deep sm:text-3xl">
            Giới thiệu nhà trường
          </h1>
          <p className="mt-2 text-sm text-muted">{school.name}</p>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/90">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            <p>
              Cổng thông tin số hỗ trợ đăng ký xét tuyển online, cổng học vụ và
              lớp học trực tuyến cho học sinh, giảng viên.
            </p>
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-[420px]">
          <Image
            src={school.aboutImage}
            alt={`Hình ảnh ${school.shortName}`}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 45vw"
            priority
          />
        </div>
      </div>

      <dl className="mt-14 grid gap-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
        {aboutMilestones.map((item) => (
          <div key={item.label}>
            <dt className="font-display text-2xl font-semibold text-brand-deep">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm text-muted">{item.text}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Thông tin chi tiết
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Sứ mệnh, lịch sử, thế mạnh và hệ thống đào tạo của{" "}
          {school.shortName}.
        </p>
        <div className="mt-8 space-y-8">
          {aboutSections.map((section) => (
            <article key={section.title} className="border-t border-line pt-6">
              <h3 className="font-display text-xl font-semibold text-brand-deep">
                {section.title}
              </h3>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted sm:text-base">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/nganh-dao-tao"
          className="inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Xem ngành đào tạo
        </Link>
        <Link
          href="/tuyen-sinh"
          className="inline-flex rounded-md border border-brand/30 bg-brand-soft px-5 py-3 text-sm font-semibold text-brand-deep hover:bg-brand hover:text-white"
        >
          Thông tin tuyển sinh
        </Link>
        <Link
          href="/lien-he"
          className="inline-flex rounded-md border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-paper"
        >
          Liên hệ
        </Link>
      </section>
    </div>
  );
}
