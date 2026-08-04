import type { DemoUser, UserRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

function toDemoUser(user: {
  id: string;
  email: string;
  studentId: string;
  fullName: string;
  program: string;
  className: string;
  cohort: string;
  role: UserRole;
}): DemoUser {
  return {
    id: user.id,
    email: user.email,
    studentId: user.studentId,
    fullName: user.fullName,
    program: user.program,
    className: user.className,
    cohort: user.cohort,
    role: user.role,
  };
}

export async function findUserByLogin(login: string): Promise<DemoUser | null> {
  const key = login.trim();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: key, mode: "insensitive" } },
        { studentId: { equals: key, mode: "insensitive" } },
      ],
    },
  });
  return user ? toDemoUser(user) : null;
}

export async function authenticateUser(
  login: string,
  password: string,
): Promise<DemoUser | null> {
  const key = login.trim();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: key, mode: "insensitive" } },
        { studentId: { equals: key, mode: "insensitive" } },
      ],
    },
  });
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return toDemoUser(user);
}

export async function getUserById(userId: string): Promise<DemoUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toDemoUser(user) : null;
}
