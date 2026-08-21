import Link from "next/link";
import { schoolPhones } from "@/lib/data";

/** Khối địa chỉ / SĐT gọn — tránh xuống nhiều dòng không cần thiết */
export function ContactLines({
  address,
  email,
  tone = "dark",
}: {
  address: string;
  email: string;
  tone?: "dark" | "light";
}) {
  const muted = tone === "dark" ? "text-white/70" : "text-muted";
  const strong = tone === "dark" ? "text-white/90" : "text-ink";
  const link =
    tone === "dark"
      ? "text-white/90 underline-offset-2 hover:underline"
      : "text-brand hover:text-brand-deep";

  return (
    <div className={`space-y-1.5 text-sm leading-snug ${muted}`}>
      <p className={strong}>
        <span className="opacity-70">Địa chỉ: </span>
        {address}
      </p>
      <p className={strong}>
        <span className="opacity-70">Tel: </span>
        {schoolPhones.map((p, i) => (
          <span key={p.number}>
            {i > 0 ? <span className="opacity-50"> / </span> : null}
            <span className="opacity-80">{p.label} </span>
            <a href={`tel:${p.number}`} className={link}>
              {p.number}
            </a>
          </span>
        ))}
      </p>
      <p className={strong}>
        <span className="opacity-70">Email: </span>
        <a href={`mailto:${email}`} className={`${link} break-all`}>
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
