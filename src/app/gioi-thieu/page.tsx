import { school } from "@/lib/data";

export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
        About
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
        Giới thiệu nhà trường
      </h1>
      <div className="prose-muted mt-8 space-y-5 text-[15px] leading-relaxed text-ink/90 sm:text-base">
        <p>
          <strong>{school.name}</strong> kế thừa tinh thần đào tạo y dược cổ
          truyền gắn với thực tiễn chăm sóc sức khỏe cộng đồng. Mục tiêu của
          trường không chỉ truyền đạt kiến thức mà còn rèn luyện tay nghề, đạo
          đức nghề và năng lực hành nghề.
        </p>
        <p>
          Tiền thân gắn với lớp “Tấm Lòng Vàng”, nhà trường đã phát triển thành
          cơ sở đào tạo trung cấp và chứng chỉ ngắn hạn với nhiều ngành: Y học
          cổ truyền, Điều dưỡng, Châm cứu, Bào chế đông dược, Xoa bóp bấm huyệt
          và VLTL–PHCN.
        </p>
        <p>
          Webapp này được xây dựng theo hướng cổng trường hiện đại: thí sinh
          đăng ký xét tuyển online, học sinh theo dõi lịch học & kết quả, cộng
          đồng tra cứu văn bằng công khai.
        </p>
      </div>
    </div>
  );
}
