import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatSessionTime, sessionState } from "@/lib/classroom";
import { getClass, listSessions } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  const { classId } = await params;
  const onlineClass = await getClass(classId);
  if (!onlineClass) notFound();
  if (
    user.role === "student" &&
    !onlineClass.studentIds.includes(user.id)
  ) {
    redirect("/portal/lop-hoc");
  }

  const sessions = await listSessions(classId);

  return (
    <div>
      <Link
        href={user.role === "teacher" ? "/portal/giang-day" : "/portal/lop-hoc"}
        className="text-sm font-medium text-brand"
      >
        ← Quay lại
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-accent">
        {onlineClass.code}
      </p>
      <h1 className="font-display mt-1 text-2xl font-semibold text-brand-deep">
        {onlineClass.name}
      </h1>
      <p className="mt-2 text-sm text-muted">{onlineClass.description}</p>
      <p className="mt-1 text-sm text-muted">GV: {onlineClass.teacherName}</p>

      <h2 className="mt-8 text-lg font-semibold text-ink">Buổi học</h2>
      <ul className="mt-4 space-y-3">
        {sessions.map((s) => {
          const state = sessionState(s);
          const badge =
            state === "live"
              ? "bg-accent text-white"
              : state === "ended"
                ? "bg-line text-muted"
                : "bg-brand-soft text-brand-deep";
          const label =
            state === "live"
              ? "Đang diễn ra"
              : state === "ended"
                ? "Đã kết thúc"
                : "Sắp học";
          return (
            <li
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}
                  >
                    {label}
                  </span>
                  <span className="text-sm text-muted">
                    {formatSessionTime(s.startsAt)} –{" "}
                    {new Date(s.endsAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-2 font-medium text-ink">{s.title}</p>
              </div>
              <Link
                href={`/portal/lop-hoc/${classId}/buoi/${s.id}`}
                className="shrink-0 rounded-md border border-brand/30 bg-surface px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-soft"
              >
                {state === "live" ? "Vào phòng học" : "Chi tiết buổi"}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
