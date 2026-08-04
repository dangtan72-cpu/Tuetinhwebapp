export type UserRole = "student" | "teacher";

export type DemoUser = {
  id: string;
  email: string;
  studentId: string;
  fullName: string;
  program: string;
  className: string;
  cohort: string;
  role: UserRole;
};

export const DEMO_PASSWORD = "demo1234";

export const demoUsers: DemoUser[] = [
  {
    id: "1",
    email: "sv001@tuetinh.edu",
    studentId: "SV2024001",
    fullName: "Nguyễn Văn An",
    program: "Y học cổ truyền",
    className: "K36A1.2",
    cohort: "2024–2027",
    role: "student",
  },
  {
    id: "2",
    email: "sv002@tuetinh.edu",
    studentId: "SV2024002",
    fullName: "Trần Thị Bình",
    program: "Điều dưỡng",
    className: "K35D1",
    cohort: "2024–2026",
    role: "student",
  },
  {
    id: "t1",
    email: "gv001@tuetinh.edu",
    studentId: "GV001",
    fullName: "ThS. Nguyễn Minh Anh",
    program: "Y học cổ truyền",
    className: "Giảng viên",
    cohort: "—",
    role: "teacher",
  },
];

export const AUTH_COOKIE = "tuetinh_session";

export function findUserByLogin(login: string): DemoUser | undefined {
  const key = login.trim().toLowerCase();
  return demoUsers.find(
    (u) =>
      u.email.toLowerCase() === key || u.studentId.toLowerCase() === key,
  );
}

export function encodeSession(userId: string): string {
  return Buffer.from(JSON.stringify({ userId, ts: Date.now() }), "utf8").toString(
    "base64url",
  );
}

export function decodeSession(token: string): { userId: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(raw) as { userId?: string };
    if (!data.userId) return null;
    return { userId: data.userId };
  } catch {
    return null;
  }
}

export function getUserById(userId: string): DemoUser | undefined {
  return demoUsers.find((u) => u.id === userId);
}
