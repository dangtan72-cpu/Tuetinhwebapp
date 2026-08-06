import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatSessionTime, sessionState } from "@/lib/classroom";
import { getClass, listSessions } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal/lop-hoc");

  const { classId } = await params;
  const onlineClass = await getClass(classId);
  if (!onlineClass || onlineClass.teacherId !== user.id) notFound();

  const sessions = await listSessions(classId);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  return (
    <div>
      <Link href="/portal/giang-day" className="text-sm font-medium text-brand">
        ← Danh sách lớp
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        {onlineClass.name}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {onlineClass.code} · {onlineClass.program}
      </p>

      <div className="mt-4">
        <Link
          href={`/portal/giang-day/${classId}/bai-tap`}
          className="rounded-md border border-brand/30 bg-surface px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-soft"
        >
          Quản lý bài tập
        </Link>
      </div>

      <form
        action="/api/classroom/manage"
        method="POST"
        className="mt-8 space-y-3 rounded-xl border border-line bg-paper p-5"
      >
        <input type="hidden" name="action" value="create-session" />
        <input type="hidden" name="classId" value={classId} />
        <p className="text-sm font-semibold text-ink">Tạo buổi học mới</p>
        <input
          name="title"
          required
          placeholder="Tiêu đề buổi học"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            Ngày
            <input
              type="date"
              name="date"
              required
              defaultValue={defaultDate}
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="text-sm">
            Bắt đầu
            <input
              type="time"
              name="startTime"
              defaultValue="08:00"
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="text-sm">
            Kết thúc
            <input
              type="time"
              name="endTime"
              defaultValue="09:30"
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          Lên lịch buổi học
        </button>
      </form>

      <h2 className="mt-8 text-lg font-semibold text-ink">Các buổi học</h2>
      <ul className="mt-4 space-y-3">
        {sessions.map((s) => {
          const state = sessionState(s);
          return (
            <li
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-sm text-muted">
                  {formatSessionTime(s.startsAt)} ·{" "}
                  {state === "live"
                    ? "Đang diễn ra"
                    : state === "ended"
                      ? "Đã kết thúc"
                      : "Sắp học"}
                </p>
              </div>
              <Link
                href={`/portal/lop-hoc/${classId}/buoi/${s.id}`}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep"
              >
                Mở phòng / xem điểm danh
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
