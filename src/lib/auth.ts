export type UserRole = "student" | "teacher" | "admin";

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

/** CMS / tuyển sinh / AI orchestrator */
export function isStaff(user: { role: UserRole } | null | undefined): boolean {
  return user?.role === "teacher" || user?.role === "admin";
}

export function isAdmin(user: { role: UserRole } | null | undefined): boolean {
  return user?.role === "admin";
}

export const DEMO_PASSWORD = "demo1234";
export const AUTH_COOKIE = "tuetinh_session";

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
