"use client";

import { usePathname } from "next/navigation";
import { PortalNav } from "@/components/portal-nav";
import type { DemoUser } from "@/lib/auth";

export function PortalNavClient({
  user,
  fallbackPath,
}: {
  user: DemoUser;
  fallbackPath: string;
}) {
  const pathname = usePathname() || fallbackPath;
  return <PortalNav user={user} pathname={pathname} />;
}
