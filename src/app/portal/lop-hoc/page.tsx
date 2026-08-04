import Link from "next/link";
import { redirect } from "next/navigation";
import { formatSessionTime, sessionState } from "@/lib/classroom";
import {
  listClassesForStudent,
  listSessions,
} from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Lớp học online" };

export default async function StudentClassesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role === "teacher") redirect("/portal/giang-day");

  const classes = await listClassesForStudent(user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Lớp học online
      </h1>
      <p className="mt-1 text-muted">
        Lớp ôn online lưu trên database: vào phòng học, điểm danh và tài liệu.
      </p>

      {classes.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-paper p-5 text-sm text-muted">
          Bạn chưa được gán lớp online nào.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {await Promise.all(
            classes.map(async (c) => {
              const sessions = await listSessions(c.id);
              const next = sessions.find((s) => sessionState(s) !== "ended");
              return (
                <article
                  key={c.id}
                  className="rounded-xl border border-line bg-paper p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-accent">
                        {c.code}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-ink">
                        {c.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        GV: {c.teacherName}
                      </p>
                      {next ? (
                        <p className="mt-2 text-sm text-brand-deep">
                          Buổi tiếp: {next.title} ·{" "}
                          {formatSessionTime(next.startsAt)}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={`/portal/lop-hoc/${c.id}`}
                      className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep"
                    >
                      Vào lớp
                    </Link>
                  </div>
                </article>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
