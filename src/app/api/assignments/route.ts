import { NextResponse } from "next/server";
import {
  createAssignment,
  getAssignment,
  gradeSubmission,
  upsertSubmission,
} from "@/lib/assignments";
import { getClass } from "@/lib/classroom-store";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");

  if (action === "create") {
    if (user.role !== "teacher") {
      return NextResponse.json({ error: "Chỉ giảng viên" }, { status: 403 });
    }
    const classId = String(form.get("classId") ?? "");
    const onlineClass = await getClass(classId);
    if (!onlineClass || onlineClass.teacherId !== user.id) {
      return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    const title = String(form.get("title") ?? "").trim();
    const dueDate = String(form.get("dueDate") ?? "");
    const dueTime = String(form.get("dueTime") ?? "23:59");
    if (!title || !dueDate) {
      return NextResponse.redirect(
        new URL(`/portal/giang-day/${classId}/bai-tap?error=missing`, request.url),
        303,
      );
    }

    const maxScore = Number(form.get("maxScore") ?? 10);
    const assignment = await createAssignment({
      classId,
      authorId: user.id,
      title,
      description: String(form.get("description") ?? "").trim(),
      attachmentUrl: String(form.get("attachmentUrl") ?? "").trim() || null,
      maxScore: Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 10,
      dueAt: new Date(`${dueDate}T${dueTime}:00`).toISOString(),
    });

    return NextResponse.redirect(
      new URL(
        `/portal/giang-day/${classId}/bai-tap/${assignment.id}`,
        request.url,
      ),
      303,
    );
  }

  if (action === "submit") {
    if (user.role !== "student") {
      return NextResponse.json({ error: "Chỉ học sinh" }, { status: 403 });
    }
    const assignmentId = String(form.get("assignmentId") ?? "");
    const assignment = await getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
    }
    const onlineClass = await getClass(assignment.classId);
    if (!onlineClass?.studentIds.includes(user.id)) {
      return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    const content = String(form.get("content") ?? "").trim();
    const fileUrl = String(form.get("fileUrl") ?? "").trim() || null;
    if (!content && !fileUrl) {
      return NextResponse.redirect(
        new URL(`/portal/bai-tap/${assignmentId}?error=empty`, request.url),
        303,
      );
    }

    await upsertSubmission({
      assignmentId,
      studentId: user.id,
      content,
      fileUrl,
    });

    return NextResponse.redirect(
      new URL(`/portal/bai-tap/${assignmentId}?ok=1`, request.url),
      303,
    );
  }

  if (action === "grade") {
    if (user.role !== "teacher") {
      return NextResponse.json({ error: "Chỉ giảng viên" }, { status: 403 });
    }
    const assignmentId = String(form.get("assignmentId") ?? "");
    const submissionId = String(form.get("submissionId") ?? "");
    const assignment = await getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
    }
    const onlineClass = await getClass(assignment.classId);
    if (!onlineClass || onlineClass.teacherId !== user.id) {
      return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    }

    const score = Number(form.get("score"));
    if (!Number.isFinite(score) || score < 0 || score > assignment.maxScore) {
      return NextResponse.redirect(
        new URL(
          `/portal/giang-day/${assignment.classId}/bai-tap/${assignmentId}?error=score`,
          request.url,
        ),
        303,
      );
    }

    await gradeSubmission({
      submissionId,
      score,
      feedback: String(form.get("feedback") ?? "").trim() || null,
    });

    return NextResponse.redirect(
      new URL(
        `/portal/giang-day/${assignment.classId}/bai-tap/${assignmentId}?graded=1`,
        request.url,
      ),
      303,
    );
  }

  return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 });
}
