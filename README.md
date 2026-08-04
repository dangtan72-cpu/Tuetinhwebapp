# Tuệ Tĩnh Webapp

Cổng thông tin & học vụ **Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội** — portal hiện đại + lớp học online + **PostgreSQL**.

## Chạy local

```bash
# 1) Postgres đang chạy, tạo DB (ví dụ)
# createdb tuetinh

# 2) Cấu hình
cp .env.example .env
# sửa DATABASE_URL cho đúng

# 3) Migrate + seed + chạy app
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tài khoản demo (sau seed)

| Vai trò    | Email               | Mật khẩu   |
|------------|---------------------|------------|
| Học sinh   | `sv001@tuetinh.edu` | `demo1234` |
| Giảng viên | `gv001@tuetinh.edu` | `demo1234` |

## Modules

- Marketing / tuyển sinh / tra cứu văn bằng
- Cổng học sinh & giảng viên
- **Lớp học online** (Jitsi + điểm danh + tài liệu) — lưu DB
- **Hồ sơ tuyển sinh** lưu PostgreSQL
- **CMS nội dung** (`/portal/cms`): cài đặt trường (logo/ảnh/tagline) + CRUD tin tức

## Database (Prisma + PostgreSQL)

Bảng chính: `User`, `OnlineClass`, `Enrollment`, `ClassSession`, `SessionMaterial`, `Attendance`, `AdmissionApplication`, `SiteSettings`, `NewsArticle`

## Lộ trình tiếp

1. ~~Database thật~~ ✅
2. ~~Admin CMS nội dung / ảnh~~ ✅
3. Phòng học LiveKit/Agora + bảng trắng
4. Bài tập / nộp bài

## Stack

Next.js 16 · Prisma 7 · PostgreSQL · Tailwind CSS v4 · Jitsi
