import Link from "next/link";
import { redirect } from "next/navigation";
import { formatSessionTime, sessionState } from "@/lib/classroom";
import {
  listClassesForStudent,
  listClassesForTeacher,
  listSessions,
} from "@/lib/classroom-store";
import { demoGrades, demoSchedule } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Cổng học vụ" };

export default async function PortalHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  if (user.role === "teacher") {
    const classes = await listClassesForTeacher(user.id);
    const sessionCounts = await Promise.all(
      classes.map(async (c) => (await listSessions(c.id)).length),
    );
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
          Xin chào, {user.fullName}
        </h1>
        <p className="mt-1 text-muted">Cổng giảng viên · Dữ liệu PostgreSQL</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-brand-soft/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">
              Lớp đang dạy
            </p>
            <p className="mt-1 text-3xl font-semibold text-brand-deep">
              {classes.length}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wide text-muted">
              Tổng buổi học
            </p>
            <p className="mt-1 text-3xl font-semibold text-ink">
              {sessionCounts.reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/portal/giang-day"
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
          >
            Quản lý lớp giảng dạy
          </Link>
          <Link
            href="/portal/cms"
            className="rounded-md border border-brand/30 px-4 py-2.5 text-sm font-medium text-brand-deep hover:bg-brand-soft"
          >
            CMS nội dung
          </Link>
        </div>
      </div>
    );
  }

  const classes = await listClassesForStudent(user.id);
  const liveSessions = (
    await Promise.all(
      classes.map(async (c) => {
        const sessions = await listSessions(c.id);
        return sessions
          .filter((s) => sessionState(s) === "live")
          .map((s) => ({ class: c, session: s }));
      }),
    )
  ).flat();

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

      {liveSessions.length > 0 ? (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent-soft p-5">
          <p className="text-sm font-semibold text-accent">
            Có buổi học online đang diễn ra
          </p>
          {liveSessions.map(({ class: c, session: s }) => (
            <div
              key={s.id}
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-sm text-muted">
                  {c.name} · {formatSessionTime(s.startsAt)}
                </p>
              </div>
              <Link
                href={`/portal/lop-hoc/${c.id}/buoi/${s.id}`}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                Vào phòng học
              </Link>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-brand-soft/50 p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Điểm TB</p>
          <p className="mt-1 text-3xl font-semibold text-brand-deep">
            {gpa.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Lớp online
          </p>
          <p className="mt-1 text-3xl font-semibold text-ink">{classes.length}</p>
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
            <li
              key={item.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
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
          href="/portal/lop-hoc"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
        >
          Lớp học online
        </Link>
        <Link
          href="/portal/diem"
          className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper"
        >
          Kết quả học tập
        </Link>
      </div>
    </div>
  );
}
