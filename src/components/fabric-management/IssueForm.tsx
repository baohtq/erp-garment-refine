import React, { useState, useEffect } from 'react';
import { FabricIssue, FabricInventory } from '@/mocks-new/fabric-management.mock';

interface IssueFormProps {
  issue?: FabricIssue;
  inventory: FabricInventory[];
  employees: { id: number; name: string; position: string }[];
  onSave: (issue: FabricIssue) => void;
  onCancel: () => void;
}

const IssueForm: React.FC<IssueFormProps> = ({
  issue,
  inventory,
  employees,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<FabricIssue>({
    id: issue?.id || Math.floor(Math.random() * 1000),
    issue_code: issue?.issue_code || `ISS-${new Date().getTime().toString().slice(-6)}`,
    title: issue?.title || '',
    description: issue?.description || '',
    date_created: issue?.date_created || new Date().toISOString().split('T')[0],
    created_by: issue?.created_by || 0,
    status: issue?.status || 'new',
    severity: issue?.severity || 'medium',
    affected_inventory: issue?.affected_inventory || []
  });

  useEffect(() => {
    if (issue) {
      setFormData(issue);
    }
  }, [issue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'created_by') {
      setFormData({ ...formData, [name]: parseInt(value, 10) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInventoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value, 10));
    setFormData({ ...formData, affected_inventory: selectedOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {issue ? 'Chỉnh sửa vấn đề' : 'Thêm vấn đề vải mới'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="issue_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mã vấn đề
          </label>
          <input
            type="text"
            name="issue_code"
            id="issue_code"
            value={formData.issue_code}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
            disabled
          />
        </div>

        <div>
          <label htmlFor="created_by" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Người tạo <span className="text-red-500">*</span>
          </label>
          <select
            id="created_by"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Chọn người tạo</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.position})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="date_created" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ngày tạo <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_created"
            id="date_created"
            value={formData.date_created}
            onChange={handleChange}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="affected_inventory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Kho vải bị ảnh hưởng
          </label>
          <select
            id="affected_inventory"
            name="affected_inventory"
            multiple
            value={formData.affected_inventory.map(id => id.toString())}
            onChange={handleInventoryChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            size={4}
          >
            {inventory.map(item => (
              <option key={item.id} value={item.id}>
                {item.inventory_code} - {item.fabric_name} (Cuộn: {item.roll_number})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Giữ Ctrl để chọn nhiều mục</p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Trạng thái <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="new">Mới</option>
            <option value="in-progress">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
          </select>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mức độ nghiêm trọng <span className="text-red-500">*</span>
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default IssueForm; 