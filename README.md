# Tuệ Tĩnh Webapp

Cổng thông tin & học vụ **Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội** — phong cách portal hiện đại (tham chiếu Singapore Polytechnic).

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tài khoản demo (cổng học sinh)

| Vai trò   | Email / MSSV        | Mật khẩu   |
|-----------|---------------------|------------|
| Học sinh  | `sv001@tuetinh.edu` | `demo1234` |
| Học sinh  | `SV2024001`         | `demo1234` |

## Modules

- **Marketing**: Trang chủ, ngành đào tạo, tuyển sinh, giới thiệu, tin tức, liên hệ
- **Tuyển sinh online**: Form đăng ký xét tuyển
- **Tra cứu văn bằng**: Công khai, không cần đăng nhập
- **Cổng học sinh** (`/portal`): Dashboard, lịch học, điểm, hồ sơ

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4
