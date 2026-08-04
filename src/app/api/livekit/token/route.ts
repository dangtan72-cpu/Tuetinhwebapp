import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getLiveKitConfig } from "@/lib/livekit";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getLiveKitConfig();
  if (!config.configured) {
    return NextResponse.json(
      {
        error:
          "LiveKit chưa cấu hình. Thêm LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET vào .env",
        configured: false,
      },
      { status: 503 },
    );
  }

  let body: { roomName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const roomName = body.roomName?.trim();
  if (!roomName) {
    return NextResponse.json({ error: "Thiếu roomName" }, { status: 400 });
  }

  const at = new AccessToken(config.apiKey, config.apiSecret, {
    identity: user.id,
    name: user.fullName,
    ttl: "4h",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({
    token,
    url: config.url,
    roomName,
    identity: user.id,
    configured: true,
  });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ configured: isLiveKitConfiguredSafe() });
}

function isLiveKitConfiguredSafe() {
  return getLiveKitConfig().configured;
}
