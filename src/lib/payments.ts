import crypto from "crypto";
import { prisma } from "@/lib/db";
import type { PaymentView } from "@/lib/admissions";

export function getPaymentConfig() {
  const provider = (process.env.PAYMENT_PROVIDER ?? "mock").trim().toLowerCase();
  return {
    provider: provider === "vnpay" ? "vnpay" : "mock",
    vnpay: {
      tmnCode: process.env.VNPAY_TMN_CODE?.trim() ?? "",
      hashSecret: process.env.VNPAY_HASH_SECRET?.trim() ?? "",
      url:
        process.env.VNPAY_URL?.trim() ??
        "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      returnUrl: process.env.VNPAY_RETURN_URL?.trim() ?? "",
      ipnUrl: process.env.VNPAY_IPN_URL?.trim() ?? "",
    },
  };
}

function mapPayment(row: {
  id: string;
  applicationId: string;
  amount: number;
  orderCode: string;
  provider: string;
  status: PaymentView["status"];
  transactionId: string | null;
  paidAt: Date | null;
  createdAt: Date;
}): PaymentView {
  return {
    id: row.id,
    applicationId: row.applicationId,
    amount: row.amount,
    orderCode: row.orderCode,
    provider: row.provider,
    status: row.status,
    transactionId: row.transactionId,
    paidAt: row.paidAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

function buildOrderCode(refCode: string): string {
  const suffix = Date.now().toString(36).slice(-6).toUpperCase();
  return `${refCode.replace(/-/g, "")}-${suffix}`;
}

export async function createPaymentForApplication(applicationId: string) {
  const app = await prisma.admissionApplication.findUnique({
    where: { id: applicationId },
  });
  if (!app) throw new Error("Không tìm thấy hồ sơ");
  if (app.status === "accepted") {
    throw new Error("Hồ sơ đã được cấp MSSV");
  }
  if (app.status === "rejected") {
    throw new Error("Hồ sơ đã bị từ chối");
  }

  const config = getPaymentConfig();
  const orderCode = buildOrderCode(app.refCode);

  const payment = await prisma.payment.create({
    data: {
      applicationId: app.id,
      amount: app.admissionFee,
      orderCode,
      provider: config.provider,
      status: "pending",
    },
  });

  if (config.provider === "vnpay" && config.vnpay.tmnCode && config.vnpay.hashSecret) {
    const checkoutUrl = buildVnpayUrl({
      amount: payment.amount,
      orderCode: payment.orderCode,
      orderInfo: `Le phi xet tuyen ${app.refCode}`,
      returnUrl: config.vnpay.returnUrl,
      tmnCode: config.vnpay.tmnCode,
      hashSecret: config.vnpay.hashSecret,
      vnpUrl: config.vnpay.url,
    });
    return { payment: mapPayment(payment), checkoutUrl, provider: "vnpay" as const };
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const checkoutUrl = `${base}/tuyen-sinh/thanh-toan/xac-nhan?order=${encodeURIComponent(payment.orderCode)}`;

  return { payment: mapPayment(payment), checkoutUrl, provider: "mock" as const };
}

function buildVnpayUrl(input: {
  amount: number;
  orderCode: string;
  orderInfo: string;
  returnUrl: string;
  tmnCode: string;
  hashSecret: string;
  vnpUrl: string;
}): string {
  const createDate = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const expire = new Date(Date.now() + 15 * 60 * 1000)
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: input.tmnCode,
    vnp_Amount: String(input.amount * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: input.orderCode.slice(0, 100),
    vnp_OrderInfo: input.orderInfo,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: input.returnUrl,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expire,
  };

  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");

  const secureHash = crypto
    .createHmac("sha512", input.hashSecret)
    .update(sorted)
    .digest("hex");

  return `${input.vnpUrl}?${sorted}&vnp_SecureHash=${secureHash}`;
}

export async function confirmPayment(
  orderCode: string,
  transactionId?: string,
): Promise<PaymentView | null> {
  const payment = await prisma.payment.findUnique({
    where: { orderCode },
    include: { application: true },
  });
  if (!payment) return null;
  if (payment.status === "success") return mapPayment(payment);

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "success",
        transactionId: transactionId ?? `MOCK-${Date.now()}`,
        paidAt: new Date(),
      },
    });
    if (
      payment.application.status === "pending" ||
      payment.application.status === "contacted"
    ) {
      await tx.admissionApplication.update({
        where: { id: payment.applicationId },
        data: { status: "paid" },
      });
    }
    return p;
  });

  return mapPayment(updated);
}

export async function getPaymentByOrderCode(orderCode: string) {
  const row = await prisma.payment.findUnique({ where: { orderCode } });
  return row ? mapPayment(row) : null;
}

export function verifyVnpayReturn(query: Record<string, string>): boolean {
  const config = getPaymentConfig();
  if (!config.vnpay.hashSecret) return false;
  const secureHash = query.vnp_SecureHash;
  if (!secureHash) return false;

  const params = { ...query };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");

  const hash = crypto
    .createHmac("sha512", config.vnpay.hashSecret)
    .update(sorted)
    .digest("hex");

  return hash === secureHash && query.vnp_ResponseCode === "00";
}
