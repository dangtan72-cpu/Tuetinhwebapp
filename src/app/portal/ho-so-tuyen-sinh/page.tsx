import Link from "next/link";
import { redirect } from "next/navigation";
import { listAdmissionApplications } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Hồ sơ tuyển sinh" };

export default async function AdmissionsAdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal");

  const apps = await listAdmissionApplications();

  return (
    <div>
      <Link href="/portal/giang-day" className="text-sm font-medium text-brand">
        ← Lớp giảng dạy
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Hồ sơ tuyển sinh
      </h1>
      <p className="mt-1 text-muted">
        Dữ liệu từ form đăng ký online (PostgreSQL).
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-soft/70 text-brand-deep">
            <tr>
              <th className="px-4 py-3 font-semibold">Mã HS</th>
              <th className="px-4 py-3 font-semibold">Họ tên</th>
              <th className="px-4 py-3 font-semibold">Ngành</th>
              <th className="px-4 py-3 font-semibold">SĐT</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">Ngày nộp</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted">
                  Chưa có hồ sơ.
                </td>
              </tr>
            ) : (
              apps.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{a.refCode}</td>
                  <td className="px-4 py-3">{a.fullName}</td>
                  <td className="px-4 py-3">{a.program}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">{a.status}</td>
                  <td className="px-4 py-3">
                    {new Date(a.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
