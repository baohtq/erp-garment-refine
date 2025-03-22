# ERP Quản lý May Mặc

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

Hệ thống ERP quản lý sản xuất ngành may mặc được xây dựng với [Refine](https://github.com/refinedev/refine) và [Supabase](https://supabase.com/).

## Hướng dẫn thiết lập và chạy ERP Refine + Supabase

### 1. Cài đặt các phụ thuộc

```bash
npm install
```

### 2. Cấu hình Supabase

- Tạo tài khoản tại [Supabase](https://supabase.com/)
- Tạo một dự án mới
- Sao chép thông tin URL và API key từ mục Settings > API
- Tạo file .env.local tại thư mục gốc và thêm các biến môi trường:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Thiết lập cơ sở dữ liệu

Chạy các migration SQL để thiết lập cơ sở dữ liệu:

1. Truy cập vào dự án Supabase của bạn
2. Mở SQL Editor
3. Chạy các file SQL theo thứ tự sau:
   - `src/utils/supabase/migrations/01_auth_users.sql`
   - `src/utils/supabase/migrations/02_create_profiles_table.sql`
   - `src/db/schema.sql`
   - `src/db/rls-policies.sql`

### 4. Chạy ứng dụng phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ http://localhost:3000.

### 5. Đăng nhập và khởi tạo người dùng đầu tiên

1. Đăng ký tài khoản admin đầu tiên
2. Sử dụng SQL Editor của Supabase để cập nhật quyền admin:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'your_user_id';
```

### 6. Xây dựng ứng dụng cho môi trường production

```bash
npm run build
```

### 7. Khởi chạy ứng dụng production

```bash
npm start
```

## Kiến trúc ứng dụng

Ứng dụng sử dụng các công nghệ sau:

- **Next.js 14**: Framework React với App Router
- **Refine**: Framework headless CRUD cho ứng dụng admin
- **Supabase**: Backend-as-a-Service với PostgreSQL
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Thư viện components dựa trên Radix UI

## Khắc phục lỗi

### Lỗi "relation "public.profiles" does not exist"

Nếu bạn gặp lỗi này, hãy chạy migration `src/utils/supabase/migrations/02_create_profiles_table.sql` để tạo bảng profiles trong Supabase.

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
