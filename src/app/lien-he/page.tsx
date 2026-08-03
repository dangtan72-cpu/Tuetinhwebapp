import { school } from "@/lib/data";

export const metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        Contact
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Liên hệ
      </h1>
      <p className="mt-3 text-muted">
        Phòng Đào tạo tiếp nhận tư vấn tuyển sinh và hỗ trợ học vụ.
      </p>

      <dl className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6">
        {[
          ["Đơn vị", school.name],
          ["Điện thoại", school.phone],
          ["Email", school.email],
          ["Địa chỉ", school.address],
          ["Facebook", school.facebook],
          ["YouTube", school.youtube],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-muted">
              {label}
            </dt>
            <dd className="mt-1 break-all font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
