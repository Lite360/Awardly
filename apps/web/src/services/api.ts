// ─────────────────────────────────────────────────────────────────────────────
// API Client — all requests go through here
// Never put secrets here; this is frontend code
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import type { ApiResponse, ApiError, ApiResult } from '@awardly/shared-types';

const BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Generic typed request wrapper
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  data?: unknown,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await apiClient.request<ApiResult<T>>({
    method,
    url: path,
    data,
    params,
  });

  const result = response.data;
  if (!result.success) {
    const err = result as ApiError;
    throw new Error(err.error.message || 'An error occurred');
  }

  return (result as ApiResponse<T>).data;
}
