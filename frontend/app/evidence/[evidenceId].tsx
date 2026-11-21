import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthColors } from '@/constants/theme';
import { useSkill, useSkillEvidence } from '@/hooks/useSkills';

export default function EvidenceDetail() {
  const params = useLocalSearchParams<{
    evidenceId: string | string[];
    skillId?: string | string[];
  }>();
  const evidenceId = Array.isArray(params.evidenceId)
    ? params.evidenceId[0]
    : params.evidenceId ?? '';
  const skillId = Array.isArray(params.skillId) ? params.skillId[0] : params.skillId ?? '';
  const skillQuery = useSkill(skillId);
  const evidenceQuery = useSkillEvidence(skillId);
  const evidence = evidenceQuery.data?.find((item) => item.id === evidenceId);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
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
          <Text style={styles.topTitle}>Evidence</Text>
        </View>

        {(skillQuery.isPending || evidenceQuery.isPending) && (
          <View style={styles.panel}>
            <ActivityIndicator color={AuthColors.primary} />
            <Text style={styles.message}>Loading evidence...</Text>
          </View>
        )}
        {(skillQuery.error || evidenceQuery.error) && (
          <View style={styles.panel}>
            <Ionicons color={AuthColors.primary} name="cloud-offline-outline" size={24} />
            <Text style={styles.title}>We couldn&apos;t load this evidence</Text>
            <Text style={styles.message}>
              {skillQuery.error instanceof Error
                ? skillQuery.error.message
                : evidenceQuery.error instanceof Error
                  ? evidenceQuery.error.message
                  : 'Please try again.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void skillQuery.refetch();
                void evidenceQuery.refetch();
              }}
            >
              <Text style={styles.retry}>Try again</Text>
            </Pressable>
          </View>
        )}
        {!skillQuery.isPending &&
          !evidenceQuery.isPending &&
          !skillQuery.error &&
          !evidenceQuery.error &&
          evidence && (
            <View style={styles.detailCard}>
              <View style={styles.iconBox}>
                <Ionicons color={AuthColors.primary} name="document-text-outline" size={23} />
              </View>
              <Text style={styles.title}>{evidence.title}</Text>
              <Text style={styles.skillLink}>{skillQuery.data?.name ?? 'Skill evidence'}</Text>
              <Text style={styles.description}>{evidence.description}</Text>
              <View style={styles.divider} />
              <Metadata label="Added" value={formatDate(evidence.dateAdded)} />
              <Metadata label="Type" value={evidence.type} />
              {evidence.source ? <Metadata label="Source" value={evidence.source} /> : null}
            </View>
          )}
        {!skillQuery.isPending &&
          !evidenceQuery.isPending &&
          !skillQuery.error &&
          !evidenceQuery.error &&
          !evidence && (
            <View style={styles.panel}>
              <Ionicons color={AuthColors.secondary} name="document-outline" size={24} />
              <Text style={styles.title}>Evidence not found</Text>
              <Text style={styles.message}>This evidence may have been removed.</Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metadataRow}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text style={styles.metadataValue}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
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
  topTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
  },
  detailCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 16,
    padding: 18,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  title: {
    color: AuthColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 13,
  },
  skillLink: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 15,
  },
  divider: {
    backgroundColor: AuthColors.border,
    height: 1,
    marginVertical: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metadataLabel: {
    color: AuthColors.secondary,
    fontSize: 11,
  },
  metadataValue: {
    color: AuthColors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  panel: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    padding: 22,
  },
  message: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  retry: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 13,
  },
});
