import Link from "next/link";
import { contactDepartments, contactHours } from "@/lib/info-content";
import { getSchoolSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Liên hệ" };

export default async function ContactPage() {
  const school = await getSchoolSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Contact
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Liên hệ
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted sm:text-base">
        Phòng Tuyển sinh và Phòng Đào tạo tiếp nhận tư vấn mã ngành, hồ sơ xét
        tuyển và hỗ trợ học vụ.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">
              Thông tin liên hệ
            </h2>
            <dl className="mt-5 space-y-5">
              <div className="border-t border-line pt-4">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Đơn vị
                </dt>
                <dd className="mt-1 font-medium text-ink">{school.name}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Điện thoại
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${school.phone.replace(/\s+/g, "")}`}
                    className="font-medium text-brand hover:text-brand-deep"
                  >
                    {school.phone}
                  </a>
                </dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${school.email}`}
                    className="break-all font-medium text-brand hover:text-brand-deep"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Địa chỉ
                </dt>
                <dd className="mt-1 font-medium text-ink">{school.address}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  Mạng xã hội
                </dt>
                <dd className="mt-2 flex flex-wrap gap-3 text-sm">
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
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">
              Giờ làm việc
            </h2>
            <ul className="mt-4 space-y-3">
              {contactHours.map((row) => (
                <li
                  key={row.day}
                  className="flex justify-between gap-4 border-t border-line pt-3 text-sm"
                >
                  <span className="text-muted">{row.day}</span>
                  <span className="font-medium text-ink">{row.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              Bộ phận tiếp nhận
            </h2>
            <ul className="mt-5 space-y-4">
              {contactDepartments.map((dept) => (
                <li key={dept.name} className="border-t border-line pt-4">
                  <p className="font-medium text-brand-deep">{dept.name}</p>
                  <p className="mt-1 text-sm text-muted">{dept.role}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-brand-deep p-6 text-white">
            <h2 className="font-display text-xl font-semibold">
              Cần tư vấn tuyển sinh?
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Xem thông tin mã ngành hoặc gửi hồ sơ đăng ký online ngay trên
              cổng.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/tuyen-sinh"
                className="inline-flex justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                Thông tin tuyển sinh
              </Link>
              <Link
                href="/tuyen-sinh/dang-ky"
                className="inline-flex justify-center rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Đăng ký xét tuyển
              </Link>
              <a
                href={`mailto:${school.email}?subject=Tu%20van%20tuyen%20sinh`}
                className="inline-flex justify-center rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Gửi email tư vấn
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
