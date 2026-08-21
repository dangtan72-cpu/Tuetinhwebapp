import Image from "next/image";
import Link from "next/link";
import { ContactLines } from "@/components/contact-lines";
import { programs } from "@/lib/data";
import {
  admissionsBenefits,
  admissionsDocuments,
  admissionsExtras,
  admissionsProcess,
  admissionsTracks,
  shortTermFees,
} from "@/lib/info-content";
import { getSchoolSettings, listPublishedNews } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tuyển sinh" };

export default async function AdmissionsPage() {
  const school = await getSchoolSettings();
  const news = await listPublishedNews();
  const notices = news.filter((n) => n.category === "Tuyển sinh");
  const longTerm = programs.filter((p) => p.category === "trung-cap");
  const shortTerm = programs.filter((p) => p.category === "ngan-han");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative mb-8 h-40 overflow-hidden rounded-xl sm:h-52">
        <Image
          src={school.admissionsImage}
          alt={`Tuyển sinh ${school.shortName}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-brand-deep/45" />
        <div className="absolute inset-0 flex items-end p-5 sm:p-6">
          <p className="font-display text-xl font-semibold text-white sm:text-2xl">
            Tuyển sinh năm học 2026–2027
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            Admissions
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-brand-deep sm:text-3xl">
            Thông tin tuyển sinh
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-[15px]">
            Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội – TamvangHub tuyển sinh hệ
            trung cấp và các mã ngành ngắn hạn. Đăng ký, thanh toán và tra cứu
            hồ sơ trên cổng.
          </p>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">
              Quy trình xét tuyển online
            </h2>
            <ol className="mt-5 space-y-4">
              {admissionsProcess.map((item) => (
                <li
                  key={item.step}
                  className="flex gap-4 border-t border-line pt-4"
                >
                  <span className="font-display text-lg font-semibold text-accent">
                    {item.step}
                  </span>
                  <span>
                    <span className="block font-medium text-ink">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Hệ đào tạo đang tuyển
            </h2>
            <ul className="mt-5 space-y-4">
              {admissionsTracks.map((track) => (
                <li key={track.title} className="border-t border-line pt-4">
                  <h3 className="font-semibold text-brand-deep">
                    {track.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{track.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Trung cấp – mã ngành
            </h2>
            <ul className="mt-4 space-y-2">
              {longTerm.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/nganh-dao-tao/${p.slug}`}
                    className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm transition hover:bg-brand-soft/30"
                  >
                    <span>
                      <span className="font-medium text-ink">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Mã {p.code} · {p.duration} · {p.audience}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-brand">
                      Chi tiết →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Học phí mã ngành ngắn hạn
            </h2>
            <p className="mt-2 text-sm text-muted">
              Áp dụng theo thông báo tuyển sinh ngắn hạn 2026–2027 của nhà
              trường. Bấm tên ngành để xem chi tiết.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th className="py-2 pr-3 font-medium">Ngành</th>
                    <th className="py-2 pr-3 font-medium">Thời gian</th>
                    <th className="py-2 font-medium">Học phí</th>
                  </tr>
                </thead>
                <tbody>
                  {shortTermFees.map((row) => (
                    <tr key={row.slug} className="border-b border-line/80">
                      <td className="py-3 pr-3">
                        <Link
                          href={`/nganh-dao-tao/${row.slug}`}
                          className="font-medium text-ink hover:text-brand"
                        >
                          {row.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-muted">{row.duration}</td>
                      <td className="py-3 font-medium text-brand-deep">
                        {row.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Hồ sơ cần chuẩn bị
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] text-muted sm:text-base">
              {admissionsDocuments.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {admissionsExtras.map((item) => (
                <div key={item.label} className="border-t border-line pt-3">
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-ink">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Quyền lợi sau tốt nghiệp
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] text-muted sm:text-base">
              {admissionsBenefits.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-ink">
                Tất cả mã ngành ngắn hạn
              </h2>
              <Link
                href="/nganh-dao-tao"
                className="text-sm font-medium text-brand"
              >
                Xem đầy đủ
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {shortTerm.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/nganh-dao-tao/${p.slug}`}
                    className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm transition hover:bg-brand-soft/30"
                  >
                    <span>
                      <span className="font-medium text-ink">{p.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Mã {p.code}
                        {p.tuition ? ` · ${p.tuition}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-muted">{p.duration} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-brand-deep p-6 text-white">
            <h2 className="font-display text-2xl font-semibold">
              Đăng ký xét tuyển online
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Đăng ký → thanh toán lệ phí → tra cứu hồ sơ → nhận MSSV qua email.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/tuyen-sinh/dang-ky"
                className="inline-flex justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                Bắt đầu đăng ký
              </Link>
              <Link
                href="/tuyen-sinh/tra-cuu"
                className="inline-flex justify-center rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Tra cứu hồ sơ
              </Link>
              <Link
                href="/tuyen-sinh/thanh-toan"
                className="inline-flex justify-center rounded-md border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Thanh toán lệ phí
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink">Hỗ trợ tư vấn</h2>
            <p className="mt-1.5 text-sm text-muted">
              TamvangHub — Mr. Việt / Mr. Kiên tư vấn mã ngành và hồ sơ.
            </p>
            <div className="mt-3">
              <ContactLines
                address={school.address}
                email={school.email}
                tone="light"
              />
            </div>
            <Link
              href="/lien-he"
              className="mt-3 inline-flex text-sm font-medium text-brand"
            >
              Trang liên hệ →
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-semibold text-ink">Thông báo mới</h2>
            <ul className="mt-4 space-y-4">
              {(notices.length ? notices : news.slice(0, 3)).map((n) => (
                <li key={n.slug}>
                  <p className="text-xs text-muted">
                    {new Date(n.date).toLocaleDateString("vi-VN")}
                  </p>
                  <Link
                    href={`/tin-tuc/${n.slug}`}
                    className="mt-1 block text-sm font-medium text-ink hover:text-brand"
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
