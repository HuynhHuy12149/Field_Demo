export interface PagedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  success: boolean;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
