import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { DiscoverPerson } from '@/types/discover';

type Props = {
  person: DiscoverPerson;
  connectionStatus: 'none' | 'loading' | 'sent';
  onConnect: () => void;
  onPress: () => void;
};

export function PersonCard({ person, connectionStatus, onConnect, onPress }: Props) {
  const sent = connectionStatus === 'sent';
  const loading = connectionStatus === 'loading';

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityHint={`Open ${person.name}'s profile`}
        accessibilityRole="button"
        style={({ pressed }) => [styles.profileRow, pressed && styles.pressed]}
        onPress={onPress}
      >
        <View style={styles.avatar}>
          {person.avatarUrl ? (
            <Image source={{ uri: person.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.initials}>{person.initials}</Text>
          )}
        </View>
        <View style={styles.profileText}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>{person.name}</Text>
            {person.level ? (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {person.level}</Text>
              </View>
            ) : null}
          </View>
          <Text numberOfLines={1} style={styles.designation}>{person.designation}</Text>
        </View>
        <Ionicons color={AuthColors.muted} name="chevron-forward" size={17} />
      </Pressable>

      <Text numberOfLines={2} style={styles.description}>{person.description}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy: loading, disabled: loading }}
        disabled={loading}
        style={({ pressed }) => [
          styles.connectButton,
          sent && styles.sentButton,
          (pressed || loading) && styles.pressed,
        ]}
        onPress={onConnect}
      >
        {sent ? (
          <Ionicons
            color={AuthColors.primary}
            name="checkmark-circle-outline"
            size={16}
          />
        ) : (
          <Ionicons
            color={loading ? AuthColors.secondary : AuthColors.card}
            name="person-add-outline"
            size={15}
          />
        )}
        <Text style={[styles.connectText, sent && styles.sentText]}>
          {loading ? 'Sending...' : sent ? 'Request Sent' : 'Connect'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F1E8DF',
    borderRadius: 23,
    height: 46,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 46,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  initials: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
    paddingHorizontal: 11,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    color: AuthColors.text,
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  levelBadge: {
    backgroundColor: '#F7EEE8',
    borderRadius: 7,
    marginLeft: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  levelText: {
    color: AuthColors.primary,
    fontSize: 8,
    fontWeight: '800',
  },
  designation: {
    color: AuthColors.secondary,
    fontSize: 11,
    marginTop: 4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },
  connectButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: AuthColors.primary,
    borderRadius: 9,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 38,
    minWidth: 112,
    paddingHorizontal: 12,
  },
  sentButton: {
    backgroundColor: '#F8EEE8',
  },
  connectText: {
    color: AuthColors.card,
    fontSize: 10,
    fontWeight: '700',
  },
  sentText: {
    color: AuthColors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});
