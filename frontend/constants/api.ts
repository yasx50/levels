import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(
  /\/+$/,
  '',
);

const defaultApiUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

export const API_BASE_URL = configuredApiUrl || defaultApiUrl;
