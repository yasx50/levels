import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersonCard } from '@/components/discover/PersonCard';
import { ProjectDiscoveryCard } from '@/components/discover/ProjectDiscoveryCard';
import { SkillDiscoveryCard } from '@/components/discover/SkillDiscoveryCard';
import { DashboardHeader } from '@/components/home/DashboardHeader';
import { AuthColors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  mockDiscoverPeople,
  mockDiscoverProjects,
  mockDiscoverSkills,
} from '@/services/discover.mock';

type DiscoverTab = 'people' | 'skills' | 'projects';
type ConnectionStatus = 'none' | 'loading' | 'sent';
type LoadState = 'loading' | 'ready' | 'error';

const TABS: { id: DiscoverTab; label: string }[] = [
  { id: 'people', label: 'People' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

export default function Discover() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DiscoverTab>('people');
  const [search, setSearch] = useState('');
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [connectionStatuses, setConnectionStatuses] = useState<
    Record<string, ConnectionStatus>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => setLoadState('ready'), 350);
    return () => clearTimeout(timer);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const people = useMemo(() => {
    if (!normalizedSearch) return mockDiscoverPeople;
    return mockDiscoverPeople.filter((person) =>
      [person.name, person.designation, ...person.skills]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);
  const skills = useMemo(() => {
    if (!normalizedSearch) return mockDiscoverSkills;
    return mockDiscoverSkills.filter((skill) =>
      [skill.name, skill.category, skill.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);
  const projects = useMemo(() => {
    if (!normalizedSearch) return mockDiscoverProjects;
    return mockDiscoverProjects.filter((project) =>
      [project.title, project.description, project.category, ...project.technologies]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const visibleCount =
    activeTab === 'people' ? people.length : activeTab === 'skills' ? skills.length : projects.length;

  function reload() {
    setLoadState('loading');
    setTimeout(() => setLoadState('ready'), 350);
  }

  function toggleConnection(personId: string) {
    const status = connectionStatuses[personId] ?? 'none';
    if (status === 'loading') return;
    if (status === 'sent') {
      setConnectionStatuses((current) => ({ ...current, [personId]: 'none' }));
      return;
    }

    setConnectionStatuses((current) => ({ ...current, [personId]: 'loading' }));
    setTimeout(() => {
      setConnectionStatuses((current) => ({ ...current, [personId]: 'sent' }));
    }, 500);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            colors={[AuthColors.primary]}
            refreshing={loadState === 'loading'}
            tintColor={AuthColors.primary}
            onRefresh={reload}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader avatar={user?.image} />

        <View style={styles.introduction}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>
            Find people, evidence, and ideas that move your work forward.
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons color={AuthColors.muted} name="search-outline" size={18} />
          <TextInput
            accessibilityLabel="Search people, skills, and projects"
            autoCapitalize="none"
            placeholder="Search people, skills, projects"
            placeholderTextColor={AuthColors.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 ? (
            <Pressable
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSearch('')}
            >
              <Ionicons color={AuthColors.secondary} name="close-circle" size={18} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab.id }}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {loadState === 'loading' ? (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} size="small" />
            <Text style={styles.stateText}>Loading discoveries...</Text>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        ) : loadState === 'error' ? (
          <View style={styles.statePanel}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={24} />
            <Text style={styles.stateTitle}>We couldn&apos;t load discoveries</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.retryButton}
              onPress={reload}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {activeTab === 'people' ? (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>Suggested for you</Text>
                  <Pressable
                    accessibilityRole="button"
                    hitSlop={6}
                    onPress={() => router.push('/discover/people')}
                  >
                    <Text style={styles.viewAll}>View all people</Text>
                  </Pressable>
                </View>
                {people.length > 0 ? (
                  people.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      connectionStatus={connectionStatuses[person.id] ?? 'none'}
                      onConnect={() => toggleConnection(person.id)}
                      onPress={() =>
                        router.push({
                          pathname: '/users/[userId]',
                          params: { userId: person.id },
                        })
                      }
                    />
                  ))
                ) : (
                  <EmptyState query={search} />
                )}
              </>
            ) : null}

            {activeTab === 'skills' ? (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>Suggested skills</Text>
                  <Text style={styles.resultCount}>{visibleCount} skills</Text>
                </View>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <SkillDiscoveryCard
                      key={skill.id}
                      skill={skill}
                      onPress={() =>
                        router.push({
                          pathname: '/skills/[skillId]',
                          params: { skillId: skill.id },
                        })
                      }
                    />
                  ))
                ) : (
                  <EmptyState query={search} />
                )}
              </>
            ) : null}

            {activeTab === 'projects' ? (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>Suggested projects</Text>
                  <Text style={styles.resultCount}>{visibleCount} projects</Text>
                </View>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <ProjectDiscoveryCard
                      key={project.id}
                      project={project}
                      onOwnerPress={() =>
                        router.push({
                          pathname: '/users/[userId]',
                          params: { userId: project.ownerId },
                        })
                      }
                      onPress={() =>
                        router.push({
                          pathname: '/projects/[projectId]',
                          params: { projectId: project.id },
                        })
                      }
                    />
                  ))
                ) : (
                  <EmptyState query={search} />
                )}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <View style={styles.emptyPanel}>
      <View style={styles.emptyIcon}>
        <Ionicons color={AuthColors.primary} name="search-outline" size={22} />
      </View>
      <Text style={styles.emptyTitle}>No discoveries found</Text>
      <Text style={styles.emptyDescription}>
        {query.trim()
          ? `No matches found for "${query.trim()}". Try a broader search.`
          : 'Try refreshing or check back later.'}
      </Text>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    width: '100%',
  },
  introduction: {
    marginTop: -4,
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
    lineHeight: 18,
    marginTop: 5,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 18,
    minHeight: 48,
    paddingHorizontal: 13,
  },
  searchInput: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 9,
  },
  tabs: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 20,
    marginTop: 14,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  activeTab: {
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
  },
  tabText: {
    color: AuthColors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  activeTabText: {
    color: AuthColors.card,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  viewAll: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  resultCount: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
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
    marginTop: 8,
  },
  skeletonCard: {
    alignSelf: 'stretch',
    backgroundColor: '#F3F1E9',
    borderRadius: 12,
    height: 72,
    marginTop: 12,
  },
  retryButton: {
    borderColor: AuthColors.primary,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
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
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  emptyTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDescription: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
    textAlign: 'center',
  },
});
