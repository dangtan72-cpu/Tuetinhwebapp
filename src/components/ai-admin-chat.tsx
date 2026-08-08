"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "help",
  "xem cài đặt trường",
  "danh sách tin",
  "danh sách tài khoản",
  "danh sách hồ sơ tuyển sinh",
  "đăng tin: Thông báo khai giảng năm học mới",
];

export function AiAdminChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Xin chào. Em là AI Orchestrator — quản lý nội dung web, tài khoản, đăng tin, hồ sơ tuyển sinh. Không sửa giao diện.\n\nGõ `help` để xem lệnh.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai-admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Lỗi API");
      }
      let content = String(data.reply || "");
      if (data.results?.length) {
        const details = data.results
          .filter((r: { data?: unknown }) => r.data)
          .map((r: { action: string; data: unknown }) => {
            try {
              return `\n\`\`\`json\n${JSON.stringify(r.data, null, 2)}\n\`\`\``;
            } catch {
              return "";
            }
          })
          .join("");
        content += details;
      }
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: e instanceof Error ? e.message : "Lỗi không xác định",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[min(70vh,720px)] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void send(s)}
            className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink hover:border-brand/40"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`max-w-[92%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-brand text-white"
                : "bg-paper text-ink"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading ? (
          <p className="text-sm text-muted">Đang xử lý…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Vd: đăng tin: … / tạo tài khoản … / đổi tagline thành …"
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none ring-brand/30 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
