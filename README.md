# Tuệ Tĩnh Webapp

Cổng thông tin & học vụ **Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội** — phong cách portal hiện đại (tham chiếu Singapore Polytechnic) + MVP lớp học online.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tài khoản demo

| Vai trò      | Email / MSSV          | Mật khẩu   |
|--------------|-----------------------|------------|
| Học sinh     | `sv001@tuetinh.edu`   | `demo1234` |
| Giảng viên   | `gv001@tuetinh.edu`   | `demo1234` |

## Modules

- **Marketing**: Trang chủ, ngành đào tạo, tuyển sinh, giới thiệu, tin tức, liên hệ
- **Tuyển sinh online**: Form đăng ký xét tuyển
- **Tra cứu văn bằng**: Công khai
- **Cổng học sinh**: Dashboard, lịch học, điểm, hồ sơ, **lớp học online**
- **MVP lớp online (kiểu ClassIn nhẹ)**:
  - Giảng viên tạo lớp / lên lịch buổi học
  - Phòng học **Jitsi** (camera/mic)
  - Điểm danh + tài liệu buổi học

## Lộ trình nâng cấp (ClassIn)

1. SDK video riêng (LiveKit / Agora) thay Jitsi public
2. Bảng trắng, chia nhóm, giơ tay, quiz trực tiếp
3. Ghi hình buổi học + bài tập / nộp bài
4. Database thật + phân quyền đầy đủ

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Jitsi Meet (embed)
