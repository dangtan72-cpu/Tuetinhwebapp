"use client";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Room, Track } from "livekit-client";
import { useEffect, useMemo, useState } from "react";

type Props = {
  roomName: string;
  displayName: string;
};

export function LiveKitRoomPanel({ roomName, displayName }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);

  const room = useMemo(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let connected = false;

    async function join() {
      setConnecting(true);
      setError(null);
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Không lấy được token LiveKit");
        }
        if (cancelled) return;
        setToken(data.token);
        setUrl(data.url);
        await room.connect(data.url, data.token);
        connected = true;
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Lỗi kết nối LiveKit");
        }
      } finally {
        if (!cancelled) setConnecting(false);
      }
    }

    void join();

    return () => {
      cancelled = true;
      if (connected || room.state !== "disconnected") {
        void room.disconnect();
      }
    };
  }, [room, roomName]);

  if (error) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-ink/95 px-6 text-center text-sm text-white/80 sm:h-[520px]">
        <div>
          <p className="font-medium text-white">Không kết nối được LiveKit</p>
          <p className="mt-2 text-white/70">{error}</p>
          <p className="mt-3 text-xs text-white/50">
            Kiểm tra LIVEKIT_URL / API key · phòng: {roomName} · {displayName}
          </p>
        </div>
      </div>
    );
  }

  if (connecting || !token || !url) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-line bg-ink/95 text-sm text-white/70 sm:h-[520px]">
        Đang vào phòng LiveKit…
      </div>
    );
  }

  return (
    <RoomContext.Provider value={room}>
      <div
        data-lk-theme="default"
        className="overflow-hidden rounded-xl border border-line bg-ink"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-xs text-white/70">
          <span>Phòng học LiveKit · {displayName}</span>
          <span className="font-mono text-white/50">{roomName}</span>
        </div>
        <div className="lk-room-container relative h-[420px] sm:h-[520px] lg:h-[560px]">
          <ConferenceView />
          <RoomAudioRenderer />
          <ControlBar variation="minimal" />
        </div>
      </div>
    </RoomContext.Provider>
  );
}

function ConferenceView() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100% - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
