import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ProfileActions,
  ProfileBioCard,
  ProfileHeader,
  ProfileInfo,
  ProfileOverviewCard,
  ProfileOverviewHeading,
} from '@/components/profile/ProfileSections';
import { AuthColors } from '@/constants/theme';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile } from '@/types/profile';

export default function Profile() {
  const { data, error, isPending, isRefetching, refetch } = useProfile();
  const profile = data?.profile;

  const shareProfile = useCallback(async (profile: UserProfile) => {
    try {
      await Share.share({
        message: [
          `${profile.name} — ${profile.designation}`,
          profile.specialization,
          profile.bio,
        ]
          .filter(Boolean)
          .join('\n'),
        title: `${profile.name}'s SEN profile`,
      });
    } catch (shareError) {
      Alert.alert(
        'Unable to share profile',
        shareError instanceof Error
          ? shareError.message
          : 'Please try sharing your profile again.',
      );
    }
  }, []);

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
        <ProfileHeader
          onNotifications={() => router.push('/notifications')}
          onSettings={() => router.push('/settings')}
        />

        {isPending ? (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} size="small" />
            <Text style={styles.stateText}>Loading your profile...</Text>
          </View>
        ) : error ? (
          <View style={styles.statePanel}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={24} />
            <Text style={styles.stateTitle}>We couldn&apos;t load your profile</Text>
            <Text style={styles.stateText}>
              {error instanceof Error
                ? error.message
                : 'Something went wrong while loading your profile.'}
            </Text>
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
        ) : profile ? (
          <>
            <ProfileInfo profile={profile} />
            <ProfileActions
              onEdit={() => router.push('/profile/edit')}
              onShare={() => {
                void shareProfile(profile);
              }}
            />
            <ProfileBioCard profile={profile} />
            <ProfileOverviewHeading />
            {data?.overview ? (
              <ProfileOverviewCard overview={data.overview} />
            ) : null}
          </>
        ) : (
          <View style={styles.emptyPanel}>
            <View style={styles.emptyIcon}>
              <Ionicons color={AuthColors.primary} name="person-outline" size={23} />
            </View>
            <Text style={styles.stateTitle}>Your profile is ready to take shape</Text>
            <Text style={styles.stateText}>
              Add your professional details and tell your network what you do.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              onPress={() => router.push('/profile/edit')}
            >
              <Text style={styles.retryText}>Complete profile</Text>
            </Pressable>
          </View>
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
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 7,
    width: '100%',
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 18,
    padding: 21,
  },
  stateTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  stateText: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderColor: AuthColors.primary,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 40,
    paddingHorizontal: 16,
  },
  retryText: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyPanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 30,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  pressed: {
    opacity: 0.75,
  },
});
