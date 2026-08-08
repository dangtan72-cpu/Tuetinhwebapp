import Link from "next/link";
import { redirect } from "next/navigation";
import { AiAdminChat } from "@/components/ai-admin-chat";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const metadata = { title: "AI Orchestrator" };

export default async function AiAdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/dang-nhap");
  if (!isAdmin(user)) redirect("/portal");

  const recent = await prisma.adminActionLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { actor: { select: { fullName: true } } },
  });

  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Admin tool
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold text-brand-deep">
            AI Orchestrator
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Công cụ riêng để quản lý nội dung web, duyệt/sửa tài khoản, đăng tin,
            hồ sơ tuyển sinh. Không thay đổi giao diện/CSS.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-paper px-3 py-2 text-xs text-muted">
          Chế độ AI:{" "}
          <strong className="text-ink">
            {hasOpenAI ? "OpenAI" : "Lệnh tiếng Việt / JSON"}
          </strong>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <AiAdminChat />

        <aside className="space-y-4">
          <section className="rounded-xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">Lối tắt quản trị</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/portal/cms" className="text-brand hover:underline">
                  CMS thủ công →
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/ho-so-tuyen-sinh"
                  className="text-brand hover:underline"
                >
                  Hồ sơ tuyển sinh →
                </Link>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-line bg-paper p-4">
            <h2 className="text-sm font-semibold text-ink">Nhật ký gần đây</h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Chưa có thao tác.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-xs">
                {recent.map((log) => (
                  <li key={log.id} className="border-t border-line pt-2 first:border-0 first:pt-0">
                    <p className="font-medium text-ink">{log.summary}</p>
                    <p className="mt-0.5 text-muted">
                      {log.action} · {log.actor.fullName} ·{" "}
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
