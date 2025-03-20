import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@utils/supabase/constants';
import { Product, Status, PRODUCT_CATEGORIES } from '@/types';
// Sử dụng thư viện giả lập xlsx
import xlsxShim from '@utils/xlsx-shim';

// Thử import thư viện gốc, nếu không có sẽ dùng thư viện giả lập
let XLSX: any;
try {
  // @ts-ignore
  XLSX = require('xlsx');
} catch (error) {
  console.warn('Thư viện xlsx không được cài đặt. Sử dụng thư viện giả lập.');
  XLSX = xlsxShim;
}

interface ImportExportProps {
  onImportSuccess: (products: Product[]) => void;
  products: Product[];
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function ImportExport({ onImportSuccess, products }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // Xử lý import file Excel/CSV
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportErrors([]);

    try {
      // Cảnh báo nếu đang sử dụng thư viện giả lập
      if (XLSX === xlsxShim) {
        setImportErrors(['Thư viện xlsx không được cài đặt. Vui lòng cài đặt để sử dụng chức năng import.']);
        setIsImporting(false);
        return;
      }

      // Đọc file Excel/CSV
      const data = await file.arrayBuffer();
      // @ts-ignore
      const workbook = XLSX.read(data);
      // @ts-ignore
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // @ts-ignore
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate dữ liệu
      const validatedProducts: Partial<Product>[] = [];
      const errors: string[] = [];

      jsonData.forEach((row: any, index: number) => {
        if (!row.code || !row.name) {
          errors.push(`Dòng ${index + 2}: Thiếu mã sản phẩm hoặc tên sản phẩm`);
          return;
        }

        if (row.unit_price && isNaN(parseFloat(row.unit_price))) {
          errors.push(`Dòng ${index + 2}: Giá sản phẩm không hợp lệ`);
          return;
        }

        // Kiểm tra category có hợp lệ không
        if (row.category && !PRODUCT_CATEGORIES.some(c => c.value === row.category)) {
          errors.push(`Dòng ${index + 2}: Danh mục sản phẩm không hợp lệ (${row.category})`);
          return;
        }

        // Kiểm tra status có hợp lệ không
        if (row.status && ![Status.ACTIVE, Status.INACTIVE].includes(row.status)) {
          row.status = Status.ACTIVE; // Mặc định là ACTIVE nếu không hợp lệ
        }

        validatedProducts.push({
          code: row.code,
          name: row.name,
          description: row.description || '',
          category: row.category || PRODUCT_CATEGORIES[0].value,
          unit_price: parseFloat(row.unit_price) || 0,
          image_url: row.image_url || '',
          status: row.status || Status.ACTIVE
        });
      });

      if (errors.length > 0) {
        setImportErrors(errors);
        setIsImporting(false);
        return;
      }

      // Thêm sản phẩm vào Supabase
      const { data: insertedData, error } = await supabase
        .from('products')
        .insert(validatedProducts)
        .select();

      if (error) throw error;

      // Cập nhật UI
      if (insertedData && insertedData.length > 0) {
        onImportSuccess(insertedData as Product[]);
        alert(`Đã nhập thành công ${insertedData.length} sản phẩm`);
      }
    } catch (error) {
      console.error('Error importing products:', error);
      setImportErrors(['Có lỗi xảy ra khi nhập sản phẩm. Vui lòng thử lại.']);
    } finally {
      setIsImporting(false);
    }
  };

  // Xử lý export sản phẩm
  const handleExport = () => {
    setIsExporting(true);

    try {
      // Cảnh báo nếu đang sử dụng thư viện giả lập
      if (XLSX === xlsxShim) {
        alert('Thư viện xlsx không được cài đặt. Vui lòng cài đặt để sử dụng chức năng export.');
        setIsExporting(false);
        return;
      }

      // Chuẩn bị dữ liệu
      const exportData = products.map(product => ({
        'Mã sản phẩm': product.code,
        'Tên sản phẩm': product.name,
        'Mô tả': product.description || '',
        'Danh mục': getCategoryName(product.category),
        'Giá': product.unit_price,
        'Trạng thái': product.status === Status.ACTIVE ? 'Hoạt động' : 'Không hoạt động',
        'Ngày tạo': formatDate(product.created_at)
      }));

      // Tạo worksheet
      // @ts-ignore
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Điều chỉnh độ rộng cột
      const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const columnWidths = [15, 30, 40, 15, 15, 15, 20];
      worksheet['!cols'] = columnWidths.map(width => ({ width }));

      // Tạo workbook và tải xuống
      // @ts-ignore
      const workbook = XLSX.utils.book_new();
      // @ts-ignore
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm');
      
      // Tạo tên file với thời gian hiện tại
      const today = new Date();
      const filename = `danh_sach_san_pham_${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}.xlsx`;
      
      // @ts-ignore
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Có lỗi xảy ra khi xuất sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  // Lấy tên danh mục
  const getCategoryName = (category: string | undefined) => {
    return PRODUCT_CATEGORIES.find(c => c.value === category)?.label || category || 'Chưa phân loại';
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Tải template import
  const downloadTemplate = () => {
    // Cảnh báo nếu đang sử dụng thư viện giả lập
    if (XLSX === xlsxShim) {
      alert('Thư viện xlsx không được cài đặt. Vui lòng cài đặt để sử dụng chức năng tải mẫu nhập liệu.');
      return;
    }

    const templateData = [
      {
        'code': 'SP001',
        'name': 'Áo sơ mi nam dài tay',
        'description': 'Áo sơ mi nam dài tay, chất liệu cotton 100%, form fit',
        'category': 'shirt',
        'unit_price': 350000,
        'image_url': 'https://example.com/image.jpg',
        'status': Status.ACTIVE
      }
    ];

    // @ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    // @ts-ignore
    const workbook = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // @ts-ignore
    XLSX.writeFile(workbook, 'template_nhap_san_pham.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Import */}
        <div className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12" />
              </svg>
              <p className="text-sm text-gray-500">
                Kéo & thả file Excel/CSV hoặc{' '}
                <label className="text-blue-600 cursor-pointer hover:text-blue-800">
                  <span>chọn file</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImport}
                    disabled={isImporting}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-400">Chỉ chấp nhận file .xlsx, .xls hoặc .csv</p>
              <button
                type="button"
                onClick={downloadTemplate}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Tải mẫu nhập liệu
              </button>
            </div>
          </div>
          {isImporting && (
            <div className="mt-2 flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Đang nhập dữ liệu...</span>
            </div>
          )}
          {importErrors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800 mb-1">Lỗi khi nhập dữ liệu:</p>
              <ul className="text-xs text-red-700 list-disc pl-5">
                {importErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Export */}
        <div className="flex-1">
          <button
            onClick={handleExport}
            disabled={isExporting || products.length === 0}
            className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors flex flex-col items-center justify-center space-y-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <p className="text-sm text-gray-500">
              {isExporting ? 'Đang xuất dữ liệu...' : 'Xuất danh sách sản phẩm (Excel)'}
            </p>
            <p className="text-xs text-gray-400">
              {products.length === 0 
                ? 'Không có sản phẩm để xuất' 
                : `${products.length} sản phẩm sẵn sàng xuất`}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
} 