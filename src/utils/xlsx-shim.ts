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

export default {
  utils,
  read,
  writeFile
}; 