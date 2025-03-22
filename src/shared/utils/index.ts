// Shared utility functions

/**
 * Format a date string to a localized format
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number, currency = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
}; 