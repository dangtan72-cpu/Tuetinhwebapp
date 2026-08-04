"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AttendanceButton({
  sessionId,
  alreadyChecked,
}: {
  sessionId: string;
  alreadyChecked: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadyChecked);
  const [error, setError] = useState("");

  async function checkIn() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/classroom/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Không điểm danh được");
      }
      setDone(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi điểm danh");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-md bg-brand-soft px-3 py-2 text-sm font-medium text-brand-deep">
        Đã điểm danh
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={checkIn}
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
      >
        {loading ? "Đang điểm danh…" : "Điểm danh buổi học"}
      </button>
      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}
