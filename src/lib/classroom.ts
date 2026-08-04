export type ClassMaterial = {
  id: string;
  title: string;
  type: "pdf" | "link" | "video";
  url: string;
};

export type ClassSession = {
  id: string;
  classId: string;
  title: string;
  startsAt: string; // ISO
  endsAt: string;
  status: "scheduled" | "live" | "ended";
  roomSlug: string;
  materials: ClassMaterial[];
  note?: string;
};

export type OnlineClass = {
  id: string;
  code: string;
  name: string;
  program: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  description: string;
};

function daysFromNow(days: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const seedClasses: OnlineClass[] = [
  {
    id: "c1",
    code: "YHCT-K36A1",
    name: "Lý luận YHCT cơ bản (online)",
    program: "Y học cổ truyền",
    teacherId: "t1",
    teacherName: "ThS. Nguyễn Minh Anh",
    studentIds: ["1", "2"],
    description:
      "Lớp ôn tập lý luận YHCT: học trực tuyến, tài liệu buổi học và điểm danh.",
  },
  {
    id: "c2",
    code: "CC-K36",
    name: "Thực hành châm cứu (lý thuyết online)",
    program: "Kỹ thuật châm cứu",
    teacherId: "t1",
    teacherName: "ThS. Nguyễn Minh Anh",
    studentIds: ["1"],
    description:
      "Buổi học online bổ trợ trước giờ thực hành tại lab.",
  },
];

export const seedSessions: ClassSession[] = [
  {
    id: "s1",
    classId: "c1",
    title: "Buổi 1: Âm dương – Ngũ hành",
    startsAt: daysFromNow(0, 8, 0),
    endsAt: daysFromNow(0, 9, 30),
    status: "live",
    roomSlug: "TueTinh-YHCT-Buoi1",
    note: "Mang theo giáo trình tập 1. Camera bật khi điểm danh.",
    materials: [
      {
        id: "m1",
        title: "Slide Âm dương – Ngũ hành",
        type: "pdf",
        url: "https://yduoctuetinhhanoi.edu.vn/tai-lieu",
      },
      {
        id: "m2",
        title: "Video ôn tập nhanh",
        type: "video",
        url: "https://www.youtube.com/@yduoctuetinhhanoi",
      },
    ],
  },
  {
    id: "s2",
    classId: "c1",
    title: "Buổi 2: Tạng phủ – Kinh lạc",
    startsAt: daysFromNow(2, 8, 0),
    endsAt: daysFromNow(2, 9, 30),
    status: "scheduled",
    roomSlug: "TueTinh-YHCT-Buoi2",
    materials: [
      {
        id: "m3",
        title: "Đề cương buổi 2",
        type: "link",
        url: "https://yduoctuetinhhanoi.edu.vn/",
      },
    ],
  },
  {
    id: "s3",
    classId: "c2",
    title: "Buổi ôn: An toàn kỹ thuật châm cứu",
    startsAt: daysFromNow(1, 14, 0),
    endsAt: daysFromNow(1, 15, 30),
    status: "scheduled",
    roomSlug: "TueTinh-ChamCuu-On1",
    materials: [],
  },
];

export function sessionState(
  session: ClassSession,
  now = new Date(),
): "upcoming" | "live" | "ended" {
  const start = new Date(session.startsAt).getTime();
  const end = new Date(session.endsAt).getTime();
  const t = now.getTime();
  if (session.status === "ended" || t > end) return "ended";
  if (session.status === "live" || (t >= start - 15 * 60 * 1000 && t <= end)) {
    return "live";
  }
  return "upcoming";
}

export function formatSessionTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
