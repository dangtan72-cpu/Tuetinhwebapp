import type {
  ClassSessionView,
  OnlineClassView,
} from "@/lib/classroom";
import { prisma } from "@/lib/db";

function mapClass(c: {
  id: string;
  code: string;
  name: string;
  program: string;
  description: string;
  teacherId: string;
  teacher: { fullName: string };
  enrollments: { userId: string }[];
}): OnlineClassView {
  return {
    id: c.id,
    code: c.code,
    name: c.name,
    program: c.program,
    description: c.description,
    teacherId: c.teacherId,
    teacherName: c.teacher.fullName,
    studentIds: c.enrollments.map((e) => e.userId),
  };
}

function mapSession(s: {
  id: string;
  classId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  status: "scheduled" | "live" | "ended";
  roomSlug: string;
  note: string | null;
  materials: {
    id: string;
    title: string;
    type: "pdf" | "link" | "video";
    url: string;
  }[];
}): ClassSessionView {
  return {
    id: s.id,
    classId: s.classId,
    title: s.title,
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
    status: s.status,
    roomSlug: s.roomSlug,
    note: s.note,
    materials: s.materials,
  };
}

export async function listClassesForStudent(
  userId: string,
): Promise<OnlineClassView[]> {
  const rows = await prisma.onlineClass.findMany({
    where: { enrollments: { some: { userId } } },
    include: { teacher: true, enrollments: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapClass);
}

export async function listClassesForTeacher(
  teacherId: string,
): Promise<OnlineClassView[]> {
  const rows = await prisma.onlineClass.findMany({
    where: { teacherId },
    include: { teacher: true, enrollments: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapClass);
}

export async function getClass(
  classId: string,
): Promise<OnlineClassView | null> {
  const row = await prisma.onlineClass.findUnique({
    where: { id: classId },
    include: { teacher: true, enrollments: true },
  });
  return row ? mapClass(row) : null;
}

export async function listSessions(
  classId: string,
): Promise<ClassSessionView[]> {
  const rows = await prisma.classSession.findMany({
    where: { classId },
    include: { materials: true },
    orderBy: { startsAt: "asc" },
  });
  return rows.map(mapSession);
}

export async function getSession(
  sessionId: string,
): Promise<ClassSessionView | null> {
  const row = await prisma.classSession.findUnique({
    where: { id: sessionId },
    include: { materials: true },
  });
  return row ? mapSession(row) : null;
}

export async function markAttendance(input: {
  sessionId: string;
  userId: string;
  fullName: string;
}) {
  return prisma.attendance.upsert({
    where: {
      sessionId_userId: {
        sessionId: input.sessionId,
        userId: input.userId,
      },
    },
    create: {
      sessionId: input.sessionId,
      userId: input.userId,
    },
    update: {},
    include: { user: true },
  });
}

export async function listAttendance(sessionId: string) {
  const rows = await prisma.attendance.findMany({
    where: { sessionId },
    include: { user: true },
    orderBy: { checkedAt: "asc" },
  });
  return rows.map((a) => ({
    sessionId: a.sessionId,
    userId: a.userId,
    fullName: a.user.fullName,
    checkedAt: a.checkedAt.toISOString(),
  }));
}

export async function hasCheckedIn(
  sessionId: string,
  userId: string,
): Promise<boolean> {
  const row = await prisma.attendance.findUnique({
    where: { sessionId_userId: { sessionId, userId } },
  });
  return Boolean(row);
}

export async function createClass(input: {
  name: string;
  code: string;
  program: string;
  teacherId: string;
  teacherName: string;
  description: string;
}): Promise<OnlineClassView> {
  // Auto-enroll first student demo if exists (for quick testing)
  const demoStudent = await prisma.user.findFirst({
    where: { email: "sv001@tuetinh.edu" },
  });

  const row = await prisma.onlineClass.create({
    data: {
      name: input.name,
      code: input.code,
      program: input.program,
      description: input.description,
      teacherId: input.teacherId,
      enrollments: demoStudent
        ? { create: [{ userId: demoStudent.id }] }
        : undefined,
    },
    include: { teacher: true, enrollments: true },
  });
  return mapClass(row);
}

export async function createSession(input: {
  classId: string;
  title: string;
  startsAt: string;
  endsAt: string;
}): Promise<ClassSessionView> {
  const row = await prisma.classSession.create({
    data: {
      classId: input.classId,
      title: input.title,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      status: "scheduled",
      roomSlug: `TueTinh-${input.classId.slice(-6)}-${Date.now()}`,
    },
    include: { materials: true },
  });
  return mapSession(row);
}

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
    },
  });
}

export async function listAdmissionApplications() {
  return prisma.admissionApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
