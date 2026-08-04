import { NextResponse } from "next/server";
import { createClass, createSession } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Chỉ giảng viên" }, { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  if (action === "create-class") {
    const onlineClass = createClass({
      name: String(form.get("name") ?? "").trim(),
      code: String(form.get("code") ?? "").trim(),
      program: String(form.get("program") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      teacherId: user.id,
      teacherName: user.fullName,
    });
    return NextResponse.redirect(
      new URL(`/portal/giang-day/${onlineClass.id}`, request.url),
      303,
    );
  }

  if (action === "create-session") {
    const classId = String(form.get("classId") ?? "");
    const title = String(form.get("title") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const startTime = String(form.get("startTime") ?? "08:00");
    const endTime = String(form.get("endTime") ?? "09:30");
    const startsAt = new Date(`${date}T${startTime}:00`).toISOString();
    const endsAt = new Date(`${date}T${endTime}:00`).toISOString();
    createSession({ classId, title, startsAt, endsAt });
    return NextResponse.redirect(
      new URL(`/portal/giang-day/${classId}`, request.url),
      303,
    );
  }

  return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 });
}
