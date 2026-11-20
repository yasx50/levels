import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthColors } from '@/constants/theme';
import { getErrorMessage, useAuth } from '@/context/AuthContext';

export function LoginForm() {
  const { sessionError, signIn, retrySession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setFormError('Enter your email and password to continue.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Sign in to your SEN</Text>
      <Text style={styles.subtitle}>Pick up where your next evolution begins.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="name@example.com"
        placeholderTextColor={AuthColors.muted}
        returnKeyType="next"
        selectionColor={AuthColors.primary}
        style={styles.input}
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordInput}>
        <TextInput
          autoCapitalize="none"
          autoComplete="current-password"
          placeholder="Enter your password"
          placeholderTextColor={AuthColors.muted}
          returnKeyType="done"
          secureTextEntry={!passwordVisible}
          selectionColor={AuthColors.primary}
          style={styles.passwordTextInput}
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleSignIn}
        />
        <Pressable
          accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setPasswordVisible((visible) => !visible)}
        >
          <SymbolView
            name={
              passwordVisible
                ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                : { ios: 'eye', android: 'visibility', web: 'visibility' }
            }
            size={15}
            tintColor={AuthColors.secondary}
          />
        </Pressable>
      </View>
      <Text style={styles.helper}>
        Use the email connected to your professional identity.
      </Text>

      {sessionError && (
        <View style={styles.sessionError}>
          <Text style={styles.errorText}>{sessionError}</Text>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={() => {
              void retrySession();
            }}
          >
            <Text style={styles.retryText}>Retry session check</Text>
          </Pressable>
        </View>
      )}
      {formError && <Text style={styles.errorText}>{formError}</Text>}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isSubmitting) && styles.pressed,
        ]}
        onPress={handleSignIn}
      >
        {isSubmitting ? (
          <ActivityIndicator color={AuthColors.card} size="small" />
        ) : (
          <>
            <Text style={styles.submitText}>Sign in</Text>
            <SymbolView
              name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
              size={13}
              tintColor={AuthColors.card}
            />
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: AuthColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: AuthColors.secondary,
    fontSize: 10,
    marginTop: 4,
  },
  label: {
    color: AuthColors.text,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 13,
  },
  input: {
    borderColor: AuthColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: AuthColors.text,
    fontSize: 11,
    height: 32,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  passwordInput: {
    alignItems: 'center',
    borderColor: AuthColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 32,
    paddingLeft: 10,
    paddingRight: 9,
  },
  passwordTextInput: {
    color: AuthColors.text,
    flex: 1,
    fontSize: 11,
    height: '100%',
    paddingVertical: 0,
  },
  helper: {
    color: AuthColors.secondary,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 5,
  },
  sessionError: {
    marginTop: 10,
  },
  errorText: {
    color: AuthColors.primary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  retryText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    height: 34,
    justifyContent: 'center',
    marginTop: 12,
  },
  submitText: {
    color: AuthColors.card,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
