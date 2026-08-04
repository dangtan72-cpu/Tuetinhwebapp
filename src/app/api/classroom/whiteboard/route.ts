import { NextResponse } from "next/server";
import { getClass, getSession } from "@/lib/classroom-store";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import {
  parseWhiteboardData,
  type WhiteboardStroke,
} from "@/lib/whiteboard";

async function assertSessionAccess(sessionId: string, userId: string, role: string) {
  const session = await getSession(sessionId);
  if (!session) return { error: "Không tìm thấy buổi học", status: 404 as const };

  const onlineClass = await getClass(session.classId);
  if (!onlineClass) return { error: "Không tìm thấy lớp", status: 404 as const };

  if (role === "teacher") {
    if (onlineClass.teacherId !== userId) {
      return { error: "Không có quyền", status: 403 as const };
    }
  } else if (!onlineClass.studentIds.includes(userId)) {
    return { error: "Không có quyền", status: 403 as const };
  }

  return { session, onlineClass };
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 });
  }

  const access = await assertSessionAccess(sessionId, user.id, user.role);
  if ("error" in access && access.error) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const row = await prisma.classSession.findUnique({
    where: { id: sessionId },
    select: { whiteboardData: true, updatedAt: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Không tìm thấy buổi học" }, { status: 404 });
  }

  return NextResponse.json({
    strokes: parseWhiteboardData(row.whiteboardData),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    sessionId?: string;
    action?: "append" | "clear";
    strokes?: WhiteboardStroke[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 });
  }

  const access = await assertSessionAccess(body.sessionId, user.id, user.role);
  if ("error" in access && access.error) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  if (body.action === "clear") {
    if (user.role !== "teacher") {
      return NextResponse.json(
        { error: "Chỉ giảng viên được xóa bảng" },
        { status: 403 },
      );
    }
    const row = await prisma.classSession.update({
      where: { id: body.sessionId },
      data: { whiteboardData: [] },
      select: { whiteboardData: true, updatedAt: true },
    });
    return NextResponse.json({
      strokes: parseWhiteboardData(row.whiteboardData),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  const incoming = parseWhiteboardData(body.strokes ?? []);
  if (incoming.length === 0) {
    return NextResponse.json({ error: "Không có nét vẽ" }, { status: 400 });
  }

  const existing = await prisma.classSession.findUnique({
    where: { id: body.sessionId },
    select: { whiteboardData: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy buổi học" }, { status: 404 });
  }

  const current = parseWhiteboardData(existing.whiteboardData);
  const known = new Set(current.map((s) => s.id));
  const merged = [
    ...current,
    ...incoming
      .filter((s) => !known.has(s.id))
      .map((s) => ({
        ...s,
        by: user.id,
        byName: user.fullName,
      })),
  ].slice(-800);

  const row = await prisma.classSession.update({
    where: { id: body.sessionId },
    data: { whiteboardData: merged },
    select: { whiteboardData: true, updatedAt: true },
  });

  return NextResponse.json({
    strokes: parseWhiteboardData(row.whiteboardData),
    updatedAt: row.updatedAt.toISOString(),
  });
}
