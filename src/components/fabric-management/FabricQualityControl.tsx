import React, { useState } from 'react';
import { FabricInventory } from '../../mocks/fabric-management.mock';

interface QualityDefect {
  id: string;
  type: string;
  description: string;
  severityLevel: 'minor' | 'major' | 'critical';
  position: string;
  length: number;
  width: number;
  imageUrl?: string;
}

interface QualityControlRecord {
  id: string;
  inventoryId: number;
  rollId: string;
  fabricName: string;
  inspectionDate: string;
  inspectedBy: string;
  originalGrade: string;
  newGrade: string;
  defects: QualityDefect[];
  comments: string;
}

interface FabricQualityControlProps {
  inventory: FabricInventory[];
  onSaveQualityRecord: (record: QualityControlRecord) => void;
}

const defectTypes = [
  { value: 'hole', label: 'Lỗ, rách' },
  { value: 'stain', label: 'Vết bẩn' },
  { value: 'color_variation', label: 'Sai màu' },
  { value: 'weaving_defect', label: 'Lỗi dệt' },
  { value: 'printing_defect', label: 'Lỗi in' },
  { value: 'selvage_defect', label: 'Lỗi mép vải' },
  { value: 'foreign_material', label: 'Tạp chất' },
  { value: 'crease', label: 'Nếp gấp' },
  { value: 'width_issue', label: 'Sai khổ rộng' },
];

const FabricQualityControl: React.FC<FabricQualityControlProps> = ({ 
  inventory,
  onSaveQualityRecord 
}) => {
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [inspectionDate, setInspectionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inspectedBy, setInspectedBy] = useState<string>('');
  const [newGrade, setNewGrade] = useState<string>('A');
  const [comments, setComments] = useState<string>('');
  const [defects, setDefects] = useState<QualityDefect[]>([]);
  const [currentDefect, setCurrentDefect] = useState<Partial<QualityDefect>>({
    type: 'hole',
    description: '',
    severityLevel: 'minor',
    position: 'center',
    length: 0,
    width: 0
  });
  
  // Lọc cuộn vải đang chọn
  const selectedInventoryItem = inventory.find(item => item.id === selectedInventoryId);
  
  // Thêm một lỗi mới
  const addDefect = () => {
    if (
      !currentDefect.description ||
      currentDefect.length === 0 ||
      currentDefect.width === 0
    ) {
      alert('Vui lòng điền đầy đủ thông tin lỗi');
      return;
    }
    
    const newDefect: QualityDefect = {
      id: Date.now().toString(),
      type: currentDefect.type || 'hole',
      description: currentDefect.description || '',
      severityLevel: currentDefect.severityLevel || 'minor',
      position: currentDefect.position || 'center',
      length: currentDefect.length || 0,
      width: currentDefect.width || 0,
      imageUrl: currentDefect.imageUrl
    };
    
    setDefects([...defects, newDefect]);
    setCurrentDefect({
      type: 'hole',
      description: '',
      severityLevel: 'minor',
      position: 'center',
      length: 0,
      width: 0
    });
  };
  
  // Xóa một lỗi
  const removeDefect = (defectId: string) => {
    setDefects(defects.filter(defect => defect.id !== defectId));
  };
  
  // Tự động đề xuất phân loại dựa trên các lỗi
  const suggestGrade = () => {
    if (defects.length === 0) return 'A';
    
    const hasCritical = defects.some(defect => defect.severityLevel === 'critical');
    if (hasCritical) return 'C';
    
    const majorCount = defects.filter(defect => defect.severityLevel === 'major').length;
    if (majorCount >= 3) return 'C';
    if (majorCount >= 1) return 'B';
    
    const minorCount = defects.filter(defect => defect.severityLevel === 'minor').length;
    if (minorCount >= 5) return 'B';
    
    return 'A';
  };
  
  // Lưu báo cáo kiểm tra chất lượng
  const saveQualityRecord = () => {
    if (!selectedInventoryItem || !inspectedBy) {
      alert('Vui lòng chọn cuộn vải và điền đầy đủ thông tin');
      return;
    }
    
    const suggestedGrade = suggestGrade();
    const finalGrade = newGrade || suggestedGrade;
    
    const qualityRecord: QualityControlRecord = {
      id: Date.now().toString(),
      inventoryId: selectedInventoryItem.id,
      rollId: selectedInventoryItem.roll_id,
      fabricName: selectedInventoryItem.fabric_name || '',
      inspectionDate,
      inspectedBy,
      originalGrade: selectedInventoryItem.quality_grade,
      newGrade: finalGrade,
      defects,
      comments
    };
    
    onSaveQualityRecord(qualityRecord);
    
    // Reset form
    setSelectedInventoryId(null);
    setInspectionDate(new Date().toISOString().split('T')[0]);
    setInspectedBy('');
    setNewGrade('A');
    setComments('');
    setDefects([]);
  };
  
  // Render form kiểm soát chất lượng
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Kiểm soát chất lượng vải</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn cuộn vải
            </label>
            <select
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={selectedInventoryId || ''}
              onChange={(e) => setSelectedInventoryId(parseInt(e.target.value) || null)}
            >
              <option value="">-- Chọn cuộn vải --</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.roll_id} - {item.fabric_name || `Vải #${item.fabric_id}`} ({item.quality_grade})
                </option>
              ))}
            </select>
          </div>
          
          {selectedInventoryItem && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin cuộn vải</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Mã cuộn</p>
                  <p className="font-medium">{selectedInventoryItem.roll_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Màu</p>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-1" 
                      style={{ backgroundColor: selectedInventoryItem.color_code }}
                    ></div>
                    <p className="font-medium">{selectedInventoryItem.color_code}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Chiều dài</p>
                  <p className="font-medium">{selectedInventoryItem.length} m</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Chiều rộng</p>
                  <p className="font-medium">{selectedInventoryItem.width} cm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phân loại hiện tại</p>
                  <p className="font-medium">{selectedInventoryItem.quality_grade}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ghi chú lỗi</p>
                  <p className="font-medium">{selectedInventoryItem.defect_notes || 'Không có'}</p>
                </div>
              </div>
              
              {selectedInventoryItem.image_url && (
                <div className="mt-3">
                  <img 
                    src={selectedInventoryItem.image_url} 
                    alt="Fabric" 
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kiểm tra
              </label>
              <input
                type="date"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người kiểm tra
              </label>
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={inspectedBy}
                onChange={(e) => setInspectedBy(e.target.value)}
                placeholder="Nhập tên người kiểm tra"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại chất lượng mới
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="grade-a"
                  type="radio"
                  name="quality-grade"
                  value="A"
                  checked={newGrade === 'A'}
                  onChange={() => setNewGrade('A')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="grade-a" className="ml-2 block text-sm text-gray-700">
                  Loại A (Tốt)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="grade-b"
                  type="radio"
                  name="quality-grade"
                  value="B"
                  checked={newGrade === 'B'}
                  onChange={() => setNewGrade('B')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="grade-b" className="ml-2 block text-sm text-gray-700">
                  Loại B (Trung bình)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="grade-c"
                  type="radio"
                  name="quality-grade"
                  value="C"
                  checked={newGrade === 'C'}
                  onChange={() => setNewGrade('C')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="grade-c" className="ml-2 block text-sm text-gray-700">
                  Loại C (Kém)
                </label>
              </div>
            </div>
            
            {defects.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Phân loại đề xuất: <span className="font-medium">{suggestGrade()}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Nhập ghi chú về chất lượng vải"
            ></textarea>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ghi nhận lỗi vải</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Loại lỗi
                </label>
                <select
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={currentDefect.type}
                  onChange={(e) => setCurrentDefect({...currentDefect, type: e.target.value})}
                >
                  {defectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mức độ
                </label>
                <select
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={currentDefect.severityLevel}
                  onChange={(e) => setCurrentDefect({
                    ...currentDefect, 
                    severityLevel: e.target.value as 'minor' | 'major' | 'critical'
                  })}
                >
                  <option value="minor">Nhẹ</option>
                  <option value="major">Trung bình</option>
                  <option value="critical">Nghiêm trọng</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Vị trí lỗi
              </label>
              <select
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={currentDefect.position}
                onChange={(e) => setCurrentDefect({...currentDefect, position: e.target.value})}
              >
                <option value="left_edge">Mép trái</option>
                <option value="right_edge">Mép phải</option>
                <option value="center">Giữa vải</option>
                <option value="scattered">Rải rác</option>
                <option value="beginning">Đầu cuộn</option>
                <option value="end">Cuối cuộn</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Chiều dài lỗi (cm)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={currentDefect.length || ''}
                  onChange={(e) => setCurrentDefect({
                    ...currentDefect, 
                    length: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Chiều rộng lỗi (cm)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={currentDefect.width || ''}
                  onChange={(e) => setCurrentDefect({
                    ...currentDefect, 
                    width: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mô tả lỗi
              </label>
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={currentDefect.description || ''}
                onChange={(e) => setCurrentDefect({...currentDefect, description: e.target.value})}
                placeholder="Mô tả chi tiết về lỗi"
              />
            </div>
            
            <div className="mb-4">
              <button
                type="button"
                onClick={addDefect}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Thêm lỗi
              </button>
            </div>
            
            {defects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Danh sách lỗi đã phát hiện</h4>
                <div className="overflow-y-auto max-h-64 border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại lỗi
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vị trí
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mức độ
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kích thước
                        </th>
                        <th scope="col" className="relative px-3 py-2">
                          <span className="sr-only">Thao tác</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {defects.map((defect) => (
                        <tr key={defect.id}>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {defectTypes.find(type => type.value === defect.type)?.label || defect.type}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {defect.position === 'left_edge' ? 'Mép trái' :
                             defect.position === 'right_edge' ? 'Mép phải' :
                             defect.position === 'center' ? 'Giữa vải' :
                             defect.position === 'scattered' ? 'Rải rác' :
                             defect.position === 'beginning' ? 'Đầu cuộn' :
                             defect.position === 'end' ? 'Cuối cuộn' : defect.position}
                          </td>
                          <td className="px-3 py-2 text-xs">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              defect.severityLevel === 'critical' ? 'bg-red-100 text-red-800' :
                              defect.severityLevel === 'major' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {defect.severityLevel === 'critical' ? 'Nghiêm trọng' :
                               defect.severityLevel === 'major' ? 'Trung bình' : 'Nhẹ'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {defect.length} x {defect.width} cm
                          </td>
                          <td className="px-3 py-2 text-xs text-right">
                            <button
                              type="button"
                              onClick={() => removeDefect(defect.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={saveQualityRecord}
        >
          Lưu đánh giá chất lượng
        </button>
      </div>
    </div>
  );
};

export default FabricQualityControl; 