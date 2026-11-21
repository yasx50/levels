import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type {
  Skill,
  SkillEvidence,
  SkillRecognition,
  SkillStatistics,
} from '@/types/skills';

type OverviewProps = {
  skill: Skill;
  statistics?: SkillStatistics;
  evidence: SkillEvidence[];
  onEvidencePress: (evidenceId: string) => void;
};

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
}

export function SkillOverviewSection({
  skill,
  statistics,
  evidence,
  onEvidencePress,
}: OverviewProps) {
  const stats = statistics ?? skill.statistics;
  const recentEvidence = [...evidence]
    .sort((left, right) => right.dateAdded.localeCompare(left.dateAdded))
    .slice(0, 3);

  return (
    <>
      <View style={styles.signalCard}>
        <View style={styles.signalHeading}>
          <View>
            <Text style={styles.eyebrow}>YOUR SKILL SIGNAL</Text>
            <Text style={styles.signalTitle}>A growing professional story</Text>
          </View>
          <View style={styles.signalIcon}>
            <Ionicons color={AuthColors.primary} name="pulse-outline" size={20} />
          </View>
        </View>
        <View style={styles.statsGrid}>
          <Stat value={stats.acknowledgements} label="Acknowledgements" />
          <Stat value={stats.evidenceItems} label="Evidence items" />
          <Stat value={`${stats.experienceYears} yr`} label="Experience" />
          <Stat value={stats.momentum30Days} label="Mentioned · 30 days" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent evidence</Text>
        <Text style={styles.sectionCount}>{evidence.length} items</Text>
      </View>
      {recentEvidence.length === 0 ? (
        <EmptyNotice
          title="No evidence yet"
          message="Add projects and work that show this skill in practice."
          icon="document-text-outline"
        />
      ) : (
        recentEvidence.map((item) => (
          <EvidenceCard
            key={item.id}
            item={item}
            onPress={() => onEvidencePress(item.id)}
          />
        ))
      )}
    </>
  );
}

type EvidenceSectionProps = {
  evidence: SkillEvidence[];
  onEvidencePress: (evidenceId: string) => void;
};

export function SkillEvidenceSection({
  evidence,
  onEvidencePress,
}: EvidenceSectionProps) {
  if (evidence.length === 0) {
    return (
      <EmptyNotice
        title="No evidence linked"
        message="When you add work samples or projects, they will appear here."
        icon="folder-open-outline"
      />
    );
  }

  return (
    <View>
      {evidence.map((item) => (
        <EvidenceCard
          key={item.id}
          item={item}
          onPress={() => onEvidencePress(item.id)}
        />
      ))}
    </View>
  );
}

type PeopleSectionProps = {
  people: SkillRecognition[];
};

export function SkillPeopleSection({ people }: PeopleSectionProps) {
  if (people.length === 0) {
    return (
      <EmptyNotice
        title="No acknowledgements yet"
        message="When someone recognizes this skill, you will find them here."
        icon="people-outline"
      />
    );
  }

  return (
    <View>
      {people.map((person) => (
        <View key={person.id} style={styles.personCard}>
          <View style={styles.avatar}>
            {person.avatarUrl ? (
              <Image source={{ uri: person.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(person.name)}</Text>
            )}
          </View>
          <View style={styles.personContent}>
            <View style={styles.personHeading}>
              <Text numberOfLines={1} style={styles.personName}>
                {person.name}
              </Text>
              <Text style={styles.personDate}>{formatDate(person.dateAdded)}</Text>
            </View>
            {person.designation ? (
              <Text numberOfLines={1} style={styles.personRole}>
                {person.designation}
              </Text>
            ) : null}
            <Text style={styles.evidenceDescription}>{person.detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

type StatProps = {
  value: string | number;
  label: string;
};

function Stat({ value, label }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type EvidenceCardProps = {
  item: SkillEvidence;
  onPress: () => void;
};

function EvidenceCard({ item, onPress }: EvidenceCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.evidenceCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.evidenceTop}>
        <View style={styles.evidenceIcon}>
          <Ionicons color={AuthColors.primary} name="document-text-outline" size={17} />
        </View>
        <View style={styles.evidenceTitleGroup}>
          <Text numberOfLines={1} style={styles.evidenceTitle}>
            {item.title}
          </Text>
          <Text style={styles.evidenceDate}>{formatDate(item.dateAdded)}</Text>
        </View>
        <Ionicons color={AuthColors.muted} name="chevron-forward" size={17} />
      </View>
      <Text numberOfLines={2} style={styles.evidenceDescription}>
        {item.description}
      </Text>
      <View style={styles.evidenceMetadata}>
        <Text style={styles.evidenceType}>{item.type}</Text>
        {item.source ? <Text style={styles.evidenceSource}>{item.source}</Text> : null}
      </View>
    </Pressable>
  );
}

type EmptyNoticeProps = {
  title: string;
  message: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

function EmptyNotice({ title, message, icon }: EmptyNoticeProps) {
  return (
    <View style={styles.emptyNotice}>
      <Ionicons color={AuthColors.muted} name={icon} size={22} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

const styles = StyleSheet.create({
  signalCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    padding: 17,
  },
  signalHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: AuthColors.secondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  signalTitle: {
    color: AuthColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
  },
  signalIcon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 11,
    height: 39,
    justifyContent: 'center',
    width: 39,
  },
  statsGrid: {
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 17,
    paddingTop: 14,
  },
  stat: {
    marginBottom: 12,
    width: '50%',
  },
  statValue: {
    color: AuthColors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 3,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  sectionTitle: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionCount: {
    color: AuthColors.secondary,
    fontSize: 10,
  },
  evidenceCard: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  evidenceTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  evidenceIcon: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 9,
    height: 35,
    justifyContent: 'center',
    marginRight: 10,
    width: 35,
  },
  evidenceTitleGroup: {
    flex: 1,
  },
  evidenceTitle: {
    color: AuthColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  evidenceDate: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 3,
  },
  evidenceDescription: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 11,
  },
  evidenceMetadata: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  evidenceType: {
    backgroundColor: '#F8EEE8',
    borderRadius: 6,
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  evidenceSource: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  personCard: {
    alignItems: 'flex-start',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 11,
    overflow: 'hidden',
    width: 44,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  personContent: {
    flex: 1,
  },
  personHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personName: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    paddingRight: 8,
  },
  personDate: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  personRole: {
    color: AuthColors.primary,
    fontSize: 10,
    marginTop: 3,
  },
  emptyNotice: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 27,
  },
  emptyTitle: {
    color: AuthColors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyMessage: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
