import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { API_BASE_URL } from '@/constants/api';

const AUTH_TOKEN_KEY = 'sen.better-auth-token';

let unauthorizedHandler: (() => void) | undefined;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = undefined;
    }
  };
}

export function notifyUnauthorized() {
  unauthorizedHandler?.();
}

export async function getAuthToken(): Promise<string | undefined> {
  if (Platform.OS === 'web') {
    return undefined;
  }
  return (await SecureStore.getItemAsync(AUTH_TOKEN_KEY)) ?? undefined;
}

export async function clearAuthToken() {
  if (Platform.OS === 'web') {
    return;
  }
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export const authClient = createAuthClient({
  baseURL: `${API_BASE_URL}/api/auth`,
  fetchOptions: {
    credentials: 'include',
    auth: {
      type: 'Bearer',
      token: getAuthToken,
    },
    onSuccess: async ({ response }) => {
      if (Platform.OS === 'web') {
        return;
      }

      const token = response.headers.get('set-auth-token');
      if (token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      }
    },
    onError: async ({ response }) => {
      if (response.status === 401) {
        await clearAuthToken();
        notifyUnauthorized();
      }
    },
  },
});
