import { NextResponse } from "next/server";
import { lookupAdmission } from "@/lib/admissions";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    refCode?: string;
    idNumber?: string;
  } | null;

  if (!body?.refCode || !body?.idNumber) {
    return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  }

  const app = await lookupAdmission(body.refCode, body.idNumber);
  if (!app) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, application: app });
}
