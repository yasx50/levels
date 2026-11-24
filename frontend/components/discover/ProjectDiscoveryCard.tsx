import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';
import type { DiscoverProject } from '@/types/discover';

type Props = {
  project: DiscoverProject;
  onOwnerPress: () => void;
  onPress: () => void;
};

export function ProjectDiscoveryCard({ project, onOwnerPress, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.projectButton, pressed && styles.pressed]}
        onPress={onPress}
      >
        <View style={styles.heading}>
          <View style={styles.icon}>
            <Ionicons color={AuthColors.primary} name="briefcase-outline" size={19} />
          </View>
          <View style={styles.headingText}>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.category}>{project.category}</Text>
          </View>
          <Ionicons color={AuthColors.muted} name="chevron-forward" size={17} />
        </View>
        <Text numberOfLines={3} style={styles.description}>{project.description}</Text>
        <View style={styles.tags}>
          {project.technologies.map((technology) => (
            <View key={technology} style={styles.tag}>
              <Text style={styles.tagText}>{technology}</Text>
            </View>
          ))}
        </View>
      </Pressable>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          hitSlop={5}
          style={styles.owner}
          onPress={onOwnerPress}
        >
          <View style={styles.ownerAvatar}>
            <Text style={styles.ownerInitials}>{project.ownerInitials}</Text>
          </View>
          <Text numberOfLines={1} style={styles.ownerName}>{project.ownerName}</Text>
        </Pressable>
        <View style={styles.contributors}>
          <Ionicons color={AuthColors.secondary} name="people-outline" size={13} />
          <Text style={styles.contributorText}>{project.contributorCount}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.viewButton}
          onPress={onPress}
        >
          <Text style={styles.viewText}>View Project</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  projectButton: {},
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headingText: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  category: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 11,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  tagText: {
    color: AuthColors.secondary,
    fontSize: 9,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    borderTopColor: AuthColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 11,
  },
  owner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  ownerAvatar: {
    alignItems: 'center',
    backgroundColor: '#F1E8DF',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  ownerInitials: {
    color: AuthColors.primary,
    fontSize: 8,
    fontWeight: '800',
  },
  ownerName: {
    color: AuthColors.text,
    flexShrink: 1,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 7,
  },
  contributors: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: 8,
  },
  contributorText: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
  viewButton: {
    borderColor: AuthColors.primary,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 9,
  },
  viewText: {
    color: AuthColors.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
