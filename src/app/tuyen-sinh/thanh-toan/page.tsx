"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") ?? "";
  const [refCode, setRefCode] = useState(initialRef);
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admissions/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refCode, idNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tạo được thanh toán");
      if (data.alreadyPaid) {
        window.location.href = `/tuyen-sinh/tra-cuu?ref=${encodeURIComponent(refCode)}`;
        return;
      }
      window.location.href = data.checkoutUrl as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Thanh toán
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep">
        Thanh toán lệ phí xét tuyển
      </h1>
      <p className="mt-2 text-muted">
        Lệ phí mặc định <strong>500.000đ</strong>. Nhập mã hồ sơ và CCCD để
        thanh toán. Demo dùng cổng mock (bấm xác nhận là thành công).
      </p>

      <form
        onSubmit={startPayment}
        className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6"
      >
        {error ? (
          <p className="rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
            {error}
          </p>
        ) : null}
        <label className="block text-sm">
          Mã hồ sơ
          <input
            required
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            placeholder="TT-DK-2026-1234"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          Số CCCD (xác minh)
          <input
            required
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
        >
          {loading ? "Đang chuyển…" : "Thanh toán online"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/tuyen-sinh/tra-cuu" className="font-medium text-brand">
          Tra cứu hồ sơ
        </Link>
        {" · "}
        <Link href="/tuyen-sinh/dang-ky" className="font-medium text-brand">
          Đăng ký mới
        </Link>
      </p>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
