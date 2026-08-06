import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  assignmentDueState,
  getAssignmentForStudent,
} from "@/lib/assignments";
import { getClass } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export default async function StudentAssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "student") redirect("/portal/bai-tap");

  const { id } = await params;
  const query = await searchParams;
  const assignment = await getAssignmentForStudent(id, user.id);
  if (!assignment) notFound();

  const onlineClass = await getClass(assignment.classId);
  if (!onlineClass?.studentIds.includes(user.id)) {
    redirect("/portal/bai-tap");
  }

  const due = assignmentDueState(assignment.dueAt);
  const sub = assignment.mySubmission;

  return (
    <div>
      <Link href="/portal/bai-tap" className="text-sm font-medium text-brand">
        ← Danh sách bài tập
      </Link>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-accent">
        {assignment.classCode}
      </p>
      <h1 className="font-display mt-1 text-2xl font-semibold text-brand-deep">
        {assignment.title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Hạn nộp {new Date(assignment.dueAt).toLocaleString("vi-VN")} · Thang
        điểm {assignment.maxScore} ·{" "}
        {due === "overdue"
          ? "Đã quá hạn (vẫn có thể nộp)"
          : due === "due_soon"
            ? "Sắp đến hạn"
            : "Còn hạn"}
      </p>

      {query.ok ? (
        <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          Đã nộp bài thành công.
        </p>
      ) : null}
      {query.error === "empty" ? (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          Cần nhập nội dung hoặc link file.
        </p>
      ) : null}

      <section className="mt-6 rounded-xl border border-line bg-paper p-5">
        <h2 className="text-sm font-semibold text-ink">Đề bài</h2>
        <p className="mt-2 whitespace-pre-wrap text-[15px] text-ink/90 sm:text-base">
          {assignment.description || "Không có mô tả chi tiết."}
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

      {sub?.status === "graded" ? (
        <section className="mt-6 rounded-xl border border-brand/30 bg-brand-soft/40 p-5">
          <h2 className="text-sm font-semibold text-brand-deep">Kết quả chấm</h2>
          <p className="mt-2 text-2xl font-semibold text-brand-deep">
            {sub.score}/{assignment.maxScore}
          </p>
          {sub.feedback ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink/90">
              {sub.feedback}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted">
            Chấm lúc{" "}
            {sub.gradedAt
              ? new Date(sub.gradedAt).toLocaleString("vi-VN")
              : "—"}
          </p>
        </section>
      ) : null}

      {sub && sub.status !== "graded" ? (
        <section className="mt-6 rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Bài đã nộp</h2>
          <p className="mt-1 text-xs text-muted">
            {new Date(sub.submittedAt).toLocaleString("vi-VN")}
          </p>
          {sub.content ? (
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">
              {sub.content}
            </p>
          ) : null}
          {sub.fileUrl ? (
            <a
              href={sub.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-medium text-brand"
            >
              Link bài nộp →
            </a>
          ) : null}
        </section>
      ) : null}

      <section className="mt-6 rounded-xl border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">
          {sub ? "Nộp lại bài" : "Nộp bài"}
        </h2>
        <p className="mt-1 text-xs text-muted">
          Nộp lại sẽ ghi đè bài cũ và xóa điểm đã chấm (nếu có).
        </p>
        <form
          action="/api/assignments"
          method="POST"
          className="mt-4 space-y-3"
        >
          <input type="hidden" name="action" value="submit" />
          <input type="hidden" name="assignmentId" value={assignment.id} />
          <label className="block text-sm">
            Nội dung bài làm
            <textarea
              name="content"
              rows={6}
              defaultValue={sub?.content ?? ""}
              placeholder="Viết câu trả lời hoặc mô tả bài làm…"
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            Link file (tuỳ chọn)
            <input
              name="fileUrl"
              type="url"
              defaultValue={sub?.fileUrl ?? ""}
              placeholder="https://drive.google.com/..."
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            {sub ? "Nộp lại" : "Nộp bài"}
          </button>
        </form>
      </section>
    </div>
  );
}
