import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeSession, type DemoUser } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export async function getSessionUser(): Promise<DemoUser | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const session = decodeSession(token);
  if (!session) return null;
  return getUserById(session.userId);
}
