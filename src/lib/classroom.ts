export type ClassMaterial = {
  id: string;
  title: string;
  type: "pdf" | "link" | "video";
  url: string;
};

export type ClassSessionView = {
  id: string;
  classId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "live" | "ended";
  roomSlug: string;
  materials: ClassMaterial[];
  note?: string | null;
};

export type OnlineClassView = {
  id: string;
  code: string;
  name: string;
  program: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  description: string;
};

export function sessionState(
  session: { startsAt: string | Date; endsAt: string | Date; status: string },
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

export function formatSessionTime(iso: string | Date): string {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
