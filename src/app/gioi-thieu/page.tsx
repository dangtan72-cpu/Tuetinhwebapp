import Image from "next/image";
import { getSchoolSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Giới thiệu" };

export default async function AboutPage() {
  const school = await getSchoolSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            About
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
            Giới thiệu nhà trường
          </h1>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/90 sm:text-base">
            {school.aboutText.split("\n").filter(Boolean).map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            <p>
              Webapp này hỗ trợ đăng ký xét tuyển online, cổng học vụ và lớp học
              trực tuyến.
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
    </div>
  );
}
