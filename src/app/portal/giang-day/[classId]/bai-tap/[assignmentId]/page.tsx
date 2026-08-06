import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getAssignment,
  listSubmissions,
} from "@/lib/assignments";
import { getClass } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export default async function TeacherGradeAssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string; assignmentId: string }>;
  searchParams: Promise<{ error?: string; graded?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal/bai-tap");

  const { classId, assignmentId } = await params;
  const query = await searchParams;
  const onlineClass = await getClass(classId);
  const assignment = await getAssignment(assignmentId);
  if (
    !onlineClass ||
    !assignment ||
    assignment.classId !== classId ||
    onlineClass.teacherId !== user.id
  ) {
    notFound();
  }

  const submissions = await listSubmissions(assignmentId);
  const enrolled = onlineClass.studentIds.length;

  return (
    <div>
      <Link
        href={`/portal/giang-day/${classId}/bai-tap`}
        className="text-sm font-medium text-brand"
      >
        ← Danh sách bài tập
      </Link>

      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        {assignment.title}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {assignment.classCode} · Hạn{" "}
        {new Date(assignment.dueAt).toLocaleString("vi-VN")} · Đã nộp{" "}
        {submissions.length}/{enrolled}
      </p>

      {query.graded ? (
        <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          Đã lưu điểm.
        </p>
      ) : null}
      {query.error === "score" ? (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          Điểm không hợp lệ (0–{assignment.maxScore}).
        </p>
      ) : null}

      <section className="mt-6 rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-semibold text-ink">Đề bài</h2>
        <p className="mt-2 whitespace-pre-wrap text-[15px] text-ink/90 sm:text-base">
          {assignment.description || "—"}
        </p>
        {assignment.attachmentUrl ? (
          <a
            href={assignment.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-brand"
          >
            Tài liệu đính kèm →
          </a>
        ) : null}
      </section>

      <h2 className="mt-8 text-lg font-semibold text-ink">Bài nộp</h2>
      {submissions.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Chưa có học sinh nộp bài.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{s.studentName}</p>
                  <p className="text-xs text-muted">
                    {s.studentCode} · Nộp{" "}
                    {new Date(s.submittedAt).toLocaleString("vi-VN")}
                    {s.status === "graded"
                      ? ` · Điểm ${s.score}/${assignment.maxScore}`
                      : " · Chưa chấm"}
                  </p>
                </div>
              </div>
              {s.content ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">
                  {s.content}
                </p>
              ) : null}
              {s.fileUrl ? (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-brand"
                >
                  Mở file nộp →
                </a>
              ) : null}

              <form
                action="/api/assignments"
                method="POST"
                className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[120px_1fr_auto]"
              >
                <input type="hidden" name="action" value="grade" />
                <input type="hidden" name="assignmentId" value={assignment.id} />
                <input type="hidden" name="submissionId" value={s.id} />
                <label className="text-sm">
                  Điểm
                  <input
                    type="number"
                    name="score"
                    required
                    min={0}
                    max={assignment.maxScore}
                    step={0.5}
                    defaultValue={s.score ?? undefined}
                    className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
                  />
                </label>
                <label className="text-sm sm:col-span-1">
                  Nhận xét
                  <input
                    name="feedback"
                    defaultValue={s.feedback ?? ""}
                    placeholder="Nhận xét ngắn…"
                    className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep sm:w-auto"
                  >
                    Lưu điểm
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
