"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WhiteboardStroke } from "@/lib/whiteboard";

const COLORS = ["#0f3d2e", "#c45c26", "#1d4ed8", "#111827", "#dc2626"];

type Props = {
  sessionId: string;
  userId: string;
  userName: string;
  canClear: boolean;
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ClassroomWhiteboard({
  sessionId,
  userId,
  userName,
  canClear,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(3);
  const [eraser, setEraser] = useState(false);
  const [status, setStatus] = useState("Đồng bộ…");
  const drawing = useRef(false);
  const current = useRef<WhiteboardStroke | null>(null);
  const knownIds = useRef(new Set<string>());

  const redraw = useCallback((list: WhiteboardStroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f7f4ef";
    ctx.fillRect(0, 0, w, h);

    for (const stroke of list) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = stroke.width;
      ctx.strokeStyle = stroke.eraser ? "#f7f4ef" : stroke.color;
      ctx.globalCompositeOperation = stroke.eraser
        ? "destination-out"
        : "source-over";
      stroke.points.forEach(([x, y], i) => {
        const px = x * w;
        const py = y * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const mergeRemote = useCallback(
    (remote: WhiteboardStroke[]) => {
      setStrokes((prev) => {
        const map = new Map(prev.map((s) => [s.id, s]));
        for (const s of remote) map.set(s.id, s);
        const next = Array.from(map.values());
        knownIds.current = new Set(next.map((s) => s.id));
        redraw(next);
        return next;
      });
    },
    [redraw],
  );

  useEffect(() => {
    let alive = true;

    async function pull() {
      try {
        const res = await fetch(
          `/api/classroom/whiteboard?sessionId=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!alive) return;
        mergeRemote(data.strokes as WhiteboardStroke[]);
        setStatus("Đã đồng bộ");
      } catch {
        if (alive) setStatus("Mất kết nối đồng bộ");
      }
    }

    void pull();
    const timer = setInterval(pull, 2000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [sessionId, mergeRemote]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(Math.max(280, rect.height) * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(280, rect.height)}px`;
      redraw(strokes);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redraw]);

  function pointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return [
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height,
    ] as [number, number];
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const stroke: WhiteboardStroke = {
      id: uid(),
      color,
      width: eraser ? Math.max(width * 4, 12) : width,
      points: [pointFromEvent(e)],
      eraser,
      by: userId,
      byName: userName,
    };
    current.current = stroke;
    setStrokes((prev) => {
      const next = [...prev, stroke];
      redraw(next);
      return next;
    });
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !current.current) return;
    const pt = pointFromEvent(e);
    current.current.points.push(pt);
    setStrokes((prev) => {
      const next = prev.map((s) =>
        s.id === current.current!.id
          ? { ...s, points: [...current.current!.points] }
          : s,
      );
      redraw(next);
      return next;
    });
  }

  async function finishStroke() {
    if (!drawing.current || !current.current) return;
    drawing.current = false;
    const finished = current.current;
    current.current = null;
    if (finished.points.length < 2) return;

    knownIds.current.add(finished.id);
    setStatus("Đang gửi nét…");
    try {
      const res = await fetch("/api/classroom/whiteboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          action: "append",
          strokes: [finished],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        mergeRemote(data.strokes as WhiteboardStroke[]);
        setStatus("Đã đồng bộ");
      } else {
        setStatus(data.error || "Gửi nét thất bại");
      }
    } catch {
      setStatus("Gửi nét thất bại");
    }
  }

  async function clearBoard() {
    if (!canClear) return;
    if (!confirm("Xóa toàn bộ bảng trắng?")) return;
    setStatus("Đang xóa…");
    const res = await fetch("/api/classroom/whiteboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, action: "clear" }),
    });
    const data = await res.json();
    if (res.ok) {
      mergeRemote(data.strokes as WhiteboardStroke[]);
      setStatus("Đã xóa bảng");
    } else {
      setStatus(data.error || "Không xóa được");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Bảng trắng
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Màu ${c}`}
              onClick={() => {
                setColor(c);
                setEraser(false);
              }}
              className={`h-6 w-6 rounded-full border-2 ${
                color === c && !eraser ? "border-ink" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <label className="flex items-center gap-1 text-xs text-muted">
            Đậm
            <input
              type="range"
              min={1}
              max={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-16"
            />
          </label>
          <button
            type="button"
            onClick={() => setEraser((v) => !v)}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              eraser
                ? "bg-brand text-white"
                : "border border-line bg-surface text-ink"
            }`}
          >
            Tẩy
          </button>
          {canClear ? (
            <button
              type="button"
              onClick={() => void clearBoard()}
              className="rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium text-accent"
            >
              Xóa bảng
            </button>
          ) : null}
          <span className="text-xs text-muted">{status}</span>
        </div>
      </div>
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => void finishStroke()}
          onPointerCancel={() => void finishStroke()}
          onPointerLeave={() => void finishStroke()}
        />
      </div>
    </div>
  );
}
