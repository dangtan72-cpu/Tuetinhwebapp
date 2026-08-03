"use client";

import { useState, type FormEvent } from "react";
import { certificates, type CertificateRecord } from "@/lib/data";

export default function CertificatePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CertificateRecord | null | undefined>(
    undefined,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const code = query.trim().toUpperCase();
    const found = certificates.find((c) => c.code.toUpperCase() === code);
    setResult(found ?? null);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Verification
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Tra cứu văn bằng – chứng chỉ
      </h1>
      <p className="mt-3 text-muted">
        Nhập mã văn bằng / chứng chỉ để xác minh tính hợp lệ. Không cần đăng
        nhập.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-end"
      >
        <label className="block flex-1">
          <span className="text-sm font-medium">Mã văn bằng / chứng chỉ</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="VD: TT-VB-2024-0158"
            required
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Tra cứu
        </button>
      </form>

      <div className="mt-4 rounded-xl bg-brand-soft/60 px-4 py-3 text-sm text-muted">
        Thử mã demo:{" "}
        <button
          type="button"
          className="font-medium text-brand-deep underline"
          onClick={() => setQuery("TT-VB-2024-0158")}
        >
          TT-VB-2024-0158
        </button>
        {" · "}
        <button
          type="button"
          className="font-medium text-brand-deep underline"
          onClick={() => setQuery("TT-CC-2025-0042")}
        >
          TT-CC-2025-0042
        </button>
      </div>

      {result === null ? (
        <div className="mt-8 rounded-xl border border-accent/30 bg-accent-soft p-5">
          <p className="font-semibold text-accent">Không tìm thấy</p>
          <p className="mt-1 text-sm text-muted">
            Mã không tồn tại trong hệ thống demo. Kiểm tra lại mã trên văn bằng.
          </p>
        </div>
      ) : null}

      {result ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                result.status === "valid"
                  ? "bg-brand-soft text-brand-deep"
                  : "bg-accent-soft text-accent"
              }`}
            >
              {result.status === "valid" ? "Hợp lệ" : "Đã thu hồi"}
            </span>
            <span className="text-sm text-muted">{result.code}</span>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Họ và tên", result.fullName],
              ["Chương trình", result.program],
              ["Trình độ", result.level],
              [
                "Ngày cấp",
                new Date(result.issueDate).toLocaleDateString("vi-VN"),
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
