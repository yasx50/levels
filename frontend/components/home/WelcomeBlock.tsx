import { StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

type Props = {
  firstName?: string;
};

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeBlock({ firstName }: Props) {
  const greeting = getGreeting(new Date().getHours());

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting},</Text>
      <Text style={styles.name}>{firstName || 'there'}.</Text>
      <Text style={styles.subtitle}>
        Build the confidence behind your next evolution.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  greeting: {
    color: AuthColors.secondary,
    fontSize: 15,
  },
  name: {
    color: AuthColors.text,
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  subtitle: {
    color: AuthColors.secondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
});
