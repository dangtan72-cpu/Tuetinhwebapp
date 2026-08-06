import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ADMISSION_STATUS_LABEL,
  formatVnd,
  listAdmissionApplications,
} from "@/lib/admissions";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "Hồ sơ tuyển sinh" };

export default async function AdmissionsAdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (user.role !== "teacher") redirect("/portal");

  const apps = await listAdmissionApplications();

  return (
    <div>
      <Link href="/portal" className="text-sm font-medium text-brand">
        ← Tổng quan
      </Link>
      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        Hồ sơ tuyển sinh
      </h1>
      <p className="mt-1 text-muted">
        Duyệt hồ sơ, xác nhận thanh toán, cấp MSSV + tài khoản portal.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-soft/70 text-brand-deep">
            <tr>
              <th className="px-4 py-3 font-semibold">Mã HS</th>
              <th className="px-4 py-3 font-semibold">Họ tên</th>
              <th className="px-4 py-3 font-semibold">Ngành</th>
              <th className="px-4 py-3 font-semibold">Thanh toán</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">MSSV</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-muted">
                  Chưa có hồ sơ.
                </td>
              </tr>
            ) : (
              apps.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{a.refCode}</td>
                  <td className="px-4 py-3">{a.fullName}</td>
                  <td className="px-4 py-3">{a.program}</td>
                  <td className="px-4 py-3">
                    {a.latestPayment?.status === "success"
                      ? formatVnd(a.latestPayment.amount)
                      : formatVnd(a.admissionFee)}
                  </td>
                  <td className="px-4 py-3">
                    {ADMISSION_STATUS_LABEL[a.status]}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {a.issuedStudentId ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/ho-so-tuyen-sinh/${a.id}`}
                      className="font-medium text-brand hover:underline"
                    >
                      Chi tiết
                    </Link>
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
