import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

type Props = {
  avatar?: string | null;
};

export function DashboardHeader({ avatar }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.brand}>SEN</Text>
        <Text style={styles.tagline}>SKILL EVOLUTION NETWORK</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          hitSlop={8}
          style={styles.iconButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons color={AuthColors.text} name="notifications-outline" size={21} />
        </Pressable>
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          hitSlop={6}
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Ionicons color={AuthColors.primary} name="person-outline" size={19} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  brand: {
    color: AuthColors.primary,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    color: AuthColors.secondary,
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1.15,
    marginTop: 2,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 40,
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
});
