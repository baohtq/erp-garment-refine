// Shared type definitions

/**
 * Generic pagination response
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Common status types
 */
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'; 