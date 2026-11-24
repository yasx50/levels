import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/theme';
import { mockDiscoverProjects } from '@/services/discover.mock';

export default function ProjectDetail() {
  const { projectId: param } = useLocalSearchParams<{ projectId: string | string[] }>();
  const projectId = Array.isArray(param) ? param[0] : param ?? '';
  const project = mockDiscoverProjects.find((item) => item.id === projectId);

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
          <Text style={styles.topBarTitle}>Project details</Text>
        </View>

        {project ? (
          <View style={styles.card}>
            <View style={styles.icon}>
              <Ionicons color={AuthColors.primary} name="briefcase-outline" size={24} />
            </View>
            <Text style={styles.category}>{project.category}</Text>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.description}>{project.description}</Text>
            <Text style={styles.sectionLabel}>Technologies</Text>
            <View style={styles.tags}>
              {project.technologies.map((technology) => (
                <View key={technology} style={styles.tag}>
                  <Text style={styles.tagText}>{technology}</Text>
                </View>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              style={styles.ownerRow}
              onPress={() =>
                router.push({
                  pathname: '/users/[userId]',
                  params: { userId: project.ownerId },
                })
              }
            >
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerInitials}>{project.ownerInitials}</Text>
              </View>
              <View style={styles.ownerText}>
                <Text style={styles.ownerLabel}>Project owner</Text>
                <Text style={styles.ownerName}>{project.ownerName}</Text>
              </View>
              <Ionicons color={AuthColors.muted} name="chevron-forward" size={17} />
            </Pressable>
            <View style={styles.contributorRow}>
              <Ionicons color={AuthColors.secondary} name="people-outline" size={15} />
              <Text style={styles.contributorText}>
                {project.contributorCount} contributors
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Project not found</Text>
            <Text style={styles.description}>This project may have been removed.</Text>
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
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 12,
    padding: 18,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  category: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 14,
  },
  title: {
    color: AuthColors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },
  sectionLabel: {
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
  ownerRow: {
    alignItems: 'center',
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 18,
    paddingTop: 14,
  },
  ownerAvatar: {
    alignItems: 'center',
    backgroundColor: '#F1E8DF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  ownerInitials: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  ownerText: {
    flex: 1,
    marginLeft: 10,
  },
  ownerLabel: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  ownerName: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  contributorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  contributorText: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
});
