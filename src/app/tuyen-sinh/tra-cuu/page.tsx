"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán — chờ duyệt",
  contacted: "Nhà trường đã liên hệ",
  accepted: "Đã cấp MSSV — có thể đăng nhập portal",
  rejected: "Không trúng tuyển / từ chối",
};

type LookupResult = {
  refCode: string;
  fullName: string;
  program: string;
  status: string;
  admissionFee: number;
  issuedStudentId: string | null;
  createdAt: string;
  latestPayment?: {
    orderCode: string;
    status: string;
    paidAt: string | null;
    amount: number;
  } | null;
};

function LookupContent() {
  const searchParams = useSearchParams();
  const [refCode, setRefCode] = useState(searchParams.get("ref") ?? "");
  const [idNumber, setIdNumber] = useState("");
  const [result, setResult] = useState<LookupResult | null | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(undefined);
    try {
      const res = await fetch("/api/admissions/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refCode, idNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tìm thấy");
      setResult(data.application as LookupResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tra cứu");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Tra cứu
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Tra cứu hồ sơ xét tuyển
      </h1>
      <p className="mt-3 text-muted">
        Nhập mã hồ sơ và số CCCD đã đăng ký. Không cần đăng nhập.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-end"
      >
        <label className="block flex-1">
          <span className="text-sm font-medium">Mã hồ sơ</span>
          <input
            required
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            placeholder="TT-DK-2026-1234"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <label className="block flex-1">
          <span className="text-sm font-medium">Số CCCD</span>
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
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {loading ? "Đang tra…" : "Tra cứu"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          {error}
        </p>
      ) : null}

      {result === null && !error ? (
        <p className="mt-6 text-sm text-muted">
          Không tìm thấy hồ sơ. Kiểm tra lại mã và CCCD.
        </p>
      ) : null}

      {result ? (
        <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
          <p className="text-xs uppercase tracking-wide text-muted">Kết quả</p>
          <p className="mt-2 font-display text-xl font-semibold text-brand-deep">
            {result.fullName}
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Mã hồ sơ</dt>
              <dd className="font-medium">{result.refCode}</dd>
            </div>
            <div>
              <dt className="text-muted">Ngành</dt>
              <dd className="font-medium">{result.program}</dd>
            </div>
            <div>
              <dt className="text-muted">Trạng thái</dt>
              <dd className="font-medium">
                {STATUS_LABEL[result.status] ?? result.status}
              </dd>
            </div>
            {result.issuedStudentId ? (
              <div>
                <dt className="text-muted">MSSV</dt>
                <dd className="font-medium text-brand-deep">
                  {result.issuedStudentId}
                </dd>
              </div>
            ) : null}
            {result.latestPayment?.status === "success" ? (
              <>
                <div>
                  <dt className="text-muted">Đã thanh toán</dt>
                  <dd className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(result.latestPayment.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Mã GD</dt>
                  <dd className="font-mono text-xs">
                    {result.latestPayment.orderCode}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>

          {result.status === "pending" ? (
            <Link
              href={`/tuyen-sinh/thanh-toan?ref=${encodeURIComponent(result.refCode)}`}
              className="mt-6 inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white"
            >
              Thanh toán lệ phí ({result.admissionFee.toLocaleString("vi-VN")}đ)
            </Link>
          ) : null}

          {result.status === "accepted" ? (
            <Link
              href="/dang-nhap"
              className="mt-6 inline-flex rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              Đăng nhập cổng học sinh
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function AdmissionLookupPage() {
  return (
    <Suspense>
      <LookupContent />
    </Suspense>
  );
}
