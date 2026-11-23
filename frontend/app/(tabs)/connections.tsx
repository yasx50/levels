import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';

import { AuthColors } from '@/constants/theme';
import {
  cloneMockConnections,
  initialMockConnections,
} from '@/services/connections.mock';
import type {
  MockConnection,
  MockConnectionData,
  MockConnectionRequest,
} from '@/types/connections';

type MainTab = 'connections' | 'requests' | 'following';
type RequestTab = 'incoming' | 'outgoing';
type LoadState = 'loading' | 'ready' | 'error';

export default function Connections() {
  const [data, setData] = useState<MockConnectionData>(() =>
    cloneMockConnections(initialMockConnections),
  );
  const [mainTab, setMainTab] = useState<MainTab>('connections');
  const [requestTab, setRequestTab] = useState<RequestTab>('incoming');
  const [recentOnly, setRecentOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');

  useEffect(() => {
    const timer = setTimeout(() => setLoadState('ready'), 350);
    return () => clearTimeout(timer);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const following = useMemo(
    () => data.connections.concat(data.suggestions).filter((person, index, list) =>
      data.followingIds.includes(person.id) &&
      list.findIndex((candidate) => candidate.id === person.id) === index,
    ),
    [data],
  );
  const visibleConnections = useMemo(() => {
    const people = recentOnly
      ? data.connections.slice(0, 3)
      : data.connections;
    return people.filter((person) => matchesSearch(person, normalizedSearch));
  }, [data.connections, normalizedSearch, recentOnly]);
  const visibleRequests = useMemo(() => {
    const requests =
      requestTab === 'incoming' ? data.incomingRequests : data.outgoingRequests;
    return requests.filter((person) => matchesSearch(person, normalizedSearch));
  }, [data.incomingRequests, data.outgoingRequests, normalizedSearch, requestTab]);
  const visibleFollowing = useMemo(() => {
    const followedIds = new Set(following.map((person) => person.id));
    const people =
      mainTab === 'following'
        ? following.concat(data.suggestions.filter((person) => !followedIds.has(person.id)))
        : following;
    return people.filter((person) => matchesSearch(person, normalizedSearch));
  }, [data.suggestions, following, mainTab, normalizedSearch]);

  function reloadMockData() {
    setLoadState('loading');
    setTimeout(() => {
      try {
        setData(cloneMockConnections(initialMockConnections));
        setLoadState('ready');
      } catch {
        setLoadState('error');
      }
    }, 350);
  }

  function acceptRequest(request: MockConnectionRequest) {
    setData((current) => ({
      ...current,
      incomingRequests: current.incomingRequests.filter((item) => item.id !== request.id),
      connections: [{ ...request, connectedAt: 'Just now' }, ...current.connections],
    }));
  }

  function rejectRequest(requestId: string) {
    setData((current) => ({
      ...current,
      incomingRequests: current.incomingRequests.filter((item) => item.id !== requestId),
    }));
  }

  function toggleFollowing(personId: string) {
    setData((current) => ({
      ...current,
      followingIds: current.followingIds.includes(personId)
        ? current.followingIds.filter((id) => id !== personId)
        : [...current.followingIds, personId],
    }));
  }

  const pendingCount = data.incomingRequests.length + data.outgoingRequests.length;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Connections</Text>
            <Text style={styles.subtitle}>Build your professional circle.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons color={AuthColors.primary} name="people-outline" size={22} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="people-outline"
            label="Connections"
            value={data.connections.length}
          />
          <StatCard icon="time-outline" label="Pending" value={pendingCount} />
          <StatCard
            icon="heart-outline"
            label="Following"
            value={data.followingIds.length}
          />
        </View>

        <View style={styles.tabs}>
          <MainTabButton
            active={mainTab === 'connections'}
            label="People"
            count={data.connections.length}
            onPress={() => setMainTab('connections')}
          />
          <MainTabButton
            active={mainTab === 'requests'}
            label="Requests"
            count={pendingCount}
            onPress={() => setMainTab('requests')}
          />
          <MainTabButton
            active={mainTab === 'following'}
            label="Following"
            count={data.followingIds.length}
            onPress={() => setMainTab('following')}
          />
        </View>

        <View style={styles.searchBox}>
          <Ionicons color={AuthColors.muted} name="search-outline" size={18} />
          <TextInput
            accessibilityLabel="Search users and connections"
            autoCapitalize="none"
            placeholder="Search people..."
            placeholderTextColor={AuthColors.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSearch('')}
            >
              <Ionicons color={AuthColors.secondary} name="close-circle" size={18} />
            </Pressable>
          )}
        </View>

        {mainTab === 'connections' && (
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Your circle</Text>
            <Pressable
              accessibilityRole="button"
              style={[styles.filterButton, recentOnly && styles.filterButtonActive]}
              onPress={() => setRecentOnly((current) => !current)}
            >
              <Ionicons
                color={recentOnly ? AuthColors.card : AuthColors.primary}
                name="time-outline"
                size={14}
              />
              <Text style={[styles.filterText, recentOnly && styles.filterTextActive]}>
                {recentOnly ? 'Recent' : 'All people'}
              </Text>
            </Pressable>
          </View>
        )}

        {mainTab === 'requests' && (
          <View style={styles.requestTabs}>
            <RequestTabButton
              active={requestTab === 'incoming'}
              count={data.incomingRequests.length}
              label="Received"
              onPress={() => setRequestTab('incoming')}
            />
            <RequestTabButton
              active={requestTab === 'outgoing'}
              count={data.outgoingRequests.length}
              label="Sent"
              onPress={() => setRequestTab('outgoing')}
            />
          </View>
        )}

        {mainTab === 'following' && (
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>People to follow</Text>
              <Text style={styles.sectionHint}>Keep up with people whose work you value.</Text>
            </View>
          </View>
        )}

        {loadState === 'loading' && (
          <View style={styles.statePanel}>
            <ActivityIndicator color={AuthColors.primary} />
            <Text style={styles.stateTitle}>Loading your connections...</Text>
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
          </View>
        )}

        {loadState === 'error' && (
          <View style={styles.statePanel}>
            <View style={styles.emptyIcon}>
              <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={22} />
            </View>
            <Text style={styles.stateTitle}>Connections couldn&apos;t be loaded</Text>
            <Text style={styles.stateDescription}>
              The temporary screen data is unavailable. Try loading it again.
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              onPress={reloadMockData}
            >
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {loadState === 'ready' && (
          <>
            {mainTab === 'connections' &&
              (visibleConnections.length > 0 ? (
                visibleConnections.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    expanded={expandedId === person.id}
                    subtitle={`${person.role} · ${person.company}`}
                    meta={`Connected ${person.connectedAt} · ${person.lastActive}`}
                    onPress={() =>
                      setExpandedId((current) => (current === person.id ? null : person.id))
                    }
                  />
                ))
              ) : (
                <EmptyState
                  icon={normalizedSearch ? 'search-outline' : 'people-outline'}
                  title={normalizedSearch ? 'No people found' : 'No connections yet'}
                  description={
                    normalizedSearch
                      ? 'Try another name, role, or company.'
                      : 'Your new connections will show up here.'
                }
                />
              ))}

            {mainTab === 'requests' &&
              (visibleRequests.length > 0 ? (
                visibleRequests.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    expanded={expandedId === person.id}
                    subtitle={`${person.role} · ${person.company}`}
                    meta={`${requestTab === 'incoming' ? 'Received' : 'Sent'} ${person.requestedAt} · ${person.mutualConnections} mutual`}
                    onPress={() =>
                      setExpandedId((current) => (current === person.id ? null : person.id))
                    }
                  >
                    {requestTab === 'incoming' ? (
                      <View style={styles.actions}>
                        <ActionButton
                          label="Accept"
                          icon="checkmark"
                          primary
                          onPress={() => acceptRequest(person)}
                        />
                        <ActionButton
                          label="Decline"
                          icon="close"
                          onPress={() => rejectRequest(person.id)}
                        />
                      </View>
                    ) : (
                      <View style={styles.pendingLabel}>
                        <Ionicons color={AuthColors.secondary} name="time-outline" size={15} />
                        <Text style={styles.pendingText}>Awaiting response</Text>
                      </View>
                    )}
                  </PersonCard>
                ))
              ) : (
                <EmptyState
                  icon="paper-plane-outline"
                  title={
                    normalizedSearch
                      ? 'No requests found'
                      : requestTab === 'incoming'
                        ? 'You’re all caught up'
                        : 'No sent requests'
                  }
                  description={
                    normalizedSearch
                      ? 'Try another name, role, or company.'
                      : requestTab === 'incoming'
                        ? 'New connection requests will appear here.'
                        : 'Requests you send will appear here.'
                  }
                />
              ))}

            {mainTab === 'following' &&
              (visibleFollowing.length > 0 ? (
                visibleFollowing.map((person) => {
                  const isFollowing = data.followingIds.includes(person.id);
                  return (
                    <PersonCard
                      key={person.id}
                      person={person}
                      expanded={expandedId === person.id}
                      subtitle={`${person.role} · ${person.company}`}
                      meta={`${person.mutualConnections} mutual connections · ${person.lastActive}`}
                      onPress={() =>
                        setExpandedId((current) =>
                          current === person.id ? null : person.id,
                        )
                      }
                    >
                      <Pressable
                        accessibilityRole="button"
                        style={({ pressed }) => [
                          styles.followButton,
                          isFollowing && styles.followingButton,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => toggleFollowing(person.id)}
                      >
                        <Ionicons
                          color={isFollowing ? AuthColors.secondary : AuthColors.card}
                          name={isFollowing ? 'checkmark' : 'add'}
                          size={16}
                        />
                        <Text
                          style={[
                            styles.followButtonText,
                            isFollowing && styles.followingButtonText,
                          ]}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </Text>
                      </Pressable>
                    </PersonCard>
                  );
                })
              ) : (
                <EmptyState
                  icon={normalizedSearch ? 'search-outline' : 'heart-outline'}
                  title={normalizedSearch ? 'No people found' : 'No people to show'}
                  description={
                    normalizedSearch
                      ? 'Try another name, role, or company.'
                      : 'Suggested people will appear here.'
                  }
                />
              ))}

            <Text style={styles.localNotice}>
              Temporary demo data · Changes stay on this screen and are not sent to a server.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function matchesSearch(person: MockConnection, query: string) {
  return (
    !query ||
    `${person.name} ${person.role} ${person.company}`.toLowerCase().includes(query)
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons color={AuthColors.primary} name={icon} size={16} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MainTabButton({
  active,
  count,
  label,
  onPress,
}: {
  active: boolean;
  count: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.mainTab, active && styles.mainTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.mainTabText, active && styles.mainTabTextActive]}>{label}</Text>
      {count > 0 && (
        <Text style={[styles.tabCount, active && styles.tabCountActive]}>{count}</Text>
      )}
    </Pressable>
  );
}

function RequestTabButton({
  active,
  count,
  label,
  onPress,
}: {
  active: boolean;
  count: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={[styles.requestTab, active && styles.requestTabActive]}
      onPress={onPress}
    >
      <Text style={[styles.requestTabText, active && styles.requestTabTextActive]}>
        {label}
      </Text>
      <Text style={[styles.requestCount, active && styles.requestCountActive]}>{count}</Text>
    </Pressable>
  );
}

function PersonCard({
  children,
  expanded,
  meta,
  onPress,
  person,
  subtitle,
}: {
  children?: React.ReactNode;
  expanded: boolean;
  meta: string;
  onPress: () => void;
  person: MockConnection;
  subtitle: string;
}) {
  return (
    <View style={styles.personCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${person.name}, ${subtitle}. ${expanded ? 'Hide' : 'View'} details`}
        onPress={onPress}
      >
        <View style={styles.personRow}>
          <View style={[styles.avatar, { backgroundColor: person.color }]}>
            <Text style={styles.avatarText}>{person.initials}</Text>
          </View>
          <View style={styles.personInfo}>
            <Text style={styles.personName}>{person.name}</Text>
            <Text numberOfLines={1} style={styles.personSubtitle}>
              {subtitle}
            </Text>
            <Text numberOfLines={1} style={styles.personMeta}>
              {meta}
            </Text>
          </View>
          <Ionicons
            color={AuthColors.muted}
            name={expanded ? 'chevron-up' : 'chevron-forward'}
            size={18}
          />
        </View>
      </Pressable>
      {expanded && (
        <View style={styles.details}>
          <Text style={styles.bio}>{person.bio}</Text>
          <Text style={styles.mutualText}>
            {person.mutualConnections} mutual connections
          </Text>
        </View>
      )}
      {children && <View style={styles.cardActions}>{children}</View>}
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  primary = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.actionButton,
        primary && styles.actionButtonPrimary,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        color={primary ? AuthColors.card : AuthColors.secondary}
        name={icon}
        size={15}
      />
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

function EmptyState({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
}) {
  return (
    <View style={styles.emptyPanel}>
      <View style={styles.emptyIcon}>
        <Ionicons color={AuthColors.primary} name={icon} size={23} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.stateDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  headerIcon: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'flex-start',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 112,
    padding: 12,
  },
  statIcon: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 9,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  statValue: {
    color: AuthColors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 2,
  },
  tabs: {
    backgroundColor: '#EFEEE8',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 4,
  },
  mainTab: {
    alignItems: 'center',
    borderRadius: 9,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 39,
  },
  mainTabActive: {
    backgroundColor: AuthColors.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  mainTabText: {
    color: AuthColors.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  mainTabTextActive: {
    color: AuthColors.text,
    fontWeight: '700',
  },
  tabCount: {
    color: AuthColors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  tabCountActive: {
    color: AuthColors.primary,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 46,
    paddingHorizontal: 13,
    marginBottom: 19,
  },
  searchInput: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 13,
    minHeight: 44,
    paddingVertical: 0,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
    minHeight: 30,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHint: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 4,
  },
  filterButton: {
    alignItems: 'center',
    borderColor: AuthColors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 32,
    paddingHorizontal: 10,
  },
  filterButtonActive: {
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
  },
  filterText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  filterTextActive: {
    color: AuthColors.card,
  },
  requestTabs: {
    borderBottomColor: AuthColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 13,
  },
  requestTab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginRight: 22,
    minHeight: 38,
    paddingHorizontal: 3,
  },
  requestTabActive: {
    borderBottomColor: AuthColors.primary,
  },
  requestTabText: {
    color: AuthColors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  requestTabTextActive: {
    color: AuthColors.primary,
    fontWeight: '700',
  },
  requestCount: {
    color: AuthColors.muted,
    fontSize: 10,
  },
  requestCountActive: {
    color: AuthColors.primary,
  },
  personCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
    padding: 13,
  },
  personRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 25,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  personInfo: {
    flex: 1,
    minWidth: 0,
  },
  personName: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  personSubtitle: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 3,
  },
  personMeta: {
    color: AuthColors.muted,
    fontSize: 9,
    marginTop: 4,
  },
  details: {
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  bio: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
  },
  mutualText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 8,
  },
  cardActions: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    alignItems: 'center',
    borderColor: AuthColors.border,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 37,
  },
  actionButtonPrimary: {
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
  },
  actionText: {
    color: AuthColors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  actionTextPrimary: {
    color: AuthColors.card,
  },
  pendingLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  pendingText: {
    color: AuthColors.secondary,
    fontSize: 10,
    fontWeight: '600',
  },
  followButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: AuthColors.primary,
    borderColor: AuthColors.primary,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 108,
    paddingHorizontal: 12,
  },
  followingButton: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
  },
  followButtonText: {
    color: AuthColors.card,
    fontSize: 10,
    fontWeight: '700',
  },
  followingButtonText: {
    color: AuthColors.secondary,
  },
  emptyPanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 3,
    paddingHorizontal: 22,
    paddingVertical: 25,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 24,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  emptyTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    padding: 23,
  },
  stateTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 11,
    textAlign: 'center',
  },
  stateDescription: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    textAlign: 'center',
  },
  skeletonLine: {
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 7,
    height: 10,
    marginTop: 19,
    width: '76%',
  },
  skeletonLineShort: {
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 7,
    height: 10,
    marginTop: 8,
    width: '48%',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 9,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 38,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: AuthColors.card,
    fontSize: 11,
    fontWeight: '700',
  },
  localNotice: {
    color: AuthColors.muted,
    fontSize: 9,
    lineHeight: 14,
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
