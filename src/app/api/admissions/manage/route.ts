import { NextResponse } from "next/server";
import {
  acceptAdmissionApplication,
  updateAdmissionStatus,
} from "@/lib/admissions";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ error: "Chỉ giảng viên / cán bộ" }, { status: 403 });
  }

  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const applicationId = String(form.get("applicationId") ?? "");

  if (!applicationId) {
    return NextResponse.json({ error: "Thiếu applicationId" }, { status: 400 });
  }

  if (action === "contacted") {
    await updateAdmissionStatus(applicationId, "contacted", String(form.get("adminNote") ?? "") || null);
    return NextResponse.redirect(
      new URL(`/portal/ho-so-tuyen-sinh/${applicationId}?ok=contacted`, request.url),
      303,
    );
  }

  if (action === "reject") {
    await updateAdmissionStatus(
      applicationId,
      "rejected",
      String(form.get("adminNote") ?? "") || null,
    );
    return NextResponse.redirect(
      new URL(`/portal/ho-so-tuyen-sinh/${applicationId}?ok=rejected`, request.url),
      303,
    );
  }

  if (action === "accept") {
    try {
      const result = await acceptAdmissionApplication(applicationId, {
        className: String(form.get("className") ?? "").trim() || undefined,
        cohort: String(form.get("cohort") ?? "").trim() || undefined,
        adminNote: String(form.get("adminNote") ?? "").trim() || undefined,
      });
      const url = new URL(
        `/portal/ho-so-tuyen-sinh/${applicationId}`,
        request.url,
      );
      url.searchParams.set("ok", "accepted");
      url.searchParams.set("mssv", result.studentId);
      url.searchParams.set("pwd", result.tempPassword);
      return NextResponse.redirect(url, 303);
    } catch (e) {
      const url = new URL(
        `/portal/ho-so-tuyen-sinh/${applicationId}?error=${encodeURIComponent(e instanceof Error ? e.message : "Lỗi")}`,
        request.url,
      );
      return NextResponse.redirect(url, 303);
    }
  }

  return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 });
}
