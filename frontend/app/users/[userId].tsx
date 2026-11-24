import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/theme';
import { mockDiscoverPeople } from '@/services/discover.mock';

export default function UserProfile() {
  const { userId: param } = useLocalSearchParams<{ userId: string | string[] }>();
  const userId = Array.isArray(param) ? param[0] : param ?? '';
  const person = mockDiscoverPeople.find((item) => item.id === userId);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.topBarTitle}>Profile</Text>
        </View>

        {person ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{person.initials}</Text>
            </View>
            {person.level ? (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {person.level}</Text>
              </View>
            ) : null}
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.designation}>{person.designation}</Text>
            <Text style={styles.description}>{person.description}</Text>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.tags}>
              {person.skills.map((skill) => (
                <View key={skill} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <Text style={styles.name}>Profile not found</Text>
            <Text style={styles.description}>This profile may have been removed.</Text>
          </View>
        )}
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
    paddingVertical: 10,
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
  profileCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 12,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F1E8DF',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  initials: {
    color: AuthColors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  levelBadge: {
    backgroundColor: '#F7EEE8',
    borderRadius: 8,
    position: 'absolute',
    right: 18,
    top: 18,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  levelText: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  name: {
    color: AuthColors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 14,
  },
  designation: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
  },
  tag: {
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  tagText: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
});
