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
  await prisma.adminActionLog.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.sessionMaterial.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.onlineClass.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.siteSettings.deleteMany();
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

  const admin = await prisma.user.create({
    data: {
      email: "admin@tuetinh.edu",
      studentId: "AD001",
      passwordHash,
      fullName: "Quản trị hệ thống",
      program: "—",
      className: "Admin",
      cohort: "—",
      role: "admin",
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

  const assignment1 = await prisma.assignment.create({
    data: {
      classId: class1.id,
      authorId: teacher.id,
      title: "Bài tập 1: Tóm tắt Âm dương – Ngũ hành",
      description:
        "Viết đoạn ngắn (150–250 từ) giải thích mối quan hệ Âm–Dương và ứng dụng trong YHCT. Có thể đính kèm link file Word/PDF.",
      attachmentUrl: "https://yduoctuetinhhanoi.edu.vn/tai-lieu",
      maxScore: 10,
      dueAt: daysFromNow(5, 23, 59),
    },
  });

  await prisma.assignment.create({
    data: {
      classId: class1.id,
      authorId: teacher.id,
      title: "Bài tập 2: Sơ đồ Tạng phủ",
      description:
        "Vẽ hoặc mô tả sơ đồ ngũ tạng lục phủ và mối liên hệ kinh lạc. Nộp link ảnh/PDF.",
      maxScore: 10,
      dueAt: daysFromNow(10, 23, 59),
    },
  });

  await prisma.assignment.create({
    data: {
      classId: class2.id,
      authorId: teacher.id,
      title: "Checklist an toàn trước khi châm",
      description:
        "Liệt kê ít nhất 8 bước kiểm tra an toàn kỹ thuật trước buổi thực hành.",
      maxScore: 10,
      dueAt: daysFromNow(3, 23, 59),
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: student2.id,
      content:
        "Âm dương là hai mặt đối lập nhưng thống nhất… (bài demo đã nộp).",
      fileUrl: null,
      status: "submitted",
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
      status: "paid",
      payments: {
        create: {
          amount: 500_000,
          orderCode: "TTDK20261001-DEMO01",
          provider: "mock",
          status: "success",
          transactionId: "MOCK-SEED-001",
          paidAt: new Date(),
        },
      },
    },
  });

  await prisma.admissionApplication.create({
    data: {
      refCode: "TT-DK-2026-1002",
      fullName: "Phạm Thu Hà",
      idNumber: "009876543210",
      phone: "0912345678",
      email: "phamthuha@example.com",
      education: "Tốt nghiệp THPT",
      level: "Trung cấp",
      program: "Điều dưỡng",
      status: "pending",
    },
  });

  await prisma.siteSettings.create({
    data: {
      id: "default",
      name: "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội – TamvangHub",
      shortName: "Tuệ Tĩnh · TamvangHub",
      tagline:
        "TamvangHub - Cổng tuyển sinh của Trường trung cấp y dược Tuệ Tĩnh Hà Nội.",
      phone: "Mr. Việt 0987000743 / Mr. Kiên 0988991688",
      email: "daotao@yduoctuetinh.edu.vn",
      address: "Số 12 Phố Hoàng Cầu, phường Ô Chợ Dừa, Hà Nội",
      facebook: "https://www.facebook.com/YDuocTueTinhHaNoi",
      youtube: "http://www.youtube.com/@yduoctuetinhhanoi",
      logoUrl: "/brand/logo.webp",
      logoIconUrl: "/brand/logo-icon.png",
      heroImageUrl: "/gallery/campus-1.webp",
      aboutImageUrl: "/gallery/campus-2.webp",
      admissionsImageUrl: "/gallery/admissions-banner.webp",
      aboutText:
        "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội kế thừa tinh thần đào tạo y dược cổ truyền gắn với thực tiễn chăm sóc sức khỏe cộng đồng.\nMục tiêu của trường không chỉ truyền đạt kiến thức mà còn rèn luyện tay nghề, đạo đức nghề và năng lực hành nghề.\nTrải qua hơn 35 năm xây dựng và phát triển, nhà trường đào tạo hệ trung cấp và các mã ngành ngắn hạn, gắn lý thuyết với thực hành tại lab, cơ sở dưỡng sinh và vườn thuốc nam.",
    },
  });

  await prisma.newsArticle.createMany({
    data: [
      {
        slug: "cau-chuyen-buoi-sang-thang-7",
        title: "Câu chuyện về một buổi sáng tháng 7 đầy xúc động",
        category: "Hoạt động",
        excerpt:
          "Không gian ấm cúng tại trường ghi lại khoảnh khắc gắn kết giữa thầy cô và sinh viên.",
        body: "Trong một buổi sáng tháng 7, thầy cô và sinh viên Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội cùng chia sẻ khoảnh khắc gắn kết tại khuôn viên trường.\n\nKhông khí ấm cúng thể hiện tinh thần “Tấm Lòng Vàng” – quan tâm người học không chỉ trên lớp mà còn trong đời sống cộng đồng nhà trường.",
        imageUrl: "/gallery/news-1.webp",
        published: true,
        publishedAt: new Date("2026-07-26"),
      },
      {
        slug: "ngay-hoi-viec-lam-nguoi-cao-tuoi",
        title:
          "Tham gia Ngày hội tư vấn, giới thiệu việc làm cho người cao tuổi 2026",
        category: "Cộng đồng",
        excerpt:
          "Nhà trường đồng hành tư vấn sức khỏe và hướng nghiệp cho người cao tuổi tại Hà Nội.",
        body: "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội tham gia Ngày hội tư vấn, giới thiệu việc làm cho người cao tuổi năm 2026 tại Hà Nội.\n\nTại gian hàng, nhà trường tư vấn sức khỏe YHCT, giới thiệu chương trình ngắn hạn phù hợp và chia sẻ cơ hội hướng nghiệp trong lĩnh vực chăm sóc sức khỏe cộng đồng.",
        imageUrl: "/gallery/campus-extra-7348.webp",
        published: true,
        publishedAt: new Date("2026-07-20"),
      },
      {
        slug: "lop-k36a1-thao-duoc",
        title: "Lớp K36A1.2 và hành trình chạm vào thảo dược",
        category: "Đào tạo",
        excerpt:
          "Sinh viên trải nghiệm nhận diện và sử dụng thảo dược qua buổi học thực tế.",
        body: "Sinh viên lớp K36A1.2 có buổi học thực tế nhận diện và sử dụng thảo dược tại cơ sở / vườn thuốc đối tác của nhà trường.\n\nQua trải nghiệm trực tiếp, người học kết nối lý thuyết dược liệu với thực tiễn bào chế và ứng dụng YHCT.",
        imageUrl: "/gallery/activity-thao-duoc.webp",
        published: true,
        publishedAt: new Date("2026-07-12"),
      },
      {
        slug: "thong-bao-tuyen-sinh-2026-2027",
        title: "Thông báo tuyển sinh năm học 2026–2027",
        category: "Tuyển sinh",
        excerpt:
          "Mở đăng ký các mã ngành dài hạn và ngắn hạn cho năm học mới.",
        body: "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội thông báo tuyển sinh năm học 2026–2027 các mã ngành trung cấp (chính quy, vừa làm vừa học) và đào tạo ngắn hạn cấp chứng chỉ.\n\nThí sinh xem chi tiết mã ngành, học phí ngắn hạn, hồ sơ và đăng ký xét tuyển trực tuyến trên cổng nhà trường.",
        imageUrl: "/gallery/admissions-banner.webp",
        published: true,
        publishedAt: new Date("2026-06-15"),
      },
    ],
  });

  console.log("Seed OK:", {
    students: [student1.email, student2.email],
    teacher: teacher.email,
    admin: admin.email,
    classes: [class1.code, class2.code],
    assignments: 3,
    cms: true,
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
