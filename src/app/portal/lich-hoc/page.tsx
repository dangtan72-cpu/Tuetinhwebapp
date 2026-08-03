import { demoSchedule } from "@/lib/data";

export const metadata = { title: "Lịch học" };

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

export default function SchedulePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Lịch học tuần
      </h1>
      <p className="mt-1 text-muted">
        Thời khóa biểu học kỳ hiện tại (dữ liệu demo).
      </p>

      <div className="mt-8 space-y-6">
        {days.map((day) => {
          const items = demoSchedule.filter((s) => s.day === day);
          if (items.length === 0) return null;
          return (
            <section key={day}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
                {day}
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-line bg-paper px-4 py-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-ink">{item.subject}</p>
                        <p className="text-sm text-muted">{item.teacher}</p>
                      </div>
                      <div className="text-sm text-muted sm:text-right">
                        <p>{item.time}</p>
                        <p>{item.room}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
