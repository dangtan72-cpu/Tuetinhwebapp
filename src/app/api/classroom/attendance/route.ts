import { NextResponse } from "next/server";
import { markAttendance } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    sessionId?: string;
  } | null;
  if (!body?.sessionId) {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 });
  }

  const record = await markAttendance({
    sessionId: body.sessionId,
    userId: user.id,
    fullName: user.fullName,
  });

  return NextResponse.json({
    ok: true,
    record: {
      sessionId: record.sessionId,
      userId: record.userId,
      checkedAt: record.checkedAt,
    },
  });
}
