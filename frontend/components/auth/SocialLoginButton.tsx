import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { AuthColors } from '@/constants/theme';

export function SocialLoginButton() {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={() =>
        Alert.alert('Work sign-in unavailable', 'Work account sign-in is not connected yet.')
      }
    >
      <SymbolView
        name={{ ios: 'briefcase', android: 'work', web: 'work' }}
        size={14}
        tintColor={AuthColors.text}
      />
      <Text style={styles.label}>Continue with work account</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: AuthColors.background,
    borderColor: AuthColors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    height: 34,
    justifyContent: 'center',
  },
  label: {
    color: AuthColors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
