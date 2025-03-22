-- Bảng users để lưu trữ thông tin người dùng và vai trò
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'staff',
    department TEXT,
    position TEXT,
    phone_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Bật RLS cho bảng users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies cho bảng users
-- Admin có thể đọc và chỉnh sửa tất cả người dùng
CREATE POLICY "Admins có quyền đầy đủ với users" 
    ON public.users
    USING (auth.jwt() ->> 'role' = 'admin');

-- Managers có thể xem tất cả người dùng
CREATE POLICY "Managers có thể xem tất cả người dùng" 
    ON public.users FOR SELECT
    USING (auth.jwt() ->> 'role' = 'manager');

-- Người dùng thông thường chỉ có thể xem thông tin của chính mình
CREATE POLICY "Người dùng có thể xem thông tin của chính mình" 
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Người dùng có thể cập nhật một số thông tin cá nhân của họ
CREATE POLICY "Người dùng có thể cập nhật thông tin cá nhân" 
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        -- Không cho phép thay đổi role, is_active hoặc email
        (role IS NULL) AND
        (is_active IS NULL) AND
        (email IS NULL)
    );

-- Tạo function để tự động tạo bản ghi trong bảng users khi người dùng đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        coalesce(NEW.raw_user_meta_data->>'full_name', NEW.email),
        coalesce(NEW.raw_user_meta_data->>'role', 'staff'),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger để kích hoạt function khi có người dùng mới
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 