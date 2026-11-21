import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { Skill } from '@/types/skills';

type Props = {
  skill: Skill;
  onPress: () => void;
};

function formatExperience(years: number, months: number) {
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  return parts.length > 0 ? parts.join(' ') : 'New skill';
}

export function SkillCard({ skill, onPress }: Props) {
  const progress = Math.max(0, Math.min(100, skill.progress));

  return (
    <Pressable
      accessibilityHint={`Open ${skill.name} skill details`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={styles.name}>{skill.name}</Text>
          <Text style={styles.category}>{skill.category}</Text>
        </View>
        <Ionicons color={AuthColors.muted} name="chevron-forward" size={18} />
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {skill.description}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons color={AuthColors.secondary} name="time-outline" size={14} />
          <Text style={styles.metaText}>
            {formatExperience(skill.experienceYears, skill.experienceMonths)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons color={AuthColors.secondary} name="people-outline" size={14} />
          <Text style={styles.metaText}>{skill.acknowledgements} acknowledgements</Text>
        </View>
      </View>

      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Skill progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <View
        accessibilityLabel={`Skill progress ${progress}%`}
        accessibilityRole="progressbar"
        accessibilityValue={{ max: 100, min: 0, now: progress }}
        style={styles.track}
      >
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    flex: 1,
  },
  name: {
    color: AuthColors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  category: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 14,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  metaText: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  progressLabel: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  progressValue: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  track: {
    backgroundColor: '#F0EEE8',
    borderRadius: 4,
    height: 6,
    marginTop: 7,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: AuthColors.primary,
    borderRadius: 4,
    height: '100%',
  },
  pressed: {
    opacity: 0.82,
  },
});
