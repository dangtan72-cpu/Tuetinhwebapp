import Link from "next/link";
import { demoGrades, demoSchedule } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Cổng học sinh" };

export default async function PortalHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  const today = demoSchedule.slice(0, 3);
  const gpa =
    demoGrades.reduce((s, g) => s + g.total * g.credits, 0) /
    demoGrades.reduce((s, g) => s + g.credits, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
        Xin chào, {user.fullName.split(" ").slice(-1)[0]}
      </h1>
      <p className="mt-1 text-muted">
        {user.program} · {user.className} · Khóa {user.cohort}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-brand-soft/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Điểm TB</p>
          <p className="mt-1 text-3xl font-semibold text-brand-deep">
            {gpa.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Buổi học tuần này
          </p>
          <p className="mt-1 text-3xl font-semibold text-ink">
            {demoSchedule.length}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Học phần</p>
          <p className="mt-1 text-3xl font-semibold text-ink">
            {demoGrades.length}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Lịch học sắp tới</h2>
          <Link href="/portal/lich-hoc" className="text-sm font-medium text-brand">
            Xem lịch đầy đủ
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {today.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">{item.subject}</p>
                <p className="text-sm text-muted">
                  {item.day} · {item.time} · {item.room}
                </p>
              </div>
              <p className="text-sm text-muted">{item.teacher}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/portal/diem"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
        >
          Xem kết quả học tập
        </Link>
        <Link
          href="/van-bang"
          className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper"
        >
          Tra cứu văn bằng
        </Link>
      </div>
    </div>
  );
}
