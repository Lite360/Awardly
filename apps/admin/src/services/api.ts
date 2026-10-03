import React from 'react';
import axios from 'axios';

const TOKEN_KEY = 'awardly_admin_token';

export const getAuthToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = (): void => localStorage.removeItem(TOKEN_KEY);

export async function adminApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (_e) {
    throw new Error(`Server error (${response.status}): ${text.slice(0, 150)}`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || data.message || `API error (${response.status})`);
  }

  return data.data as T;
}
