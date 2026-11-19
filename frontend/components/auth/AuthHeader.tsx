import { StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/theme';

export function AuthHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>SEN</Text>
      <Text style={styles.description}>Skill Evolution Network</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brand: {
    color: AuthColors.text,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  description: {
    color: AuthColors.secondary,
    fontSize: 9,
  },
});
