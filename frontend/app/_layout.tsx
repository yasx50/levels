import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Slot, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthColors } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RouteGate() {
  const { status } = useAuth();
  const segments = useSegments();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={AuthColors.primary} />
      </View>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';

  if (status === 'authenticated' && inAuthGroup) {
    return <Redirect href="/(tabs)/home" />;
  }

  if (status !== 'authenticated' && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouteGate />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: AuthColors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
