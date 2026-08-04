"use client";

import { useState, type FormEvent } from "react";
import { programs } from "@/lib/data";

const levels = ["Ngắn hạn", "Trung cấp", "Cao đẳng", "Đại học / Liên thông"];
const educations = ["Tốt nghiệp THPT", "Trung cấp", "CĐ/ĐH", "Khác"];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          idNumber: form.get("idNumber"),
          phone: form.get("phone"),
          email: form.get("email"),
          education: form.get("education"),
          level: form.get("level"),
          program: form.get("program"),
        }),
      });
      const data = (await res.json()) as { refCode?: string; error?: string };
      if (!res.ok || !data.refCode) {
        throw new Error(data.error || "Không gửi được hồ sơ");
      }
      setRefCode(data.refCode);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi gửi hồ sơ");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          Thành công
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep">
          Đã nhận hồ sơ đăng ký
        </h1>
        <p className="mt-3 text-muted">
          Mã hồ sơ của bạn:{" "}
          <span className="font-semibold text-brand-deep">{refCode}</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          Hồ sơ đã lưu vào database. Nhà trường sẽ liên hệ xác nhận.
        </p>
        <a
          href="/tuyen-sinh"
          className="mt-8 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          Quay lại tuyển sinh
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Apply online
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep">
        Đăng ký xét tuyển trực tuyến
      </h1>
      <p className="mt-2 text-muted">
        Điền thông tin cá nhân và nguyện vọng ngành học.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8"
      >
        {error ? (
          <p className="rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
            {error}
          </p>
        ) : null}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-muted">
            Thông tin cá nhân
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Họ và tên</span>
              <input
                required
                name="fullName"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Số CCCD</span>
              <input
                required
                name="idNumber"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Số điện thoại</span>
              <input
                required
                name="phone"
                type="tel"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Email</span>
              <input
                required
                name="email"
                type="email"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-muted">
            Học vấn & nguyện vọng
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Trình độ học vấn</span>
              <select
                name="education"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              >
                {educations.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Hệ xét tuyển</span>
              <select
                name="level"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              >
                {levels.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Ngành tuyển sinh</span>
              <select
                name="program"
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 outline-none ring-brand/30 focus:ring-2"
              >
                {programs.map((p) => (
                  <option key={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {loading ? "Đang gửi…" : "Gửi hồ sơ đăng ký"}
        </button>
      </form>
    </div>
  );
}
