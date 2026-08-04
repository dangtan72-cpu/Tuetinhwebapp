import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AttendanceButton } from "@/components/attendance-button";
import { ClassroomWhiteboard } from "@/components/classroom-whiteboard";
import { LiveClassroom } from "@/components/live-classroom";
import { formatSessionTime, sessionState } from "@/lib/classroom";
import {
  getClass,
  getSession,
  hasCheckedIn,
  listAttendance,
} from "@/lib/classroom-store";
import { isLiveKitConfigured } from "@/lib/livekit";
import { getSessionUser } from "@/lib/session";

export default async function SessionRoomPage({
  params,
}: {
  params: Promise<{ classId: string; sessionId: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  const { classId, sessionId } = await params;
  const onlineClass = await getClass(classId);
  const session = await getSession(sessionId);
  if (!onlineClass || !session || session.classId !== classId) notFound();

  if (
    user.role === "student" &&
    !onlineClass.studentIds.includes(user.id)
  ) {
    redirect("/portal/lop-hoc");
  }

  if (
    user.role === "teacher" &&
    onlineClass.teacherId !== user.id
  ) {
    redirect("/portal/giang-day");
  }

  const state = sessionState(session);
  const checked = await hasCheckedIn(sessionId, user.id);
  const attendance = await listAttendance(sessionId);
  const livekitEnabled = isLiveKitConfigured();

  return (
    <div>
      <Link
        href={
          user.role === "teacher"
            ? `/portal/giang-day/${classId}`
            : `/portal/lop-hoc/${classId}`
        }
        className="text-sm font-medium text-brand"
      >
        ← Về lớp
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {onlineClass.code}
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold text-brand-deep">
            {session.title}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {formatSessionTime(session.startsAt)} · Phòng{" "}
            <code className="text-brand-deep">{session.roomSlug}</code>
          </p>
          {session.note ? (
            <p className="mt-2 text-sm text-ink/80">{session.note}</p>
          ) : null}
        </div>
        <AttendanceButton sessionId={sessionId} alreadyChecked={checked} />
      </div>

      <div className="mt-6">
        {state === "ended" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-paper p-5 text-sm text-muted">
              Buổi học đã kết thúc. Bạn vẫn có thể xem lại bảng trắng và tài liệu.
            </div>
            <ClassroomWhiteboard
              sessionId={sessionId}
              userId={user.id}
              userName={user.fullName}
              canClear={false}
            />
          </div>
        ) : (
          <LiveClassroom
            roomName={session.roomSlug}
            displayName={user.fullName}
            sessionId={sessionId}
            userId={user.id}
            userName={user.fullName}
            canClearBoard={user.role === "teacher"}
            livekitEnabled={livekitEnabled}
          />
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-ink">Tài liệu buổi học</h2>
          {session.materials.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Chưa có tài liệu.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {session.materials.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3 text-sm hover:border-brand/40"
                  >
                    <span className="font-medium text-ink">{m.title}</span>
                    <span className="text-xs uppercase text-muted">{m.type}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {user.role === "teacher" ? (
          <section>
            <h2 className="text-lg font-semibold text-ink">
              Điểm danh ({attendance.length})
            </h2>
            {attendance.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Chưa có học sinh điểm danh.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {attendance.map((a) => (
                  <li
                    key={`${a.userId}-${a.checkedAt}`}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-ink">{a.fullName}</span>
                    <span className="text-muted">
                      {new Date(a.checkedAt).toLocaleTimeString("vi-VN")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-line bg-brand-soft/50 p-5 text-sm text-muted">
            <p className="font-medium text-brand-deep">Hướng dẫn</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Bấm điểm danh khi vào lớp</li>
              <li>Cho phép camera/mic để vào phòng học</li>
              <li>Dùng bảng trắng để ghi chú / theo bài giảng</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
