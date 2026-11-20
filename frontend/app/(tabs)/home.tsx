import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardHeader } from '@/components/home/DashboardHeader';
import { LevelCard } from '@/components/home/LevelCard';
import { StatCard } from '@/components/home/StatCard';
import { WelcomeBlock } from '@/components/home/WelcomeBlock';
import { AuthColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { ApiError } from '@/services/api';

export default function Home() {
  const { user: authUser } = useAuth();
  const { data, error, isPending, isRefetching, refetch } = useDashboard();

  const firstName =
    data?.user?.firstName?.trim() ||
    data?.user?.name?.trim().split(/\s+/)[0] ||
    authUser?.name.trim().split(/\s+/)[0];
  const avatar =
    data?.user?.avatarUrl ??
    data?.user?.avatar ??
    authUser?.image ??
    undefined;
  const errorMessage =
    error instanceof ApiError && error.status === 404
      ? 'The dashboard service is not available yet. Please try again later.'
      : error instanceof Error
        ? error.message
        : 'Something went wrong while loading your dashboard.';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[AuthColors.primary]}
            refreshing={isRefetching}
            tintColor={AuthColors.primary}
            onRefresh={() => {
              void refetch();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader avatar={avatar} />
        <WelcomeBlock firstName={firstName} />

        {isPending && (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} size="small" />
            <Text style={styles.stateText}>Loading your dashboard...</Text>
          </View>
        )}

        {error && (
          <View style={styles.statePanel}>
            <Ionicons
              color={AuthColors.primary}
              name="cloud-offline-outline"
              size={24}
            />
            <Text style={styles.errorTitle}>We couldn&apos;t load your dashboard</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              onPress={() => {
                void refetch();
              }}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {data && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your evolution</Text>
              <LevelCard
                level={data.level}
                onViewEvolution={() => router.push('/levels')}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your profile at a glance</Text>
              <View style={styles.statRow}>
                <StatCard icon="sparkles-outline" label="Skills" value={data.stats?.skills} />
                <StatCard icon="briefcase-outline" label="Projects" value={data.stats?.projects} />
              </View>
              <View style={[styles.statRow, styles.secondStatRow]}>
                <StatCard icon="ribbon-outline" label="Achievements" value={data.stats?.achievements} />
                <StatCard icon="people-outline" label="Connections" value={data.stats?.connections} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AuthColors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    width: '100%',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondStatRow: {
    marginTop: 12,
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    padding: 22,
  },
  stateText: {
    color: AuthColors.secondary,
    fontSize: 12,
    marginTop: 10,
  },
  errorTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderColor: AuthColors.primary,
    borderRadius: 9,
    borderWidth: 1,
    marginTop: 15,
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  retryText: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
