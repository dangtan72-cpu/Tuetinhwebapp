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
- **Lớp học online** (LiveKit hoặc Jitsi + bảng trắng + điểm danh + tài liệu)
- **Bài tập / nộp bài / chấm điểm** (`/portal/bai-tap`)
- **Tuyển sinh online**: đăng ký → thanh toán lệ phí → tra cứu → GV cấp MSSV
- **Hồ sơ tuyển sinh** lưu PostgreSQL
- **CMS nội dung** (`/portal/cms`): cài đặt trường (logo/ảnh/tagline) + CRUD tin tức

## Phòng học LiveKit + bảng trắng

1. (Tuỳ chọn) Tạo project tại [LiveKit Cloud](https://cloud.livekit.io), điền vào `.env`:
   - `LIVEKIT_URL` (ví dụ `wss://xxx.livekit.cloud`)
   - `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`
2. Nếu chưa cấu hình LiveKit → tự dùng **Jitsi** cho video.
3. **Bảng trắng** luôn bật: nét vẽ đồng bộ qua PostgreSQL (poll ~2s). Giảng viên có nút xóa bảng.
4. Trong buổi học: chuyển layout **Video + bảng / Chỉ video / Chỉ bảng**.

## Database (Prisma + PostgreSQL)

Bảng chính: `User`, `OnlineClass`, `Enrollment`, `ClassSession` (+ `whiteboardData`), `SessionMaterial`, `Attendance`, `Assignment`, `Submission`, `AdmissionApplication`, `SiteSettings`, `NewsArticle`

## Lộ trình tiếp

1. ~~Database thật~~ ✅
2. ~~Admin CMS nội dung / ảnh~~ ✅
3. ~~Phòng học LiveKit + bảng trắng~~ ✅
4. ~~Bài tập / nộp bài~~ ✅
5. ~~Thanh toán tuyển sinh + cấp MSSV~~ ✅
6. Upload file trực tiếp · VNPay production · role admin · deploy

## Tuyển sinh + thanh toán

1. Thí sinh đăng ký tại `/tuyen-sinh/dang-ky` → nhận mã `TT-DK-...`
2. Thanh toán tại `/tuyen-sinh/thanh-toan` (demo: `PAYMENT_PROVIDER=mock`)
3. Tra cứu tại `/tuyen-sinh/tra-cuu` (mã hồ sơ + CCCD)
4. GV duyệt tại `/portal/ho-so-tuyen-sinh` → **Cấp MSSV** (tạo tài khoản portal)

VNPay thật: đặt `PAYMENT_PROVIDER=vnpay` và điền `VNPAY_*` trong `.env`.

## Deploy production (Vercel)

1. Tạo Postgres (Neon/Supabase) → lấy `DATABASE_URL`
2. `vercel` project + set env:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL=https://www.yduoctuetinh.com.vn`
   - `PAYMENT_PROVIDER=mock` (hoặc `vnpay` + key)
3. Build chạy `prisma migrate deploy` (xem `vercel.json`)
4. Trỏ DNS:
   - `www` → CNAME `cname.vercel-dns.com`
   - apex `@` → A `76.76.21.21` (hoặc theo hướng dẫn Vercel)

**Lưu ý:** domain hiện đang WordPress tại `180.93.1.227` — đổi DNS sẽ thay site cũ.
