import { demoGrades } from "@/lib/data";

export const metadata = { title: "Kết quả học tập" };

export default function GradesPage() {
  const gpa =
    demoGrades.reduce((s, g) => s + g.total * g.credits, 0) /
    demoGrades.reduce((s, g) => s + g.credits, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-brand-deep">
        Kết quả học tập
      </h1>
      <p className="mt-1 text-muted">
        Điểm trung bình tích lũy:{" "}
        <span className="font-semibold text-brand-deep">{gpa.toFixed(2)}</span>
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-soft/70 text-brand-deep">
            <tr>
              <th className="px-4 py-3 font-semibold">Mã HP</th>
              <th className="px-4 py-3 font-semibold">Học phần</th>
              <th className="px-4 py-3 font-semibold">TC</th>
              <th className="px-4 py-3 font-semibold">GK</th>
              <th className="px-4 py-3 font-semibold">CK</th>
              <th className="px-4 py-3 font-semibold">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {demoGrades.map((g) => (
              <tr key={g.code} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{g.code}</td>
                <td className="px-4 py-3">{g.subject}</td>
                <td className="px-4 py-3">{g.credits}</td>
                <td className="px-4 py-3">{g.midterm.toFixed(1)}</td>
                <td className="px-4 py-3">{g.final.toFixed(1)}</td>
                <td className="px-4 py-3 font-semibold text-brand-deep">
                  {g.total.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
