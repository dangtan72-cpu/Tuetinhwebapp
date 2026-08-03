import Image from "next/image";
import { school } from "@/lib/data";

export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
            About
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-brand-deep sm:text-4xl">
            Giới thiệu nhà trường
          </h1>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink/90 sm:text-base">
            <p>
              <strong>{school.name}</strong> kế thừa tinh thần đào tạo y dược cổ
              truyền gắn với thực tiễn chăm sóc sức khỏe cộng đồng. Mục tiêu của
              trường không chỉ truyền đạt kiến thức mà còn rèn luyện tay nghề,
              đạo đức nghề và năng lực hành nghề.
            </p>
            <p>
              Tiền thân gắn với lớp “Tấm Lòng Vàng”, nhà trường đã phát triển
              thành cơ sở đào tạo trung cấp và chứng chỉ ngắn hạn với nhiều
              ngành: Y học cổ truyền, Điều dưỡng, Châm cứu, Bào chế đông dược,
              Xoa bóp bấm huyệt và VLTL–PHCN.
            </p>
            <p>
              Webapp này được xây dựng theo hướng cổng trường hiện đại: thí
              sinh đăng ký xét tuyển online, học sinh theo dõi lịch học & kết
              quả, cộng đồng tra cứu văn bằng công khai.
            </p>
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-[420px]">
          <Image
            src={school.aboutImage}
            alt="Hình ảnh nhà trường Tuệ Tĩnh Hà Nội"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 45vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
