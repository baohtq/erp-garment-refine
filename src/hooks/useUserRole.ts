import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from '@utils/supabase/client';
import { UserRole } from '@utils/supabase/constants';

/**
 * Hook lấy vai trò của người dùng hiện tại
 * @returns Vai trò của người dùng hiện tại hoặc null nếu chưa đăng nhập
 */
export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        console.log('Đang lấy thông tin người dùng...');
        
        // Kiểm tra session
        const { data: sessionData, error: sessionError } = await supabaseBrowserClient.auth.getSession();
        
        if (sessionError) {
          console.error('Lỗi khi lấy session:', sessionError);
          setError(sessionError);
          setRole(null);
          setLoading(false);
          return;
        }
        
        console.log('Session data:', sessionData?.session ? 'Có session' : 'Không có session');
        
        if (!sessionData?.session) {
          console.log('Không có phiên đăng nhập hợp lệ');
          setRole(null);
          setLoading(false);
          return;
        }
        
        // Lấy thông tin người dùng từ session
        const { data: { user }, error: userError } = await supabaseBrowserClient.auth.getUser();
        
        if (userError) {
          console.error('Lỗi khi lấy thông tin người dùng:', userError);
          setError(userError);
          setRole(null);
          setLoading(false);
          return;
        }

        if (!user) {
          console.log('Không tìm thấy thông tin người dùng, đang đặt role = null');
          setRole(null);
          setLoading(false);
          return;
        }

        console.log('Đã lấy được thông tin người dùng:', user.id);
        console.log('User metadata:', JSON.stringify(user.user_metadata));

        // Lấy thông tin vai trò từ bảng users
        try {
          const { data: userData, error: dbError } = await supabaseBrowserClient
            .from('users')
            .select('role, is_active')
            .eq('id', user.id)
            .single();

          if (dbError) {
            console.error('Lỗi khi truy vấn role từ database:', dbError);
            
            // Nếu có lỗi với DB, kiểm tra xem có role trong metadata không
            if (user.user_metadata?.role) {
              console.log('Sử dụng role từ metadata vì không lấy được từ database:', user.user_metadata.role);
              setRole(user.user_metadata.role as UserRole);
              setLoading(false);
              return;
            }
            
            throw dbError;
          }

          // Nếu tài khoản bị vô hiệu hóa
          if (userData && userData.is_active === false) {
            console.log('Tài khoản đã bị vô hiệu hóa');
            setRole(null);
            setLoading(false);
            return;
          }

          if (userData && userData.role) {
            console.log('Đã lấy được role từ database:', userData.role);
            setRole(userData.role as UserRole);
            setLoading(false);
            return;
          } 
        } catch (dbFetchError) {
          console.error('Lỗi khi truy vấn database:', dbFetchError);
          // Xử lý lỗi truy vấn database
        }
        
        // Nếu không lấy được vai trò từ database, thử lấy từ metadata
        if (user.user_metadata?.role) {
          console.log('Sử dụng role từ metadata:', user.user_metadata.role);
          setRole(user.user_metadata.role as UserRole);
          setLoading(false);
          return;
        }
        
        // Mặc định là STAFF nếu không có thông tin vai trò
        console.log('Không tìm thấy role, sử dụng vai trò mặc định STAFF');
        setRole(UserRole.STAFF);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin vai trò:', err);
        setError(err as Error);
        setRole(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchUserRole();

    // Lắng nghe sự thay đổi trạng thái xác thực
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setInitialized(false); // Reset initialized để có thể fetch lại khi trạng thái auth thay đổi
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchUserRole();
        } else if (event === 'SIGNED_OUT') {
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  return { 
    role, 
    loading, 
    error, 
    isAdmin: role === UserRole.ADMIN,
    isManager: role === UserRole.MANAGER,
    isStaff: role === UserRole.STAFF
  };
} 