import { FabricStatus, FabricQualityGrade } from '@/utils/supabase/constants';

// Màu sắc cho các trạng thái kho vải
export const FABRIC_STATUS_COLORS = {
  [FabricStatus.AVAILABLE]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: 'bg-green-500'
  },
  [FabricStatus.RESERVED]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: 'bg-yellow-500'
  },
  [FabricStatus.IN_USE]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: 'bg-blue-500'
  },
  [FabricStatus.USED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: 'bg-gray-500'
  }
};

// Tên hiển thị cho các trạng thái kho vải
export const FABRIC_STATUS_LABELS = {
  [FabricStatus.AVAILABLE]: 'Khả dụng',
  [FabricStatus.RESERVED]: 'Đã đặt',
  [FabricStatus.IN_USE]: 'Đang sử dụng',
  [FabricStatus.USED]: 'Đã sử dụng'
};

// Màu sắc cho các cấp chất lượng vải
export const FABRIC_QUALITY_COLORS = {
  [FabricQualityGrade.A]: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  [FabricQualityGrade.B]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  },
  [FabricQualityGrade.C]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800'
  },
  [FabricQualityGrade.D]: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  }
};

// Tên hiển thị cho các cấp chất lượng vải
export const FABRIC_QUALITY_LABELS = {
  [FabricQualityGrade.A]: 'Loại A (Tốt nhất)',
  [FabricQualityGrade.B]: 'Loại B (Tốt)',
  [FabricQualityGrade.C]: 'Loại C (Trung bình)',
  [FabricQualityGrade.D]: 'Loại D (Kém)'
}; 