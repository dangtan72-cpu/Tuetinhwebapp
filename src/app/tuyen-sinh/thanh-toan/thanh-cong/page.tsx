import Link from "next/link";
import { confirmPayment, getPaymentByOrderCode } from "@/lib/payments";
import { formatVnd } from "@/lib/admissions";
import { prisma } from "@/lib/db";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; ref?: string }>;
}) {
  const params = await searchParams;
  const order = params.order ?? params.ref;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Link href="/tuyen-sinh/tra-cuu" className="text-brand">
          Tra cứu hồ sơ
        </Link>
      </div>
    );
  }

  await confirmPayment(order);
  const payment = await getPaymentByOrderCode(order);
  const appRow = payment
    ? await prisma.admissionApplication.findUnique({
        where: { id: payment.applicationId },
      })
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Thành công
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep">
        Thanh toán thành công
      </h1>
      {payment && appRow ? (
        <div className="mt-6 rounded-xl border border-line bg-surface p-5 text-left text-sm">
          <p>
            Mã hồ sơ: <strong>{appRow.refCode}</strong>
          </p>
          <p className="mt-1">Số tiền: {formatVnd(payment.amount)}</p>
          <p className="mt-1 text-muted">Mã GD: {payment.orderCode}</p>
          <p className="mt-3 text-muted">
            Nhà trường sẽ xét duyệt và cấp MSSV qua email. Tra cứu trạng thái
            bằng mã hồ sơ + CCCD.
          </p>
        </div>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {appRow ? (
          <Link
            href={`/tuyen-sinh/tra-cuu?ref=${encodeURIComponent(appRow.refCode)}`}
            className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
          >
            Tra cứu hồ sơ
          </Link>
        ) : null}
        <Link
          href="/tuyen-sinh"
          className="rounded-md border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-paper"
        >
          Về tuyển sinh
        </Link>
      </div>
    </div>
  );
}
