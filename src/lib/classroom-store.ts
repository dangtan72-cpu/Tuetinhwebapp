import {
  seedClasses,
  seedSessions,
  type ClassSession,
  type OnlineClass,
} from "@/lib/classroom";

type AttendanceRecord = {
  sessionId: string;
  userId: string;
  fullName: string;
  checkedAt: string;
};

type Store = {
  classes: OnlineClass[];
  sessions: ClassSession[];
  attendance: AttendanceRecord[];
};

declare global {
  var __tuetinhClassroomStore: Store | undefined;
}

function getStore(): Store {
  if (!globalThis.__tuetinhClassroomStore) {
    globalThis.__tuetinhClassroomStore = {
      classes: structuredClone(seedClasses),
      sessions: structuredClone(seedSessions),
      attendance: [],
    };
  }
  return globalThis.__tuetinhClassroomStore;
}

export function listClassesForStudent(userId: string): OnlineClass[] {
  return getStore().classes.filter((c) => c.studentIds.includes(userId));
}

export function listClassesForTeacher(teacherId: string): OnlineClass[] {
  return getStore().classes.filter((c) => c.teacherId === teacherId);
}

export function getClass(classId: string): OnlineClass | undefined {
  return getStore().classes.find((c) => c.id === classId);
}

export function listSessions(classId: string): ClassSession[] {
  return getStore()
    .sessions.filter((s) => s.classId === classId)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getSession(sessionId: string): ClassSession | undefined {
  return getStore().sessions.find((s) => s.id === sessionId);
}

export function markAttendance(input: {
  sessionId: string;
  userId: string;
  fullName: string;
}): AttendanceRecord {
  const store = getStore();
  const existing = store.attendance.find(
    (a) => a.sessionId === input.sessionId && a.userId === input.userId,
  );
  if (existing) return existing;

  const record: AttendanceRecord = {
    ...input,
    checkedAt: new Date().toISOString(),
  };
  store.attendance.push(record);
  return record;
}

export function listAttendance(sessionId: string): AttendanceRecord[] {
  return getStore().attendance.filter((a) => a.sessionId === sessionId);
}

export function hasCheckedIn(sessionId: string, userId: string): boolean {
  return getStore().attendance.some(
    (a) => a.sessionId === sessionId && a.userId === userId,
  );
}

export function createClass(input: {
  name: string;
  code: string;
  program: string;
  teacherId: string;
  teacherName: string;
  description: string;
}): OnlineClass {
  const store = getStore();
  const onlineClass: OnlineClass = {
    id: `c${Date.now()}`,
    code: input.code,
    name: input.name,
    program: input.program,
    teacherId: input.teacherId,
    teacherName: input.teacherName,
    studentIds: ["1"],
    description: input.description,
  };
  store.classes.unshift(onlineClass);
  return onlineClass;
}

export function createSession(input: {
  classId: string;
  title: string;
  startsAt: string;
  endsAt: string;
}): ClassSession {
  const store = getStore();
  const session: ClassSession = {
    id: `s${Date.now()}`,
    classId: input.classId,
    title: input.title,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    status: "scheduled",
    roomSlug: `TueTinh-${input.classId}-${Date.now()}`,
    materials: [],
  };
  store.sessions.push(session);
  return session;
}
