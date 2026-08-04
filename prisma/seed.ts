import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function daysFromNow(days: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  await prisma.attendance.deleteMany();
  await prisma.sessionMaterial.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.onlineClass.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = hashPassword("demo1234");

  const student1 = await prisma.user.create({
    data: {
      email: "sv001@tuetinh.edu",
      studentId: "SV2024001",
      passwordHash,
      fullName: "Nguyễn Văn An",
      program: "Y học cổ truyền",
      className: "K36A1.2",
      cohort: "2024–2027",
      role: "student",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "sv002@tuetinh.edu",
      studentId: "SV2024002",
      passwordHash,
      fullName: "Trần Thị Bình",
      program: "Điều dưỡng",
      className: "K35D1",
      cohort: "2024–2026",
      role: "student",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: "gv001@tuetinh.edu",
      studentId: "GV001",
      passwordHash,
      fullName: "ThS. Nguyễn Minh Anh",
      program: "Y học cổ truyền",
      className: "Giảng viên",
      cohort: "—",
      role: "teacher",
    },
  });

  const class1 = await prisma.onlineClass.create({
    data: {
      code: "YHCT-K36A1",
      name: "Lý luận YHCT cơ bản (online)",
      program: "Y học cổ truyền",
      description:
        "Lớp ôn tập lý luận YHCT: học trực tuyến, tài liệu buổi học và điểm danh.",
      teacherId: teacher.id,
      enrollments: {
        create: [{ userId: student1.id }, { userId: student2.id }],
      },
    },
  });

  const class2 = await prisma.onlineClass.create({
    data: {
      code: "CC-K36",
      name: "Thực hành châm cứu (lý thuyết online)",
      program: "Kỹ thuật châm cứu",
      description: "Buổi học online bổ trợ trước giờ thực hành tại lab.",
      teacherId: teacher.id,
      enrollments: {
        create: [{ userId: student1.id }],
      },
    },
  });

  await prisma.classSession.create({
    data: {
      classId: class1.id,
      title: "Buổi 1: Âm dương – Ngũ hành",
      startsAt: daysFromNow(0, 8, 0),
      endsAt: daysFromNow(0, 9, 30),
      status: "live",
      roomSlug: "TueTinh-YHCT-Buoi1",
      note: "Mang theo giáo trình tập 1. Camera bật khi điểm danh.",
      materials: {
        create: [
          {
            title: "Slide Âm dương – Ngũ hành",
            type: "pdf",
            url: "https://yduoctuetinhhanoi.edu.vn/tai-lieu",
          },
          {
            title: "Video ôn tập nhanh",
            type: "video",
            url: "https://www.youtube.com/@yduoctuetinhhanoi",
          },
        ],
      },
    },
  });

  await prisma.classSession.create({
    data: {
      classId: class1.id,
      title: "Buổi 2: Tạng phủ – Kinh lạc",
      startsAt: daysFromNow(2, 8, 0),
      endsAt: daysFromNow(2, 9, 30),
      status: "scheduled",
      roomSlug: "TueTinh-YHCT-Buoi2",
      materials: {
        create: [
          {
            title: "Đề cương buổi 2",
            type: "link",
            url: "https://yduoctuetinhhanoi.edu.vn/",
          },
        ],
      },
    },
  });

  await prisma.classSession.create({
    data: {
      classId: class2.id,
      title: "Buổi ôn: An toàn kỹ thuật châm cứu",
      startsAt: daysFromNow(1, 14, 0),
      endsAt: daysFromNow(1, 15, 30),
      status: "scheduled",
      roomSlug: "TueTinh-ChamCuu-On1",
    },
  });

  await prisma.admissionApplication.create({
    data: {
      refCode: "TT-DK-2026-1001",
      fullName: "Lê Minh Cường",
      idNumber: "001234567890",
      phone: "0901234567",
      email: "leminhcuong@example.com",
      education: "Tốt nghiệp THPT",
      level: "Trung cấp",
      program: "Y học cổ truyền",
      status: "pending",
    },
  });

  console.log("Seed OK:", {
    students: [student1.email, student2.email],
    teacher: teacher.email,
    classes: [class1.code, class2.code],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
