import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Hồ sơ học sinh" };

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");

  const fields = [
    { label: "Họ và tên", value: user.fullName },
    { label: "Mã số sinh viên", value: user.studentId },
    { label: "Email", value: user.email },
    { label: "Ngành", value: user.program },
    { label: "Lớp", value: user.className },
    { label: "Khóa", value: user.cohort },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Hồ sơ cá nhân
      </h1>
      <p className="mt-1 text-muted">Thông tin học vụ đang theo dõi.</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className="rounded-xl border border-line bg-paper px-4 py-3"
          >
            <dt className="text-xs uppercase tracking-wide text-muted">
              {f.label}
            </dt>
            <dd className="mt-1 font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
