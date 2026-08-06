import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Thanh toán
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep">
        Thanh toán chưa hoàn tất
      </h1>
      <p className="mt-3 text-muted">
        Giao dịch đã hủy hoặc thất bại. Anh/chị có thể thử lại sau.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/tuyen-sinh/thanh-toan"
          className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Thanh toán lại
        </Link>
        <Link
          href="/tuyen-sinh/tra-cuu"
          className="rounded-md border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-paper"
        >
          Tra cứu hồ sơ
        </Link>
      </div>
    </div>
  );
}
