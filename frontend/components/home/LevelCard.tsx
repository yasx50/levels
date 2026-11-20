import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { DashboardData } from '@/types/dashboard';

type Props = {
  level?: DashboardData['level'];
  onViewEvolution: () => void;
};

function displayNumber(value: number | null | undefined) {
  return value == null ? 'N/A' : value.toLocaleString();
}

export function LevelCard({ level, onViewEvolution }: Props) {
  const progress =
    typeof level?.progress === 'number'
      ? Math.max(0, Math.min(100, level.progress))
      : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>LEVEL</Text>
          <Text style={styles.levelNumber}>{displayNumber(level?.number)}</Text>
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.eyebrow}>CURRENT EVOLUTION</Text>
          <Text numberOfLines={1} style={styles.levelName}>
            {level?.name || 'Level details unavailable'}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {level?.description || 'Level description unavailable.'}
      </Text>

      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Progress to next level</Text>
        <Text style={styles.progressValue}>
          {progress == null ? 'N/A' : `${Math.round(progress)}%`}
        </Text>
      </View>
      <View
        accessibilityLabel={
          progress == null
            ? 'Progress unavailable'
            : `${Math.round(progress)} percent complete`
        }
        accessibilityRole="progressbar"
        accessibilityValue={{
          max: 100,
          min: 0,
          now: progress ?? 0,
        }}
        style={styles.progressTrack}
      >
        {progress != null && (
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        )}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.nextInfo}>
          <Text style={styles.nextLabel}>NEXT LEVEL</Text>
          <Text style={styles.nextLevel}>
            {level?.nextLevel?.number == null
              ? ''
              : `${level.nextLevel.number}  -  `}
            {level?.nextLevel?.name || 'Not available'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onViewEvolution}
        >
          <Text style={styles.buttonText}>View Evolution</Text>
          <Ionicons color={AuthColors.card} name="arrow-forward" size={15} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 13,
    justifyContent: 'center',
    minHeight: 67,
    width: 67,
  },
  levelLabel: {
    color: AuthColors.primary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  levelNumber: {
    color: AuthColors.primary,
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 30,
  },
  titleGroup: {
    flex: 1,
  },
  eyebrow: {
    color: AuthColors.secondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  levelName: {
    color: AuthColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
    minHeight: 18,
  },
  progressLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  progressLabel: {
    color: AuthColors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  progressValue: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#F0EEE8',
    borderRadius: 4,
    height: 7,
    marginTop: 9,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: AuthColors.primary,
    borderRadius: 4,
    height: '100%',
  },
  bottomRow: {
    alignItems: 'center',
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
    paddingTop: 14,
  },
  nextLabel: {
    color: AuthColors.secondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  nextInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  nextLevel: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: AuthColors.card,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});
