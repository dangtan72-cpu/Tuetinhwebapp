import { NextResponse } from "next/server";
import { isAdmin, isStaff } from "@/lib/auth";
import { runOrchestratorChat } from "@/lib/ai-orchestrator/chat";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || (!isAdmin(user) && !isStaff(user))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Chỉ admin dùng orchestrator đầy đủ; teacher có thể xem CMS nhưng AI admin = admin
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: "Chỉ tài khoản admin dùng AI Orchestrator" },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    message?: string;
  } | null;
  if (!body?.message?.trim()) {
    return NextResponse.json({ error: "Thiếu message" }, { status: 400 });
  }

  const result = await runOrchestratorChat({
    message: body.message,
    actorId: user.id,
  });

  return NextResponse.json(result);
}
