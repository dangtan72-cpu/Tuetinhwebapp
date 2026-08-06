import { NextResponse } from "next/server";
import { getApplicationByRefCode } from "@/lib/admissions";
import { createPaymentForApplication } from "@/lib/payments";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    refCode?: string;
    idNumber?: string;
  } | null;

  if (!body?.refCode || !body?.idNumber) {
    return NextResponse.json({ error: "Thiếu mã hồ sơ hoặc CCCD" }, { status: 400 });
  }

  const app = await getApplicationByRefCode(body.refCode);
  if (!app || app.idNumber !== body.idNumber.trim()) {
    return NextResponse.json({ error: "Không tìm thấy hồ sơ" }, { status: 404 });
  }

  if (app.status === "accepted") {
    return NextResponse.json({ error: "Hồ sơ đã được cấp MSSV" }, { status: 400 });
  }
  if (app.status === "rejected") {
    return NextResponse.json({ error: "Hồ sơ đã bị từ chối" }, { status: 400 });
  }

  const successPayment = app.payments.find((p) => p.status === "success");
  if (successPayment || app.status === "paid") {
    return NextResponse.json({
      ok: true,
      alreadyPaid: true,
      refCode: app.refCode,
    });
  }

  try {
    const { checkoutUrl, provider, payment } = await createPaymentForApplication(
      app.id,
    );
    return NextResponse.json({
      ok: true,
      checkoutUrl,
      provider,
      orderCode: payment.orderCode,
      amount: payment.amount,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Không tạo được thanh toán" },
      { status: 500 },
    );
  }
}
