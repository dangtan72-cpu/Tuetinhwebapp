import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  assignmentDueState,
  listAssignmentsForClass,
} from "@/lib/assignments";
import { getClass } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export default async function TeacherClassAssignmentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal/bai-tap");

  const { classId } = await params;
  const query = await searchParams;
  const onlineClass = await getClass(classId);
  if (!onlineClass || onlineClass.teacherId !== user.id) notFound();

  const assignments = await listAssignmentsForClass(classId);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  return (
    <div>
      <Link
        href={`/portal/giang-day/${classId}`}
        className="text-sm font-medium text-brand"
      >
        ← Về lớp
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Bài tập · {onlineClass.name}
      </h1>
      <p className="mt-1 text-sm text-muted">{onlineClass.code}</p>

      {query.error === "missing" ? (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          Thiếu tiêu đề hoặc hạn nộp.
        </p>
      ) : null}

      <form
        action="/api/assignments"
        method="POST"
        className="mt-8 space-y-3 rounded-xl border border-line bg-paper p-5"
      >
        <input type="hidden" name="action" value="create" />
        <input type="hidden" name="classId" value={classId} />
        <p className="text-sm font-semibold text-ink">Giao bài tập mới</p>
        <input
          name="title"
          required
          placeholder="Tiêu đề bài tập"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
        />
        <textarea
          name="description"
          rows={4}
          placeholder="Đề bài / hướng dẫn nộp…"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
        />
        <input
          name="attachmentUrl"
          type="url"
          placeholder="Link tài liệu đính kèm (tuỳ chọn)"
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            Hạn nộp (ngày)
            <input
              type="date"
              name="dueDate"
              required
              defaultValue={defaultDate}
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="text-sm">
            Giờ
            <input
              type="time"
              name="dueTime"
              defaultValue="23:59"
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="text-sm">
            Thang điểm
            <input
              type="number"
              name="maxScore"
              min={1}
              max={100}
              step={0.5}
              defaultValue={10}
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
            />
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          Đăng bài tập
        </button>
      </form>

      <h2 className="mt-8 text-lg font-semibold text-ink">
        Danh sách ({assignments.length})
      </h2>
      <ul className="mt-4 space-y-3">
        {assignments.map((a) => {
          const state = assignmentDueState(a.dueAt);
          return (
            <li
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-ink">{a.title}</p>
                <p className="text-sm text-muted">
                  Hạn {new Date(a.dueAt).toLocaleString("vi-VN")} · Đã nộp{" "}
                  {a.submissionCount ?? 0} ·{" "}
                  {state === "overdue"
                    ? "Quá hạn"
                    : state === "due_soon"
                      ? "Sắp đến hạn"
                      : "Còn hạn"}
                </p>
              </div>
              <Link
                href={`/portal/giang-day/${classId}/bai-tap/${a.id}`}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep"
              >
                Xem / chấm bài
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
