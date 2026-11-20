import { Platform } from 'react-native';

import { API_BASE_URL } from '@/constants/api';
import {
  clearAuthToken,
  getAuthToken,
  notifyUnauthorized,
} from '@/services/auth';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getResponseMessage(body: string, status: number) {
  if (body) {
    try {
      const payload: unknown = JSON.parse(body);
      if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        return payload.message;
      }
    } catch {
      return `Request failed (${status}).`;
    }
  }

  return `Request failed (${status}).`;
}

export async function requestApi<T>(path: string): Promise<T> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    await clearAuthToken();
    notifyUnauthorized();
    throw new ApiError('Your session has expired. Please sign in again.', 401);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(getResponseMessage(body, response.status), response.status);
  }

  return (await response.json()) as T;
}
