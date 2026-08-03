import { redirect } from "next/navigation";
import { PortalNavClient } from "@/components/portal-nav-client";
import { getSessionUser } from "@/lib/session";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap?next=/portal");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper md:grid md:grid-cols-[240px_1fr]">
        <PortalNavClient user={user} fallbackPath="/portal" />
        <div className="bg-surface p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
