// Định nghĩa kiểu dữ liệu
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

// Dữ liệu mock cho nhân viên
export const employees: Employee[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    position: 'Quản lý sản xuất',
    department: 'Sản xuất',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    status: 'active'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    position: 'Nhân viên kiểm hàng',
    department: 'Kho vải',
    email: 'tranthib@example.com',
    phone: '0912345678',
    status: 'active'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    position: 'Nhân viên cắt vải',
    department: 'Sản xuất',
    email: 'levanc@example.com',
    phone: '0923456789',
    status: 'active'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    position: 'Quản lý kho',
    department: 'Kho vải',
    email: 'phamthid@example.com',
    phone: '0934567890',
    status: 'active'
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    position: 'Nhân viên QC',
    department: 'Kiểm soát chất lượng',
    email: 'hoangvane@example.com',
    phone: '0945678901',
    status: 'active'
  },
  {
    id: 6,
    name: 'Ngô Thị F',
    position: 'Nhân viên kiểm hàng',
    department: 'Kho vải',
    email: 'ngothif@example.com',
    phone: '0956789012',
    status: 'inactive'
  }
]; 