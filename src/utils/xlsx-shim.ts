import * as XLSX from 'xlsx';

/**
 * Đây là một shim (thư viện giả lập) cho xlsx
 * Sử dụng trong trường hợp không thể cài đặt thư viện
 */

// Định nghĩa các hàm đơn giản để tránh lỗi runtime
const utils = {
  sheet_to_json: (worksheet: any) => {
    console.warn('xlsx shim: sheet_to_json được gọi, nhưng thư viện xlsx không được cài đặt.');
    return [];
  },
  json_to_sheet: (data: any) => {
    console.warn('xlsx shim: json_to_sheet được gọi, nhưng thư viện xlsx không được cài đặt.');
    return {};
  },
  book_new: () => {
    console.warn('xlsx shim: book_new được gọi, nhưng thư viện xlsx không được cài đặt.');
    return {};
  },
  book_append_sheet: (workbook: any, worksheet: any, name: string) => {
    console.warn('xlsx shim: book_append_sheet được gọi, nhưng thư viện xlsx không được cài đặt.');
  }
};

// Hàm đọc dữ liệu
const read = (data: any) => {
  console.warn('xlsx shim: read được gọi, nhưng thư viện xlsx không được cài đặt.');
  return {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {}
    }
  };
};

// Hàm ghi file
const writeFile = (workbook: any, filename: string) => {
  console.warn('xlsx shim: writeFile được gọi, nhưng thư viện xlsx không được cài đặt.');
  alert('Chức năng export không khả dụng. Vui lòng cài đặt thư viện xlsx.');
};

/**
 * Hàm đọc file Excel và chuyển đổi thành JSON
 */
export async function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // Thử sử dụng XLSX thật, nếu không có thì dùng shim
        const workbook = (XLSX?.read || read)(data, { type: 'array' });
        
        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Chuyển đổi sang JSON
        const jsonData = (XLSX?.utils?.sheet_to_json || utils.sheet_to_json)(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// Tạo đối tượng exportUtils với các hàm shim
const exportUtils = {
  /**
   * Xuất dữ liệu JSON thành file Excel
   */
  exportToExcel: (data: any[], filename: string = 'export.xlsx') => {
    try {
      // Thử sử dụng XLSX thật, nếu không có thì dùng shim
      const bookNew = XLSX?.utils?.book_new || utils.book_new;
      const jsonToSheet = XLSX?.utils?.json_to_sheet || utils.json_to_sheet;
      const bookAppendSheet = XLSX?.utils?.book_append_sheet || utils.book_append_sheet;
      const xlsxWriteFile = XLSX?.writeFile || writeFile;
      
      // Tạo workbook và worksheet
      const workbook = bookNew();
      const worksheet = jsonToSheet(data);
      
      // Thêm worksheet vào workbook
      bookAppendSheet(workbook, worksheet, 'Sheet1');
      
      // Xuất file
      xlsxWriteFile(workbook, filename);
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      alert('Không thể xuất file Excel. Vui lòng thử lại sau.');
    }
  },
  
  // Thêm các hàm utils khác nếu cần
  utils,
  read,
  writeFile
};

// Export đối tượng đã được đặt tên
export default exportUtils; 