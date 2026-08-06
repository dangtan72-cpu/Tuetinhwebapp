import Link from "next/link";
import { getPaymentByOrderCode } from "@/lib/payments";
import { formatVnd } from "@/lib/admissions";
import { prisma } from "@/lib/db";

export default async function MockPaymentConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-accent">Thiếu mã giao dịch</p>
        <Link href="/tuyen-sinh/thanh-toan" className="mt-4 inline-block text-brand">
          Quay lại
        </Link>
      </div>
    );
  }

  const payment = await getPaymentByOrderCode(order);
  if (!payment) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted">Giao dịch không hợp lệ.</p>
        <Link href="/tuyen-sinh/thanh-toan" className="mt-4 inline-block text-brand">
          Quay lại
        </Link>
      </div>
    );
  }

  if (payment.status === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-brand-deep">Giao dịch đã thanh toán.</p>
        <Link href="/tuyen-sinh/tra-cuu" className="mt-4 inline-block text-brand">
          Tra cứu hồ sơ
        </Link>
      </div>
    );
  }

  const appRow = await prisma.admissionApplication.findUnique({
    where: { id: payment.applicationId },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Xác nhận thanh toán (demo)
      </p>
      <h1 className="font-display mt-2 text-2xl font-semibold text-brand-deep">
        Thanh toán lệ phí xét tuyển
      </h1>
      {appRow ? (
        <div className="mt-6 rounded-xl border border-line bg-surface p-5 text-sm">
          <p>
            Hồ sơ: <strong>{appRow.refCode}</strong>
          </p>
          <p className="mt-1">Họ tên: {appRow.fullName}</p>
          <p className="mt-1">Số tiền: {formatVnd(payment.amount)}</p>
          <p className="mt-1 text-muted">Mã GD: {payment.orderCode}</p>
        </div>
      ) : null}

      <Link
        href={`/tuyen-sinh/thanh-toan/thanh-cong?order=${encodeURIComponent(order)}`}
        className="mt-6 block w-full rounded-md bg-brand px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-deep"
      >
        Xác nhận đã thanh toán (demo)
      </Link>
      <Link
        href="/tuyen-sinh/thanh-toan/that-bai"
        className="mt-3 block w-full rounded-md border border-line px-4 py-3 text-center text-sm font-medium text-muted hover:bg-paper"
      >
        Hủy
      </Link>
    </div>
  );
}
