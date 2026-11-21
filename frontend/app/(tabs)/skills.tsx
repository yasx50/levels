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

import { SkillCard } from '@/components/skills/SkillCard';
import { AuthColors } from '@/constants/theme';
import { useSkills } from '@/hooks/useSkills';

export default function Skills() {
  const { data: skills, error, isPending, isRefetching, refetch } = useSkills();
  const errorMessage =
    error instanceof Error ? error.message : 'Something went wrong while loading your skills.';

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
        <View style={styles.header}>
          <View style={styles.heading}>
            <Text style={styles.title}>My Skills</Text>
            <Text style={styles.subtitle}>Build your professional identity.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            onPress={() => router.push('/skills/add')}
          >
            <Ionicons color={AuthColors.card} name="add" size={19} />
            <Text style={styles.addButtonText}>Add Skill</Text>
          </Pressable>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countLabel}>Your skills</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{skills?.length ?? 0}</Text>
          </View>
        </View>

        {isPending && (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} />
            <Text style={styles.stateText}>Loading your skills...</Text>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        )}

        {error && (
          <View style={styles.statePanel}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={25} />
            <Text style={styles.stateTitle}>We couldn&apos;t load your skills</Text>
            <Text style={styles.stateText}>{errorMessage}</Text>
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

        {skills?.length === 0 && !error && (
          <View style={styles.emptyPanel}>
            <View style={styles.emptyIcon}>
              <Ionicons color={AuthColors.primary} name="sparkles-outline" size={24} />
            </View>
            <Text style={styles.emptyTitle}>Your skills tell your story</Text>
            <Text style={styles.emptyDescription}>
              Add the skills you use every day. Build a clear professional profile and make it
              easier for people to recognize your strengths.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
              onPress={() => router.push('/skills/add')}
            >
              <Ionicons color={AuthColors.card} name="add" size={19} />
              <Text style={styles.addButtonText}>Add Your First Skill</Text>
            </Pressable>
          </View>
        )}

        {skills?.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onPress={() =>
              router.push({
                pathname: '/skills/[skillId]',
                params: { skillId: skill.id },
              })
            }
          />
        ))}
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  heading: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: AuthColors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: AuthColors.secondary,
    fontSize: 12,
    marginTop: 5,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 11,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: AuthColors.card,
    fontSize: 11,
    fontWeight: '700',
  },
  countRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  countLabel: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 12,
    minWidth: 23,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  countText: {
    color: AuthColors.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 21,
  },
  stateTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  stateText: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  skeletonCard: {
    alignSelf: 'stretch',
    backgroundColor: '#F3F1E9',
    borderRadius: 12,
    height: 85,
    marginTop: 12,
  },
  retryButton: {
    alignItems: 'center',
    borderColor: AuthColors.primary,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 13,
    minHeight: 38,
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
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  emptyTitle: {
    color: AuthColors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyDescription: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
