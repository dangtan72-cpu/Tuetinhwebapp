import Link from "next/link";
import { schoolPhones } from "@/lib/data";

/** Địa chỉ / SĐT — mỗi thông tin một dòng */
export function ContactLines({
  address,
  email,
  tone = "dark",
  showLabels = true,
}: {
  address: string;
  email: string;
  tone?: "dark" | "light";
  showLabels?: boolean;
}) {
  const strong = tone === "dark" ? "text-white/90" : "text-ink";
  const label = tone === "dark" ? "text-white/60" : "text-muted";
  const link =
    tone === "dark"
      ? "text-white/90 underline-offset-2 hover:underline"
      : "text-brand hover:text-brand-deep";

  return (
    <div className={`space-y-1 text-sm leading-normal ${strong}`}>
      <p className="whitespace-nowrap overflow-x-auto">
        {showLabels ? <span className={label}>Địa chỉ: </span> : null}
        {address}
      </p>
      <p className="whitespace-nowrap overflow-x-auto">
        {showLabels ? <span className={label}>Tel: </span> : null}
        {schoolPhones.map((p, i) => (
          <span key={p.number}>
            {i > 0 ? " / " : null}
            {p.label}{" "}
            <a href={`tel:${p.number}`} className={link}>
              {p.number}
            </a>
          </span>
        ))}
      </p>
      <p className="whitespace-nowrap overflow-x-auto">
        {showLabels ? <span className={label}>Email: </span> : null}
        <a href={`mailto:${email}`} className={link}>
          {email}
        </a>
      </p>
    </div>
  );
}

export function ContactCtaPhones({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {schoolPhones.map((p) => (
        <a
          key={p.number}
          href={`tel:${p.number}`}
          className="inline-flex items-center rounded-md border border-white/30 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
        >
          {p.label}: {p.number}
        </a>
      ))}
      <Link
        href="/tuyen-sinh/dang-ky"
        className="inline-flex items-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
      >
        Đăng ký online
      </Link>
    </div>
  );
}
