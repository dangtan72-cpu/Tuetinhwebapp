import Link from "next/link";
import { redirect } from "next/navigation";
import {
  assignmentDueState,
  listAssignmentsForStudent,
  listAssignmentsForTeacher,
} from "@/lib/assignments";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Bài tập" };

function dueBadge(dueAt: string) {
  const state = assignmentDueState(dueAt);
  if (state === "overdue") {
    return {
      label: "Quá hạn",
      className: "bg-accent-soft text-accent",
    };
  }
  if (state === "due_soon") {
    return {
      label: "Sắp đến hạn",
      className: "bg-amber-100 text-amber-800",
    };
  }
  return {
    label: "Còn hạn",
    className: "bg-brand-soft text-brand-deep",
  };
}

export default async function AssignmentsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  if (user.role === "teacher") {
    const assignments = await listAssignmentsForTeacher(user.id);
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-brand-deep">
          Bài tập các lớp
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tạo bài tập mới từ trang chi tiết từng lớp giảng dạy.
        </p>

        {assignments.length === 0 ? (
          <p className="mt-8 text-sm text-muted">
            Chưa có bài tập. Vào{" "}
            <Link href="/portal/giang-day" className="font-medium text-brand">
              Lớp giảng dạy
            </Link>{" "}
            để giao bài.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {assignments.map((a) => {
              const due = dueBadge(a.dueAt);
              return (
                <li
                  key={a.id}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-accent">
                        {a.classCode}
                      </p>
                      <p className="mt-1 font-medium text-ink">{a.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        Hạn{" "}
                        {new Date(a.dueAt).toLocaleString("vi-VN")} · Đã nộp{" "}
                        {a.submissionCount ?? 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${due.className}`}
                      >
                        {due.label}
                      </span>
                      <Link
                        href={`/portal/giang-day/${a.classId}/bai-tap/${a.id}`}
                        className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-deep"
                      >
                        Chấm bài
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  const assignments = await listAssignmentsForStudent(user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Bài tập của tôi
      </h1>
      <p className="mt-1 text-sm text-muted">
        Nộp bài bằng nội dung văn bản và/hoặc link file (Drive, Dropbox…).
      </p>

      {assignments.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Chưa có bài tập nào.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {assignments.map((a) => {
            const due = dueBadge(a.dueAt);
            const sub = a.mySubmission;
            const statusLabel = !sub
              ? "Chưa nộp"
              : sub.status === "graded"
                ? `Đã chấm: ${sub.score}/${a.maxScore}`
                : "Đã nộp";
            return (
              <li
                key={a.id}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-accent">
                      {a.classCode} · {a.className}
                    </p>
                    <p className="mt-1 font-medium text-ink">{a.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      Hạn {new Date(a.dueAt).toLocaleString("vi-VN")} ·{" "}
                      {statusLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${due.className}`}
                    >
                      {due.label}
                    </span>
                    <Link
                      href={`/portal/bai-tap/${a.id}`}
                      className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-deep"
                    >
                      {sub ? "Xem / nộp lại" : "Nộp bài"}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
