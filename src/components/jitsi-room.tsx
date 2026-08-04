"use client";

type Props = {
  roomName: string;
  displayName: string;
};

export function JitsiRoom({ roomName, displayName }: Props) {
  const src = `https://meet.jit.si/${encodeURIComponent(roomName)}#userInfo.displayName="${encodeURIComponent(displayName)}"&config.prejoinConfig.enabled=true`;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink/95">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-xs text-white/70">
        <span>Phòng học online · Jitsi (MVP)</span>
        <a
          href={`https://meet.jit.si/${encodeURIComponent(roomName)}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-white"
        >
          Mở tab mới
        </a>
      </div>
      <iframe
        title={`Phòng học ${roomName}`}
        src={src}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="h-[420px] w-full sm:h-[520px] lg:h-[600px]"
      />
    </div>
  );
}
