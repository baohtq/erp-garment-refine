"use client";

import React, { useEffect, useState } from "react";
import { RefineClient } from "../client";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";
import { UserRole } from "@/utils/supabase/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/utils/supabase/client";

const UserManagementPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { isAdmin, loading, role } = useUserRole();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<string>('Đang kiểm tra phiên đăng nhập...');

  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra session
    const checkSession = async () => {
      try {
        const { data, error } = await supabaseBrowserClient.auth.getSession();
        if (error) {
          console.error("Lỗi khi kiểm tra phiên đăng nhập:", error);
          setSessionStatus('Lỗi khi kiểm tra phiên đăng nhập');
          return;
        }
        
        if (!data.session) {
          console.log("Người dùng chưa đăng nhập");
          setSessionStatus('Chưa đăng nhập');
          toast.error("Vui lòng đăng nhập để tiếp tục");
          router.push("/login");
          return;
        }
        
        setSessionStatus('Đã đăng nhập');
      } catch (err) {
        console.error("Lỗi khi kiểm tra phiên đăng nhập:", err);
        setSessionStatus('Lỗi khi kiểm tra phiên đăng nhập');
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
    
    // Nếu không phải admin, chuyển hướng về trang chủ
    if (!loading && !isAdmin) {
      console.log("User role:", role, "isAdmin:", isAdmin);
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, loading, router, role]);

  if (!isClient || checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Đang tải...</p>
          <p className="mt-1 text-sm text-gray-500">{sessionStatus}</p>
          {loading && <p className="mt-1 text-sm text-gray-500">Đang kiểm tra quyền người dùng...</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Đang kiểm tra quyền người dùng...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="mt-2 text-lg font-medium text-gray-900">Bạn không có quyền truy cập</p>
          <p className="mt-1 text-sm text-gray-500">Đang chuyển hướng về trang chủ...</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <RefineClient>
      <UserManagement />
      <ToastContainer />
    </RefineClient>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STAFF);
  const [processingAction, setProcessingAction] = useState(false);

  // Tải danh sách người dùng
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers();
      if (result.success && result.data) {
        setUsers(result.data as IUser[]);
      } else {
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Xử lý thay đổi vai trò
  const handleRoleChange = async () => {
    if (!editingUser) return;
    
    setProcessingAction(true);
    try {
      const result = await userService.changeUserRole(editingUser.id, selectedRole);
      if (result.success) {
        toast.success(`Đã thay đổi vai trò thành ${selectedRole}`);
        // Cập nhật danh sách người dùng
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, role: selectedRole } : user
        ));
        setShowModal(false);
      } else {
        toast.error("Không thể thay đổi vai trò người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi vai trò:", error);
      toast.error("Lỗi khi thay đổi vai trò");
    } finally {
      setProcessingAction(false);
    }
  };

  // Xử lý kích hoạt/vô hiệu hóa người dùng
  const handleToggleActive = async (user: IUser) => {
    setProcessingAction(true);
    try {
      const result = user.is_active 
        ? await userService.deactivateUser(user.id) 
        : await userService.activateUser(user.id);
      
      if (result.success) {
        toast.success(`Đã ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} người dùng`);
        // Cập nhật danh sách người dùng
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, is_active: !user.is_active } : u
        ));
      } else {
        toast.error(`Không thể ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} người dùng`);
      }
    } catch (error) {
      console.error(`Lỗi khi ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} người dùng:`, error);
      toast.error(`Lỗi khi ${user.is_active ? 'vô hiệu hóa' : 'kích hoạt'} người dùng`);
    } finally {
      setProcessingAction(false);
    }
  };

  // Modal thay đổi vai trò
  const RoleChangeModal = () => {
    if (!showModal || !editingUser) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-medium">Thay đổi vai trò người dùng</h3>
          <p className="mb-4">Thay đổi vai trò cho: <span className="font-medium">{editingUser.email}</span></p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleRoleChange}
              disabled={processingAction}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              {processingAction ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render bảng người dùng
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Quản lý người dùng</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Đăng ký</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200">
                        {user.avatar_url ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.role === UserRole.ADMIN 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === UserRole.MANAGER 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setSelectedRole(user.role);
                        setShowModal(true);
                      }}
                      className="mr-2 text-blue-600 hover:text-blue-900"
                    >
                      Vai trò
                    </button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      disabled={processingAction}
                      className={user.is_active 
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'}
                    >
                      {user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <RoleChangeModal />
    </div>
  );
};

export default UserManagementPage; 