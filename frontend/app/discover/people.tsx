import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersonCard } from '@/components/discover/PersonCard';
import { AuthColors } from '@/constants/theme';
import { mockDiscoverPeople } from '@/services/discover.mock';

export default function DiscoverPeople() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(
    typeof params.query === 'string' ? params.query : '',
  );
  const [statuses, setStatuses] = useState<Record<string, 'none' | 'loading' | 'sent'>>({});

  const people = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mockDiscoverPeople;
    return mockDiscoverPeople.filter((person) =>
      [person.name, person.designation, ...person.skills]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  function toggleConnection(personId: string) {
    const status = statuses[personId] ?? 'none';
    if (status === 'loading') return;
    if (status === 'sent') {
      setStatuses((current) => ({ ...current, [personId]: 'none' }));
      return;
    }
    setStatuses((current) => ({ ...current, [personId]: 'loading' }));
    setTimeout(() => {
      setStatuses((current) => ({ ...current, [personId]: 'sent' }));
    }, 500);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.topBarTitle}>Discover people</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons color={AuthColors.muted} name="search-outline" size={18} />
          <TextInput
            accessibilityLabel="Search people"
            autoCapitalize="none"
            placeholder="Search people..."
            placeholderTextColor={AuthColors.muted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
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

        <Text style={styles.resultTitle}>
          {people.length} {people.length === 1 ? 'person' : 'people'}
        </Text>
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            connectionStatus={statuses[person.id] ?? 'none'}
            onConnect={() => toggleConnection(person.id)}
            onPress={() =>
              router.push({
                pathname: '/users/[userId]',
                params: { userId: person.id },
              })
            }
          />
        ))}
        {people.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>No people found</Text>
            <Text style={styles.emptyDescription}>
              Try a name, role, or skill in the search.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: AuthColors.background, flex: 1 },
  content: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingBottom: 24,
    paddingHorizontal: 20,
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 14,
    paddingTop: 10,
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
  searchBox: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 13,
  },
  searchInput: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 9,
  },
  resultTitle: {
    color: AuthColors.secondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 11,
    marginTop: 16,
  },
  emptyPanel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyDescription: {
    color: AuthColors.secondary,
    fontSize: 11,
    marginTop: 6,
  },
});
