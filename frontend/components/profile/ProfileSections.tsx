import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { ProfileOverview, UserProfile } from '@/types/profile';

type HeaderProps = {
  onNotifications: () => void;
  onSettings: () => void;
};

export function ProfileHeader({ onNotifications, onSettings }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerEyebrow}>SEN · YOUR PROFESSIONAL STORY</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          hitSlop={6}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
          onPress={onNotifications}
        >
          <Ionicons color={AuthColors.text} name="notifications-outline" size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel="Settings"
          accessibilityRole="button"
          hitSlop={6}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
          onPress={onSettings}
        >
          <Ionicons color={AuthColors.text} name="settings-outline" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

export function ProfileInfo({ profile }: { profile: UserProfile }) {
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <View style={styles.profileInfo}>
      <ProfileAvatar
        key={profile.avatarUrl ?? 'no-avatar'}
        avatarUrl={profile.avatarUrl}
        initials={initials || 'S'}
        name={profile.name}
      />
      <Text style={styles.name}>{profile.name || 'Your profile'}</Text>
      {profile.designation ? (
        <Text style={styles.designation}>{profile.designation}</Text>
      ) : null}
      {profile.specialization ? (
        <Text style={styles.specialization}>{profile.specialization}</Text>
      ) : null}
      {profile.location ? (
        <View style={styles.locationRow}>
          <Ionicons color={AuthColors.muted} name="location-outline" size={13} />
          <Text style={styles.location}>{profile.location}</Text>
        </View>
      ) : null}
      {profile.experienceLevel ? (
        <View style={styles.levelBadge}>
          <Ionicons color={AuthColors.primary} name="ribbon-outline" size={13} />
          <Text style={styles.levelText}>{profile.experienceLevel}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function ProfileAvatar({
  avatarUrl,
  initials,
  name,
  size = 86,
}: {
  avatarUrl: string | null;
  initials: string;
  name: string;
  size?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View
      style={[
        styles.avatar,
        {
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      {avatarUrl && !imageFailed ? (
        <Image
          accessibilityLabel={`${name}'s profile photo`}
          source={{ uri: avatarUrl }}
          style={styles.avatarImage}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Text style={[styles.initials, size < 60 && styles.compactInitials]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

type ActionsProps = {
  onEdit: () => void;
  onShare: () => void;
};

export function ProfileActions({ onEdit, onShare }: ActionsProps) {
  return (
    <View style={styles.actionRow}>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        onPress={onEdit}
      >
        <Ionicons color={AuthColors.primary} name="create-outline" size={16} />
        <Text style={styles.actionLabel}>Edit Profile</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        onPress={onShare}
      >
        <Ionicons color={AuthColors.primary} name="share-social-outline" size={15} />
        <Text style={styles.actionLabel}>Share Profile</Text>
      </Pressable>
    </View>
  );
}

export function ProfileBioCard({ profile }: { profile: UserProfile }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeadingRow}>
        <View style={styles.cardIcon}>
          <Ionicons color={AuthColors.primary} name="reader-outline" size={16} />
        </View>
        <Text style={styles.cardTitle}>About</Text>
      </View>
      {profile.bio ? (
        <Text style={styles.bio}>{profile.bio}</Text>
      ) : (
        <Text style={styles.missingCopy}>Add a short introduction to your profile.</Text>
      )}
      {profile.interests ? (
        <Text style={styles.interests}>{profile.interests}</Text>
      ) : null}
    </View>
  );
}

export function ProfileOverviewCard({ overview }: { overview: ProfileOverview }) {
  return (
    <View style={styles.overviewCard}>
      <OverviewStat icon="sparkles-outline" label="Skills" value={overview.stats.skills} />
      <View accessibilityElementsHidden style={styles.divider} />
      <OverviewStat
        icon="briefcase-outline"
        label="Projects"
        value={overview.stats.projects}
      />
    </View>
  );
}

function OverviewStat({
  icon,
  label,
  value,
}: {
  icon: 'sparkles-outline' | 'briefcase-outline';
  label: string;
  value: number;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statTitle}>
        <Ionicons color={AuthColors.primary} name={icon} size={15} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statCaption}>{label.toLowerCase()} added</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: AuthColors.text,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerEyebrow: {
    color: AuthColors.secondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 5,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileInfo: {
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 5,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F1E8DF',
    borderColor: AuthColors.card,
    borderRadius: 43,
    borderWidth: 3,
    height: 86,
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    width: 86,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  initials: {
    color: AuthColors.primary,
    fontSize: 25,
    fontWeight: '800',
  },
  compactInitials: {
    fontSize: 12,
  },
  name: {
    color: AuthColors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.35,
    textAlign: 'center',
  },
  designation: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  specialization: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    marginTop: 7,
  },
  location: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
    marginTop: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  levelText: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 8,
  },
  actionLabel: {
    color: AuthColors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 17,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  cardHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 8,
    height: 27,
    justifyContent: 'center',
    width: 27,
  },
  cardTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  bio: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  interests: {
    color: AuthColors.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },
  missingCopy: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 9,
  },
  overviewCard: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 104,
    paddingHorizontal: 5,
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  statLabel: {
    color: AuthColors.secondary,
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    color: AuthColors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 3,
  },
  statCaption: {
    color: AuthColors.muted,
    fontSize: 9,
    marginTop: 1,
  },
  divider: {
    backgroundColor: AuthColors.border,
    height: 55,
    width: 1,
  },
  pressed: {
    opacity: 0.72,
  },
});

export function ProfileOverviewHeading() {
  return <Text style={styles.sectionTitle}>Overview</Text>;
}
