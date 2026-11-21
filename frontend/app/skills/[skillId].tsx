import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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

import {
  SkillEvidenceSection,
  SkillOverviewSection,
  SkillPeopleSection,
} from '@/components/skills/SkillDetailSections';
import { AuthColors } from '@/constants/theme';
import {
  useSkill,
  useSkillEvidence,
  useSkillPeople,
  useSkillStatistics,
} from '@/hooks/useSkills';

const TABS = ['Overview', 'Evidence', 'People'] as const;
type DetailTab = (typeof TABS)[number];

export default function SkillDetail() {
  const { skillId: param } = useLocalSearchParams<{ skillId: string | string[] }>();
  const skillId = Array.isArray(param) ? param[0] : param ?? '';
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');

  const skillQuery = useSkill(skillId);
  const evidenceQuery = useSkillEvidence(skillId);
  const peopleQuery = useSkillPeople(skillId);
  const statisticsQuery = useSkillStatistics(skillId);
  const skill = skillQuery.data;
  const evidence = evidenceQuery.data ?? [];
  const people = peopleQuery.data ?? [];
  const progress = Math.max(0, Math.min(100, skill?.progress ?? 0));
  const isRefreshing =
    skillQuery.isRefetching ||
    evidenceQuery.isRefetching ||
    peopleQuery.isRefetching ||
    statisticsQuery.isRefetching;

  const refresh = () => {
    void Promise.all([
      skillQuery.refetch(),
      evidenceQuery.refetch(),
      peopleQuery.refetch(),
      statisticsQuery.refetch(),
    ]);
  };

  const openEvidence = (evidenceId: string) => {
    router.push({
      pathname: '/evidence/[evidenceId]',
      params: { evidenceId, skillId },
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[AuthColors.primary]}
            refreshing={isRefreshing}
            tintColor={AuthColors.primary}
            onRefresh={refresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons color={AuthColors.text} name="arrow-back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Skill details</Text>
          <View style={styles.topBarSpacer} />
        </View>

        {skillQuery.isPending && (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} />
            <Text style={styles.stateText}>Loading skill details...</Text>
          </View>
        )}

        {skillQuery.error && (
          <View style={styles.statePanel}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={24} />
            <Text style={styles.stateTitle}>We couldn&apos;t load this skill</Text>
            <Text style={styles.stateText}>
              {skillQuery.error instanceof Error
                ? skillQuery.error.message
                : 'Something went wrong. Please try again.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              style={styles.retryButton}
              onPress={() => void skillQuery.refetch()}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!skillQuery.isPending && !skillQuery.error && !skill && (
          <View style={styles.statePanel}>
            <Ionicons color={AuthColors.secondary} name="search-outline" size={24} />
            <Text style={styles.stateTitle}>Skill not found</Text>
            <Text style={styles.stateText}>This skill may have been removed.</Text>
          </View>
        )}

        {skill ? (
          <>
            <View style={styles.skillHeader}>
              <View style={styles.skillIcon}>
                <Ionicons color={AuthColors.primary} name="sparkles-outline" size={24} />
              </View>
              <View style={styles.skillHeading}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.category}>{skill.category}</Text>
              </View>
              <View style={styles.proficiencyBadge}>
                <Text style={styles.proficiencyText}>{skill.proficiency}</Text>
              </View>
              <Text style={styles.tagline}>{skill.description}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons color={AuthColors.secondary} name="time-outline" size={15} />
                  <Text style={styles.metaText}>
                    {skill.experienceYears > 0 ? `${skill.experienceYears} yr` : ''}
                    {skill.experienceYears > 0 && skill.experienceMonths > 0 ? ' ' : ''}
                    {skill.experienceMonths > 0 ? `${skill.experienceMonths} mo` : ''}
                    {skill.experienceYears === 0 && skill.experienceMonths === 0 ? 'New skill' : ''}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons color={AuthColors.secondary} name="people-outline" size={15} />
                  <Text style={styles.metaText}>
                    {skill.acknowledgements} acknowledgements
                  </Text>
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
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <View style={styles.tabs}>
              {TABS.map((tab) => (
                <Pressable
                  key={tab}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeTab === tab }}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                  {tab === 'Evidence' && evidence.length > 0 ? (
                    <Text style={[styles.tabCount, activeTab === tab && styles.activeTabText]}>
                      {evidence.length}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>

            {activeTab === 'Overview' &&
              (evidenceQuery.isPending || statisticsQuery.isPending ? (
                <SectionLoading />
              ) : evidenceQuery.error || statisticsQuery.error ? (
                <SectionError onRetry={refresh} />
              ) : (
                <SkillOverviewSection
                  evidence={evidence}
                  skill={skill}
                  statistics={statisticsQuery.data ?? undefined}
                  onEvidencePress={openEvidence}
                />
              ))}
            {activeTab === 'Evidence' &&
              (evidenceQuery.isPending ? (
                <SectionLoading />
              ) : evidenceQuery.error ? (
                <SectionError onRetry={() => void evidenceQuery.refetch()} />
              ) : (
                <SkillEvidenceSection evidence={evidence} onEvidencePress={openEvidence} />
              ))}
            {activeTab === 'People' &&
              (peopleQuery.isPending ? (
                <SectionLoading />
              ) : peopleQuery.error ? (
                <SectionError onRetry={() => void peopleQuery.refetch()} />
              ) : (
                <SkillPeopleSection people={people} />
              ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLoading() {
  return (
    <View style={styles.sectionLoading}>
      <ActivityIndicator color={AuthColors.primary} size="small" />
      <Text style={styles.stateText}>Loading skill information...</Text>
    </View>
  );
}

function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.sectionError}>
      <Text style={styles.stateText}>We couldn&apos;t load this section.</Text>
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </View>
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
    paddingBottom: 26,
    paddingHorizontal: 20,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 11,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  topBarTitle: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
  },
  topBarSpacer: {
    width: 40,
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    padding: 22,
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
    marginTop: 8,
  },
  skillHeader: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 13,
    padding: 17,
  },
  skillIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    marginBottom: 13,
    width: 48,
  },
  skillHeading: {
    paddingRight: 82,
  },
  skillName: {
    color: AuthColors.text,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  category: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  proficiencyBadge: {
    backgroundColor: '#F4F2EC',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
    right: 16,
    top: 17,
  },
  proficiencyText: {
    color: AuthColors.secondary,
    fontSize: 9,
    fontWeight: '700',
  },
  tagline: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaText: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  progressLabel: {
    color: AuthColors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  progressValue: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#F0EEE8',
    borderRadius: 4,
    height: 7,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: AuthColors.primary,
    borderRadius: 4,
    height: '100%',
  },
  tabs: {
    borderBottomColor: AuthColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 21,
  },
  tab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 44,
  },
  activeTab: {
    borderBottomColor: AuthColors.primary,
  },
  tabText: {
    color: AuthColors.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  activeTabText: {
    color: AuthColors.primary,
  },
  tabCount: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  sectionLoading: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 22,
  },
  sectionError: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 22,
  },
});
