import Link from "next/link";
import { redirect } from "next/navigation";
import { listClassesForTeacher, listSessions } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Lớp giảng dạy" };

export default async function TeacherClassesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal/lop-hoc");

  const classes = await listClassesForTeacher(user.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Lớp giảng dạy online
      </h1>
      <p className="mt-1 text-muted">
        Dữ liệu lưu PostgreSQL — tạo lớp, lên lịch và mở phòng học.
      </p>

      <form
        action="/api/classroom/manage"
        method="POST"
        className="mt-8 space-y-3 rounded-xl border border-line bg-paper p-5"
      >
        <input type="hidden" name="action" value="create-class" />
        <p className="text-sm font-semibold text-ink">Tạo lớp mới</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            required
            placeholder="Tên lớp"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
          <input
            name="code"
            required
            placeholder="Mã lớp (VD: YHCT-ON1)"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
          <input
            name="program"
            required
            placeholder="Ngành / chương trình"
            defaultValue="Y học cổ truyền"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
          <input
            name="description"
            placeholder="Mô tả ngắn"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Tạo lớp
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {await Promise.all(
          classes.map(async (c) => {
            const count = (await listSessions(c.id)).length;
            return (
              <article
                key={c.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-accent">
                    {c.code}
                  </p>
                  <h2 className="mt-1 font-semibold text-ink">{c.name}</h2>
                  <p className="text-sm text-muted">
                    {c.studentIds.length} học viên · {count} buổi học
                  </p>
                </div>
                <Link
                  href={`/portal/giang-day/${c.id}`}
                  className="rounded-md border border-brand/30 px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-soft"
                >
                  Quản lý
                </Link>
              </article>
            );
          }),
        )}
      </div>
    </div>
  );
}
