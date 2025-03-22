import * as fabricService from './fabricService';
import * as cuttingOrderService from './cuttingOrderService';
import * as inventoryService from './inventoryService';
import * as inventoryCheckService from './inventoryCheckService';
import * as optimizedServices from './optimizedServices';

// Export all services
export {
  fabricService,
  inventoryService,
  cuttingOrderService,
  inventoryCheckService,
  optimizedServices
};

/**
 * Format a date to a readable Vietnamese locale string
 * @param date The date to format (string or Date object)
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a number to a readable string with the specified number of fraction digits
 * @param value The number to format
 * @param fractionDigits The number of fraction digits to display (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined, fractionDigits: number = 2): string {
  if (value === null || value === undefined) return 'N/A';
  
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
} 