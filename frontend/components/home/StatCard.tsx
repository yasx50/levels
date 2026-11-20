import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: number | null;
};

export function StatCard({ icon, label, value }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons color={AuthColors.primary} name={icon} size={18} />
      </View>
      <Text style={styles.value}>
        {value == null ? 'N/A' : value.toLocaleString()}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.card,
    borderColor: AuthColors.border,
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    minHeight: 112,
    padding: 13,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#F8EEE8',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  value: {
    color: AuthColors.text,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 9,
  },
  label: {
    color: AuthColors.secondary,
    fontSize: 11,
    marginTop: 1,
  },
});
