"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ClassroomWhiteboard } from "@/components/classroom-whiteboard";
import { JitsiRoom } from "@/components/jitsi-room";

const LiveKitRoomPanel = dynamic(
  () =>
    import("@/components/livekit-room").then((m) => m.LiveKitRoomPanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-ink/95 text-sm text-white/70 sm:h-[520px]">
        Đang tải phòng LiveKit…
      </div>
    ),
  },
);

type Layout = "split" | "video" | "board";

type Props = {
  roomName: string;
  displayName: string;
  sessionId: string;
  userId: string;
  userName: string;
  canClearBoard: boolean;
  livekitEnabled: boolean;
};

export function LiveClassroom({
  roomName,
  displayName,
  sessionId,
  userId,
  userName,
  canClearBoard,
  livekitEnabled,
}: Props) {
  const [layout, setLayout] = useState<Layout>("split");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-line bg-surface p-1 text-xs font-medium">
          {(
            [
              ["split", "Video + bảng"],
              ["video", "Chỉ video"],
              ["board", "Chỉ bảng"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLayout(id)}
              className={`rounded-md px-3 py-1.5 ${
                layout === id
                  ? "bg-brand text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">
          {livekitEnabled
            ? "Video: LiveKit"
            : "Video: Jitsi (chưa cấu hình LiveKit)"}
        </span>
      </div>

      {layout !== "board" ? (
        livekitEnabled ? (
          <LiveKitRoomPanel roomName={roomName} displayName={displayName} />
        ) : (
          <JitsiRoom roomName={roomName} displayName={displayName} />
        )
      ) : null}

      {layout !== "video" ? (
        <ClassroomWhiteboard
          sessionId={sessionId}
          userId={userId}
          userName={userName}
          canClear={canClearBoard}
        />
      ) : null}
    </div>
  );
}
