import { StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

interface WelcomeSectionProps {
  badge: string;
  description: string;
  title: string;
}

export function WelcomeSection({
  badge,
  description,
  title,
}: WelcomeSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{badge}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 10,
    color: AuthColors.secondary,
    fontSize: 9,
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  title: {
    color: AuthColors.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
});
