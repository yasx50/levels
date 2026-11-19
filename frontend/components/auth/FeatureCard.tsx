import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

interface FeatureCardProps {
  description: string;
  icon: SymbolViewProps['name'];
  title: string;
}

export function FeatureCard({ description, icon, title }: FeatureCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SymbolView
          name={icon}
          size={15}
          tintColor={AuthColors.secondary}
          type="hierarchical"
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: AuthColors.iconBackground,
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: AuthColors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 10,
    lineHeight: 14,
  },
});
