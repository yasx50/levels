import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import {
  authClient,
  clearAuthToken,
  getAuthToken,
  setUnauthorizedHandler,
} from '@/services/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type AuthContextValue = {
  status: AuthStatus;
  sessionError: string | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  retrySession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unable to verify your session.';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    queryClient.clear();
    setUser(null);
    setSessionError(null);
    setStatus('unauthenticated');
  }, [queryClient]);

  const restoreSession = useCallback(async () => {
    setStatus('loading');
    setSessionError(null);

    try {
      const token = await getAuthToken();
      if (!token && Platform.OS !== 'web') {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }

      const result = await authClient.getSession();
      if (result.error) {
        if (result.error.status === 401) {
          await clearAuthToken();
          setUser(null);
          setStatus('unauthenticated');
          return;
        }

        setSessionError(result.error.message ?? 'Unable to verify your session.');
        setStatus('error');
        return;
      }

      if (!result.data) {
        await clearAuthToken();
        setUser(null);
        setStatus('unauthenticated');
        return;
      }

      setUser(result.data.user);
      setStatus('authenticated');
    } catch (error) {
      setSessionError(getErrorMessage(error));
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const unregister = setUnauthorizedHandler(handleUnauthorized);
    void restoreSession();
    return unregister;
  }, [handleUnauthorized, restoreSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    setSessionError(null);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        throw new Error(result.error.message ?? 'Sign-in failed.');
      }

      const session = await authClient.getSession();
      if (session.error) {
        throw new Error(
          session.error.message ?? 'Unable to start your session.',
        );
      }

      if (!session.data) {
        throw new Error(
          'Sign-in succeeded, but no active session was returned.',
        );
      }

      setUser(session.data.user);
      setStatus('authenticated');
    } catch (error) {
      setUser(null);
      setSessionError(null);
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } finally {
      await clearAuthToken();
      handleUnauthorized();
    }
  }, [handleUnauthorized]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      sessionError,
      user,
      signIn,
      signOut,
      retrySession: restoreSession,
    }),
    [status, sessionError, user, signIn, signOut, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return value;
}

export { getErrorMessage };
