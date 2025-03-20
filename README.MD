# ERP Quản lý May Mặc

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

Hệ thống ERP quản lý sản xuất ngành may mặc được xây dựng với [Refine](https://github.com/refinedev/refine) và [Supabase](https://supabase.com/).

## Thiết lập môi trường

### 1. Cấu hình Supabase

1. Tạo một tài khoản tại [Supabase](https://supabase.com/)
2. Tạo một dự án mới
3. Tạo cơ sở dữ liệu bằng cách chạy các tập lệnh SQL trong thư mục `src/db/`
   - Đầu tiên là `schema.sql` để tạo cấu trúc bảng
   - Tiếp theo là `rls-policies.sql` để thiết lập chính sách truy cập

### 2. Cấu hình biến môi trường

1. Tạo một file `.env.local` ở thư mục gốc dự án
2. Thêm các biến môi trường sau và thay thế bằng thông tin dự án Supabase của bạn:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Lấy thông tin này từ Project Settings > API trong dashboard Supabase.

## Getting Started

### Khởi chạy môi trường phát triển

```bash
pnpm dev
```

### Build cho môi trường production

```bash
pnpm build
```

### Chạy ứng dụng production

```bash
pnpm start
```

## Tính năng chính

1. Quản lý nhà cung cấp
2. Quản lý nguyên vật liệu
3. Quản lý đơn hàng sản xuất
4. Theo dõi tiến độ sản xuất
5. Quản lý thành phẩm
6. Quản lý nhân viên và năng suất

## Cấu trúc thư mục

- `src/db/` - Schema và SQL scripts
- `src/app/` - Mã nguồn của ứng dụng Next.js
- `src/utils/` - Tiện ích và hàm helper
- `src/providers/` - Cấu hình Refine providers

## Learn More

Để tìm hiểu thêm về **Refine**, hãy xem [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Tailwind CSS** [Docs](https://refine.dev/docs/guides-concepts/general-concepts/#headless-concept)

## License

MIT
