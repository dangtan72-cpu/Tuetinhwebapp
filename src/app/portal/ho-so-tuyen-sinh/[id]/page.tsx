import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ADMISSION_STATUS_LABEL,
  formatVnd,
  getAdmissionApplication,
} from "@/lib/admissions";
import { getSessionUser } from "@/lib/session";
import { isStaff } from "@/lib/auth";

export default async function AdmissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    ok?: string;
    error?: string;
    mssv?: string;
    pwd?: string;
  }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (!isStaff(user)) redirect("/portal");

  const { id } = await params;
  const query = await searchParams;
  const app = await getAdmissionApplication(id);
  if (!app) notFound();

  const canAccept =
    app.status !== "accepted" &&
    app.status !== "rejected" &&
    (app.status === "paid" ||
      app.status === "contacted" ||
      app.status === "pending");

  return (
    <div>
      <Link
        href="/portal/ho-so-tuyen-sinh"
        className="text-sm font-medium text-brand"
      >
        ← Danh sách hồ sơ
      </Link>

      <h1 className="font-display mt-4 text-2xl font-semibold text-brand-deep">
        {app.fullName}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {app.refCode} · {ADMISSION_STATUS_LABEL[app.status]}
      </p>

      {query.ok === "accepted" && query.mssv && query.pwd ? (
        <div className="mt-4 rounded-xl border border-brand/40 bg-brand-soft/50 p-5 text-sm">
          <p className="font-semibold text-brand-deep">Đã cấp tài khoản portal</p>
          <p className="mt-2">
            MSSV: <code className="font-semibold">{query.mssv}</code>
          </p>
          <p className="mt-1">
            Email đăng nhập: <code>{app.email}</code>
          </p>
          <p className="mt-1">
            Mật khẩu tạm: <code className="font-semibold">{query.pwd}</code>
          </p>
          <p className="mt-3 text-muted">
            Gửi thông tin này cho thí sinh qua email/SMS. Yêu cầu đổi mật khẩu
            khi đăng nhập lần đầu.
          </p>
        </div>
      ) : null}

      {query.error ? (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          {query.error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-paper p-5 text-sm">
          <h2 className="font-semibold text-ink">Thông tin đăng ký</h2>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">CCCD</dt>
              <dd>{app.idNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">SĐT</dt>
              <dd>{app.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email</dt>
              <dd>{app.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Học vấn</dt>
              <dd>{app.education}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Hệ</dt>
              <dd>{app.level}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Ngành</dt>
              <dd>{app.program}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Lệ phí</dt>
              <dd>{formatVnd(app.admissionFee)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Nộp lúc</dt>
              <dd>{new Date(app.createdAt).toLocaleString("vi-VN")}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 text-sm">
          <h2 className="font-semibold text-ink">Thanh toán</h2>
          {app.latestPayment?.status === "success" ? (
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Số tiền</dt>
                <dd>{formatVnd(app.latestPayment.amount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Mã GD</dt>
                <dd className="font-mono text-xs">{app.latestPayment.orderCode}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Thời gian</dt>
                <dd>
                  {app.latestPayment.paidAt
                    ? new Date(app.latestPayment.paidAt).toLocaleString("vi-VN")
                    : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-muted">Chưa thanh toán lệ phí xét tuyển.</p>
          )}
        </section>
      </div>

      {app.status !== "accepted" && app.status !== "rejected" ? (
        <div className="mt-8 space-y-6">
          <form
            action="/api/admissions/manage"
            method="POST"
            className="flex flex-wrap gap-3 rounded-xl border border-line bg-paper p-5"
          >
            <input type="hidden" name="action" value="contacted" />
            <input type="hidden" name="applicationId" value={app.id} />
            <input
              name="adminNote"
              placeholder="Ghi chú (tuỳ chọn)"
              className="min-w-[200px] flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md border border-brand/30 px-4 py-2 text-sm font-medium text-brand-deep hover:bg-brand-soft"
            >
              Đánh dấu đã liên hệ
            </button>
          </form>

          {canAccept ? (
            <form
              action="/api/admissions/manage"
              method="POST"
              className="space-y-3 rounded-xl border border-brand/30 bg-brand-soft/30 p-5"
            >
              <input type="hidden" name="action" value="accept" />
              <input type="hidden" name="applicationId" value={app.id} />
              <p className="text-sm font-semibold text-brand-deep">
                Cấp MSSV + tạo tài khoản portal
              </p>
              <p className="text-xs text-muted">
                Khuyến nghị cấp sau khi thí sinh đã thanh toán (
                {app.status === "paid" ? "đã thanh toán" : "chưa thanh toán"}).
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Lớp (tuỳ chọn)
                  <input
                    name="className"
                    placeholder="K36A1.2"
                    className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
                  />
                </label>
                <label className="text-sm">
                  Khóa (tuỳ chọn)
                  <input
                    name="cohort"
                    placeholder="2026–2029"
                    className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none ring-brand/30 focus:ring-2"
                  />
                </label>
              </div>
              <input
                name="adminNote"
                placeholder="Ghi chú nội bộ"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
              >
                Duyệt & cấp MSSV
              </button>
            </form>
          ) : null}

          <form
            action="/api/admissions/manage"
            method="POST"
            className="rounded-xl border border-accent/30 bg-accent-soft/20 p-5"
          >
            <input type="hidden" name="action" value="reject" />
            <input type="hidden" name="applicationId" value={app.id} />
            <p className="text-sm font-semibold text-accent">Từ chối hồ sơ</p>
            <input
              name="adminNote"
              placeholder="Lý do (tuỳ chọn)"
              className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="mt-3 rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
            >
              Từ chối
            </button>
          </form>
        </div>
      ) : app.issuedStudentId ? (
        <p className="mt-8 text-sm text-muted">
          MSSV đã cấp:{" "}
          <strong className="text-brand-deep">{app.issuedStudentId}</strong>
        </p>
      ) : null}
    </div>
  );
}
