import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type AdmissionView = {
  id: string;
  refCode: string;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  education: string;
  level: string;
  program: string;
  status: "pending" | "paid" | "contacted" | "accepted" | "rejected";
  admissionFee: number;
  userId: string | null;
  issuedStudentId: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  latestPayment?: {
    orderCode: string;
    status: string;
    paidAt: string | null;
    amount: number;
  } | null;
};

export type PaymentView = {
  id: string;
  applicationId: string;
  amount: number;
  orderCode: string;
  provider: string;
  status: "pending" | "success" | "failed" | "cancelled";
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
};

function mapAdmission(row: {
  id: string;
  refCode: string;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  education: string;
  level: string;
  program: string;
  status: AdmissionView["status"];
  admissionFee: number;
  userId: string | null;
  issuedStudentId: string | null;
  adminNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  payments?: {
    orderCode: string;
    status: string;
    paidAt: Date | null;
    amount: number;
  }[];
}): AdmissionView {
  const latest = row.payments?.[0];
  return {
    id: row.id,
    refCode: row.refCode,
    fullName: row.fullName,
    idNumber: row.idNumber,
    phone: row.phone,
    email: row.email,
    education: row.education,
    level: row.level,
    program: row.program,
    status: row.status,
    admissionFee: row.admissionFee,
    userId: row.userId,
    issuedStudentId: row.issuedStudentId,
    adminNote: row.adminNote,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    latestPayment: latest
      ? {
          orderCode: latest.orderCode,
          status: latest.status,
          paidAt: latest.paidAt?.toISOString() ?? null,
          amount: latest.amount,
        }
      : null,
  };
}

export const ADMISSION_STATUS_LABEL: Record<AdmissionView["status"], string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  contacted: "Đã liên hệ",
  accepted: "Đã cấp MSSV",
  rejected: "Từ chối",
};

export async function createAdmissionApplication(input: {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  education: string;
  level: string;
  program: string;
}) {
  const refCode = `TT-DK-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;
  return prisma.admissionApplication.create({
    data: {
      refCode,
      ...input,
      admissionFee: 500_000,
    },
  });
}

export async function listAdmissionApplications(): Promise<AdmissionView[]> {
  const rows = await prisma.admissionApplication.findMany({
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map(mapAdmission);
}

export async function getAdmissionApplication(
  id: string,
): Promise<AdmissionView | null> {
  const row = await prisma.admissionApplication.findUnique({
    where: { id },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  return row ? mapAdmission(row) : null;
}

export async function lookupAdmission(
  refCode: string,
  idNumber: string,
): Promise<AdmissionView | null> {
  const row = await prisma.admissionApplication.findFirst({
    where: {
      refCode: refCode.trim(),
      idNumber: idNumber.trim(),
    },
    include: {
      payments: {
        where: { status: "success" },
        orderBy: { paidAt: "desc" },
        take: 1,
      },
    },
  });
  return row ? mapAdmission(row) : null;
}

export async function getApplicationByRefCode(refCode: string) {
  return prisma.admissionApplication.findUnique({
    where: { refCode: refCode.trim() },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function updateAdmissionStatus(
  id: string,
  status: AdmissionView["status"],
  adminNote?: string | null,
) {
  return prisma.admissionApplication.update({
    where: { id },
    data: {
      status,
      adminNote: adminNote ?? undefined,
    },
  });
}

export async function generateStudentId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SV${year}`;
  const last = await prisma.user.findFirst({
    where: { studentId: { startsWith: prefix } },
    orderBy: { studentId: "desc" },
  });
  let next = 1;
  if (last) {
    const num = parseInt(last.studentId.slice(prefix.length), 10);
    if (Number.isFinite(num)) next = num + 1;
  }
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function acceptAdmissionApplication(
  id: string,
  input: { className?: string; cohort?: string; adminNote?: string },
): Promise<{
  studentId: string;
  email: string;
  tempPassword: string;
}> {
  const app = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!app) throw new Error("Không tìm thấy hồ sơ");
  if (app.status === "accepted") {
    throw new Error("Hồ sơ đã được cấp MSSV");
  }
  if (app.status === "rejected") {
    throw new Error("Hồ sơ đã bị từ chối");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: app.email, mode: "insensitive" } },
        { studentId: app.issuedStudentId ?? "" },
      ],
    },
  });
  if (existingUser && app.userId !== existingUser.id) {
    throw new Error("Email đã có tài khoản trong hệ thống");
  }

  const year = new Date().getFullYear();
  const studentId = app.issuedStudentId ?? (await generateStudentId());
  const tempPassword = generateTempPassword();
  const cohort = input.cohort || `${year}–${year + 3}`;

  const user = app.userId
    ? await prisma.user.update({
        where: { id: app.userId },
        data: {
          fullName: app.fullName,
          program: app.program,
          className: input.className || "Chờ phân lớp",
          cohort,
          passwordHash: hashPassword(tempPassword),
        },
      })
    : await prisma.user.create({
        data: {
          email: app.email.toLowerCase(),
          studentId,
          passwordHash: hashPassword(tempPassword),
          fullName: app.fullName,
          program: app.program,
          className: input.className || "Chờ phân lớp",
          cohort,
          role: "student",
        },
      });

  await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: "accepted",
      userId: user.id,
      issuedStudentId: user.studentId,
      adminNote: input.adminNote ?? app.adminNote,
    },
  });

  return {
    studentId: user.studentId,
    email: user.email,
    tempPassword,
  };
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
