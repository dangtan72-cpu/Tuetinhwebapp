import Link from "next/link";
import { ContactCtaPhones, ContactLines } from "@/components/contact-lines";
import { contactDepartments, contactHours } from "@/lib/info-content";
import { getSchoolSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Liên hệ" };

export default async function ContactPage() {
  const school = await getSchoolSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Contact
      </p>
      <h1 className="font-display mt-2 text-2xl font-semibold text-brand-deep sm:text-3xl">
        Liên hệ
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted sm:text-[15px]">
        TamvangHub - Cổng tuyển sinh của Trường trung cấp y dược Tuệ Tĩnh Hà
        Nội.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="space-y-8">
          <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Thông tin liên hệ
            </h2>
            <p
              className="mt-3 font-medium leading-none text-ink"
              style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.125rem)" }}
            >
              <span className="inline-block max-w-full whitespace-nowrap">
                {school.name}
              </span>
            </p>
            <div className="mt-4">
              <ContactLines
                address={school.address}
                email={school.email}
                tone="light"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 text-sm">
              <a
                href={school.facebook}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand hover:text-brand-deep"
              >
                Facebook →
              </a>
              <a
                href={school.youtube}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand hover:text-brand-deep"
              >
                YouTube →
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Giờ làm việc
            </h2>
            <ul className="mt-3 space-y-2">
              {contactHours.map((row) => (
                <li
                  key={row.day}
                  className="flex justify-between gap-4 border-b border-line/80 py-2 text-sm"
                >
                  <span className="text-muted">{row.day}</span>
                  <span className="font-medium text-ink">{row.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Bộ phận tiếp nhận
            </h2>
            <ul className="mt-3 space-y-3">
              {contactDepartments.map((dept) => (
                <li key={dept.name} className="border-t border-line pt-3 first:border-0 first:pt-0">
                  <p className="text-sm font-semibold text-brand-deep">
                    {dept.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{dept.role}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-brand-deep p-5 text-white sm:p-6">
            <h2 className="font-display text-lg font-semibold sm:text-xl">
              Tư vấn tuyển sinh
            </h2>
            <p className="mt-1.5 text-sm text-white/75">
              Gọi trực tiếp hoặc đăng ký online trên cổng.
            </p>
            <ContactCtaPhones className="mt-4" />
            <Link
              href="/tuyen-sinh"
              className="mt-3 inline-flex text-sm font-medium text-white/80 hover:text-white"
            >
              Xem thông tin tuyển sinh →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
