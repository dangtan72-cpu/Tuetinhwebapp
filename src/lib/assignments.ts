import { prisma } from "@/lib/db";

export type AssignmentView = {
  id: string;
  classId: string;
  classCode: string;
  className: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  attachmentUrl: string | null;
  maxScore: number;
  dueAt: string;
  createdAt: string;
  submissionCount?: number;
  mySubmission?: SubmissionView | null;
};

export type SubmissionView = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  content: string;
  fileUrl: string | null;
  status: "submitted" | "graded" | "returned";
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  gradedAt: string | null;
};

function mapAssignment(row: {
  id: string;
  classId: string;
  authorId: string;
  title: string;
  description: string;
  attachmentUrl: string | null;
  maxScore: number;
  dueAt: Date;
  createdAt: Date;
  class: { code: string; name: string };
  author: { fullName: string };
  _count?: { submissions: number };
}): AssignmentView {
  return {
    id: row.id,
    classId: row.classId,
    classCode: row.class.code,
    className: row.class.name,
    authorId: row.authorId,
    authorName: row.author.fullName,
    title: row.title,
    description: row.description,
    attachmentUrl: row.attachmentUrl,
    maxScore: row.maxScore,
    dueAt: row.dueAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    submissionCount: row._count?.submissions,
  };
}

function mapSubmission(row: {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl: string | null;
  status: "submitted" | "graded" | "returned";
  score: number | null;
  feedback: string | null;
  submittedAt: Date;
  gradedAt: Date | null;
  student: { fullName: string; studentId: string };
}): SubmissionView {
  return {
    id: row.id,
    assignmentId: row.assignmentId,
    studentId: row.studentId,
    studentName: row.student.fullName,
    studentCode: row.student.studentId,
    content: row.content,
    fileUrl: row.fileUrl,
    status: row.status,
    score: row.score,
    feedback: row.feedback,
    submittedAt: row.submittedAt.toISOString(),
    gradedAt: row.gradedAt?.toISOString() ?? null,
  };
}

export function assignmentDueState(
  dueAt: string | Date,
  now = new Date(),
): "open" | "due_soon" | "overdue" {
  const due = new Date(dueAt).getTime();
  const t = now.getTime();
  if (t > due) return "overdue";
  if (due - t <= 48 * 60 * 60 * 1000) return "due_soon";
  return "open";
}

export async function listAssignmentsForStudent(
  userId: string,
): Promise<AssignmentView[]> {
  const rows = await prisma.assignment.findMany({
    where: { class: { enrollments: { some: { userId } } } },
    include: {
      class: true,
      author: true,
      submissions: {
        where: { studentId: userId },
        include: { student: true },
        take: 1,
      },
    },
    orderBy: { dueAt: "asc" },
  });

  return rows.map((row) => ({
    ...mapAssignment(row),
    mySubmission: row.submissions[0]
      ? mapSubmission(row.submissions[0])
      : null,
  }));
}

export async function listAssignmentsForClass(
  classId: string,
): Promise<AssignmentView[]> {
  const rows = await prisma.assignment.findMany({
    where: { classId },
    include: {
      class: true,
      author: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { dueAt: "asc" },
  });
  return rows.map(mapAssignment);
}

export async function listAssignmentsForTeacher(
  teacherId: string,
): Promise<AssignmentView[]> {
  const rows = await prisma.assignment.findMany({
    where: { class: { teacherId } },
    include: {
      class: true,
      author: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { dueAt: "asc" },
  });
  return rows.map(mapAssignment);
}

export async function getAssignment(
  assignmentId: string,
): Promise<AssignmentView | null> {
  const row = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      class: true,
      author: true,
      _count: { select: { submissions: true } },
    },
  });
  return row ? mapAssignment(row) : null;
}

export async function getAssignmentForStudent(
  assignmentId: string,
  studentId: string,
): Promise<AssignmentView | null> {
  const row = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      class: true,
      author: true,
      submissions: {
        where: { studentId },
        include: { student: true },
        take: 1,
      },
    },
  });
  if (!row) return null;
  return {
    ...mapAssignment(row),
    mySubmission: row.submissions[0]
      ? mapSubmission(row.submissions[0])
      : null,
  };
}

export async function createAssignment(input: {
  classId: string;
  authorId: string;
  title: string;
  description: string;
  attachmentUrl?: string | null;
  maxScore: number;
  dueAt: string;
}): Promise<AssignmentView> {
  const row = await prisma.assignment.create({
    data: {
      classId: input.classId,
      authorId: input.authorId,
      title: input.title,
      description: input.description,
      attachmentUrl: input.attachmentUrl || null,
      maxScore: input.maxScore,
      dueAt: new Date(input.dueAt),
    },
    include: {
      class: true,
      author: true,
      _count: { select: { submissions: true } },
    },
  });
  return mapAssignment(row);
}

export async function upsertSubmission(input: {
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string | null;
}): Promise<SubmissionView> {
  const row = await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: input.assignmentId,
        studentId: input.studentId,
      },
    },
    create: {
      assignmentId: input.assignmentId,
      studentId: input.studentId,
      content: input.content,
      fileUrl: input.fileUrl || null,
      status: "submitted",
      submittedAt: new Date(),
      score: null,
      feedback: null,
      gradedAt: null,
    },
    update: {
      content: input.content,
      fileUrl: input.fileUrl || null,
      status: "submitted",
      submittedAt: new Date(),
      score: null,
      feedback: null,
      gradedAt: null,
    },
    include: { student: true },
  });
  return mapSubmission(row);
}

export async function listSubmissions(
  assignmentId: string,
): Promise<SubmissionView[]> {
  const rows = await prisma.submission.findMany({
    where: { assignmentId },
    include: { student: true },
    orderBy: { submittedAt: "asc" },
  });
  return rows.map(mapSubmission);
}

export async function gradeSubmission(input: {
  submissionId: string;
  score: number;
  feedback?: string | null;
}): Promise<SubmissionView> {
  const row = await prisma.submission.update({
    where: { id: input.submissionId },
    data: {
      score: input.score,
      feedback: input.feedback || null,
      status: "graded",
      gradedAt: new Date(),
    },
    include: { student: true },
  });
  return mapSubmission(row);
}

export async function countPendingAssignmentsForStudent(
  userId: string,
): Promise<number> {
  return prisma.assignment.count({
    where: {
      class: { enrollments: { some: { userId } } },
      submissions: { none: { studentId: userId } },
      dueAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });
}
