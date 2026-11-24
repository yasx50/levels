import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { DiscoverSkill } from '@/types/discover';

type Props = {
  skill: DiscoverSkill;
  onPress: () => void;
};

export function SkillDiscoveryCard({ skill, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.icon}>
        <Ionicons color={AuthColors.primary} name="sparkles-outline" size={20} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{skill.name}</Text>
        <Text style={styles.category}>{skill.category}</Text>
        <Text numberOfLines={2} style={styles.description}>{skill.description}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons color={AuthColors.secondary} name="people-outline" size={13} />
            <Text style={styles.metaText}>{skill.peopleCount} people</Text>
          </View>
          <Text style={styles.highlight}>{skill.highlight}</Text>
        </View>
      </View>
      <Ionicons color={AuthColors.muted} name="chevron-forward" size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 11,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  content: {
    flex: 1,
    paddingHorizontal: 11,
  },
  name: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  category: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  highlight: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
  },
});
