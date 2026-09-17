export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
}

export interface PaginatedMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_page: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  success: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}

export interface PaginationQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

