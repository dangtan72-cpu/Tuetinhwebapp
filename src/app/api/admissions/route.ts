import { NextResponse } from "next/server";
import { createAdmissionApplication } from "@/lib/classroom-store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    fullName?: string;
    idNumber?: string;
    phone?: string;
    email?: string;
    education?: string;
    level?: string;
    program?: string;
  } | null;

  if (
    !body?.fullName ||
    !body.idNumber ||
    !body.phone ||
    !body.email ||
    !body.education ||
    !body.level ||
    !body.program
  ) {
    return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  }

  const app = await createAdmissionApplication({
    fullName: body.fullName.trim(),
    idNumber: body.idNumber.trim(),
    phone: body.phone.trim(),
    email: body.email.trim(),
    education: body.education,
    level: body.level,
    program: body.program,
  });

  return NextResponse.json({ ok: true, refCode: app.refCode, id: app.id });
}
